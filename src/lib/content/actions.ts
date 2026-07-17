"use server";

import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { ADMIN_COOKIE, isAdmin, sessionToken } from "@/lib/admin-auth";
import { CONTENT_TAG, getDraftContent, publishDraft, writeDraft } from "./store";
import { SECTION_KEYS, type SectionKey, type SiteContent } from "./schema";

const MONTH = 60 * 60 * 24 * 30;

/** Đăng nhập admin: khớp mật khẩu -> đặt cookie phiên + bật Draft Mode để xem trước. */
export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    redirect("/admin/login?error=1");
  }
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, sessionToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MONTH,
  });
  (await draftMode()).enable();
  redirect("/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  try {
    (await draftMode()).disable();
  } catch {
    /* bỏ qua */
  }
  redirect("/admin/login");
}

/** Bật/tắt xem trước bản nháp (Draft Mode) cho trình duyệt admin. */
export async function setPreviewAction(on: boolean) {
  if (!(await isAdmin())) return { ok: false };
  const dm = await draftMode();
  if (on) dm.enable();
  else dm.disable();
  return { ok: true };
}

/** Lưu nháp một phần nội dung (autosave). Editor nào cũng dùng chung action này. */
export async function saveSectionDraftAction<K extends SectionKey>(
  section: K,
  value: SiteContent[K]
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "unauthorized" };
  if (!SECTION_KEYS.includes(section)) return { ok: false, error: "bad_section" };
  try {
    const draft = await getDraftContent();
    await writeDraft({ ...draft, [section]: value });
    return { ok: true };
  } catch {
    return { ok: false, error: "save_failed" };
  }
}

/** Xuất bản nháp ra public + làm mới cache. */
export async function publishAction(): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "unauthorized" };
  try {
    await publishDraft();
    updateTag(CONTENT_TAG);
    revalidatePath("/", "layout");
    return { ok: true };
  } catch {
    return { ok: false, error: "publish_failed" };
  }
}
