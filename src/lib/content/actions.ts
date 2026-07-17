"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath, updateTag } from "next/cache";
import { ADMIN_COOKIE, isAdmin, sessionToken } from "@/lib/admin-auth";
import { CONTENT_TAG, getContent, getDraftContent, publishDraft, writeDraft } from "./store";
import type { SiteContent, SiteMeta } from "./schema";
import type { NewsPost } from "@/lib/site";

const MONTH = 60 * 60 * 24 * 30;

/** Đăng nhập admin: khớp mật khẩu -> đặt cookie phiên. */
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
  redirect("/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/** Lưu bản nháp toàn bộ (ít dùng — thường lưu theo từng phần bên dưới). */
export async function saveDraftAction(
  content: SiteContent
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "unauthorized" };
  try {
    await writeDraft(content);
    return { ok: true };
  } catch {
    return { ok: false, error: "save_failed" };
  }
}

/** Lưu nháp phần Tin tức (không đụng các phần khác). */
export async function saveNewsDraftAction(
  news: NewsPost[]
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "unauthorized" };
  try {
    const draft = await getDraftContent();
    await writeDraft({ ...draft, news });
    return { ok: true };
  } catch {
    return { ok: false, error: "save_failed" };
  }
}

/** Lưu nháp phần Thông tin & SEO. */
export async function saveSiteDraftAction(
  siteMeta: SiteMeta
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) return { ok: false, error: "unauthorized" };
  try {
    const draft = await getDraftContent();
    await writeDraft({ ...draft, site: siteMeta });
    return { ok: true };
  } catch {
    return { ok: false, error: "save_failed" };
  }
}

/** Xuất bản bản nháp ra public + làm mới các trang liên quan. */
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

/** Đọc nội dung hiện tại cho admin (mặc định lấy bản nháp). */
export async function loadContentAction(preview = true): Promise<SiteContent | null> {
  if (!(await isAdmin())) return null;
  return getContent(preview);
}
