// Đồng bộ số năm (FR3 + Phụ lục A của FRD).
// Admin có thể chèn ký hiệu {năm} / {nam} / {year} vào các chuỗi copy;
// khi render, fillYear() thay ký hiệu đó bằng "số năm hiện tại".

/** Ký hiệu chèn năm được chấp nhận trong nội dung admin nhập. */
const YEAR_TOKEN = /\{\s*(năm|nam|year)\s*\}/gi;

/** Thay mọi ký hiệu {năm}/{year} trong text bằng số năm truyền vào. */
export function fillYear(text: string, year: number): string {
  if (!text) return text;
  return text.replace(YEAR_TOKEN, String(year));
}

/**
 * Nhãn ngày sự kiện + năm hiện tại.
 * Người biên tập chỉ nhập phần ngày/tháng ("Ngày 26 – 27 tháng 9"); năm do hệ
 * thống tự nối để không thể bị xoá nhầm. Nếu nhãn đã tự chứa số năm đó rồi
 * (hoặc còn ký hiệu {năm} kiểu cũ) thì giữ nguyên, tránh lặp "năm 2026 năm 2026".
 */
export function eventDateLabel(label: string, year: number): string {
  const filled = fillYear(label ?? "", year).trim();
  if (!filled) return "";
  return filled.includes(String(year)) ? filled : `${filled} năm ${year}`;
}

/** Số năm hợp lệ = số nguyên 4 chữ số (FR3-R2 / FR4-R1). */
export function isValidYear(year: unknown): year is number {
  return typeof year === "number" && Number.isInteger(year) && year >= 1000 && year <= 9999;
}
