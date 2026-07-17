import "server-only";
import { redirect } from "next/navigation";
import { draftMode } from "next/headers";
import { isAdmin } from "./admin-auth";

/** Chặn trang admin nếu chưa đăng nhập. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** Draft Mode có đang bật không (để hiện đúng trạng thái công tắc "Xem nháp"). */
export async function previewEnabled(): Promise<boolean> {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false;
  }
}
