// Xác thực khu quản trị — một mật khẩu chung cho Ban Tổ chức (FR1).
// Cookie tsl_admin = sha256(password + salt), httpOnly/secure/sameSite=lax.
import { createHash } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "tsl_admin";
const SALT = process.env.ADMIN_AUTH_SALT || "trang-sang-langbiang::admin::salt";
/** Phiên đăng nhập giữ 30 ngày. */
const MAX_AGE = 60 * 60 * 24 * 30;

function sha256(input: string): string {
  return createHash("sha256").update(input).digest("hex");
}

/** Hash kỳ vọng của mật khẩu quản trị hiện tại (theo ENV). */
function expectedHash(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return sha256(pw + SALT);
}

/** Đã đăng nhập quản trị hay chưa. */
export async function isAdmin(): Promise<boolean> {
  const expected = expectedHash();
  if (!expected) return false;
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return !!token && token === expected;
}

/**
 * Đăng nhập: so mật khẩu với ADMIN_PASSWORD; đúng thì set cookie phiên.
 * Trả về true/false. Chỉ gọi trong Server Action / Route Handler.
 */
export async function signIn(password: string): Promise<boolean> {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || password !== pw) return false;
  const store = await cookies();
  store.set(COOKIE_NAME, sha256(pw + SALT), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return true;
}

/** Đăng xuất: xoá cookie phiên. */
export async function signOut(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
