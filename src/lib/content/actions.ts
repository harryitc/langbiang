"use server";

// Server actions cho Admin CMS. Mọi action kiểm isAdmin() trước.
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

