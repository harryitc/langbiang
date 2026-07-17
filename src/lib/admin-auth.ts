import "server-only";
import { cookies } from "next/headers";
import { createHash } from "crypto";

const COOKIE = "tsl_admin";

/** Token phiên = hash của mật khẩu (không lưu mật khẩu thô trong cookie). */
export function sessionToken(password: string): string {
  return createHash("sha256").update(`${password}::trang-sang-langbiang`).digest("hex");
}

function expectedToken(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return null;
  return sessionToken(pw);
}

/** Kiểm tra request hiện tại có phải admin đã đăng nhập không. */
export async function isAdmin(): Promise<boolean> {
  const expected = expectedToken();
  if (!expected) return false;
  const jar = await cookies();
  return jar.get(COOKIE)?.value === expected;
}

export const ADMIN_COOKIE = COOKIE;
