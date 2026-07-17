"use server";

// Server actions đăng nhập / đăng xuất khu quản trị (FR1).
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/admin-auth";

export type LoginState = { error?: string };

/** Action đăng nhập dùng với useActionState. */
export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { error: "Vui lòng nhập mật khẩu." };
  const ok = await signIn(password);
  if (!ok) return { error: "Sai mật khẩu, vui lòng thử lại." };
  redirect("/admin");
}

/** Action đăng xuất. */
export async function logoutAction(): Promise<void> {
  await signOut();
  redirect("/admin/login");
}
