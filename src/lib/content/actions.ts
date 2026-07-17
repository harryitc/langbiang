"use server";

// Server actions cho Admin CMS. Mọi action kiểm isAdmin() trước.
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/admin-auth";
import { publishDraft, writeDraft } from "./store";

export type ActionResult<T = undefined> = {
  ok: boolean;
  error?: string;
  data?: T;
};

/** Các nhánh nội dung được phép ghi (chống ghi bừa). */
const ALLOWED_ROOTS = ["currentYear", "main", "pastYears", "news"];

function isAllowedPath(path: string): boolean {
  if (typeof path !== "string" || path.length === 0) return false;
  const root = path.split(".")[0];
  return ALLOWED_ROOTS.includes(root);
}

/** Lưu 1 nhánh nội dung vào bản nháp (autosave). */
export async function saveDraftAction(
  path: string,
  value: unknown
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "unauthorized" };
  if (!isAllowedPath(path)) return { ok: false, error: "Đường dẫn không hợp lệ." };
  try {
    await writeDraft(path, value);
    return { ok: true };
  } catch {
    return { ok: false, error: "Lưu nháp thất bại. Vui lòng thử lại." };
  }
}

/** Xuất bản toàn bộ nội dung nháp ra công khai. */
export async function publishDraftAction(): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "unauthorized" };
  try {
    await publishDraft();
    return { ok: true };
  } catch {
    return { ok: false, error: "Xuất bản thất bại. Vui lòng thử lại." };
  }
}

/** Đổi số năm hiện tại (FR3) — validate 4 chữ số. */
export async function setCurrentYearAction(
  year: number
): Promise<ActionResult> {
  if (!(await isAdmin())) return { ok: false, error: "unauthorized" };
  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    return { ok: false, error: "Số năm không hợp lệ (cần 4 chữ số)." };
  }
  try {
    await writeDraft("currentYear", year);
    return { ok: true };
  } catch {
    return { ok: false, error: "Lưu nháp thất bại. Vui lòng thử lại." };
  }
}

/** Tải ảnh lên Vercel Blob, trả URL công khai (FR7). */
export async function uploadImageAction(
  formData: FormData
): Promise<ActionResult<string>> {
  if (!(await isAdmin())) return { ok: false, error: "unauthorized" };
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: false,
      error:
        "Chưa bật lưu trữ ảnh (thiếu BLOB_READ_WRITE_TOKEN). Vui lòng dán liên kết ảnh thay thế.",
    };
  }
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Không có tệp ảnh hợp lệ." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Tệp không phải ảnh hợp lệ." };
  }
  const folderRaw = formData.get("folder");
  const folder =
    typeof folderRaw === "string" && folderRaw ? folderRaw.replace(/^\/+|\/+$/g, "") : "uploads";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const pathname = `${folder}/${Date.now()}-${safeName}`;
  try {
    const blob = await put(pathname, file, {
      access: "public",
      addRandomSuffix: true,
    });
    return { ok: true, data: blob.url };
  } catch {
    return { ok: false, error: "Tải ảnh thất bại. Vui lòng thử lại." };
  }
}
