"use server";

// Server actions cho Admin CMS. Mọi action kiểm isAdmin() trước.
import { isAdmin } from "@/lib/admin-auth";
import { isValidYear } from "./year";
import { publishDraft, writeDraft } from "./store";

export type ActionResult<T = undefined> = {
  ok: boolean;
  error?: string;
  data?: T;
};

/** Các nhánh nội dung được phép ghi (chống ghi bừa). */
const ALLOWED_ROOTS = [
  "currentYear",
  "main",
  "pastYears",
  "news",
  "emailTemplates",
];

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
  // FR3-R2: số năm hiện tại phải là số nguyên 4 chữ số (kiểm cả ở server).
  if (path === "currentYear" && !isValidYear(value)) {
    return { ok: false, error: "Số năm không hợp lệ (cần 4 chữ số)." };
  }
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


