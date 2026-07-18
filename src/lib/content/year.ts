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

/** Số năm hợp lệ = số nguyên 4 chữ số (FR3-R2 / FR4-R1). */
export function isValidYear(year: unknown): year is number {
  return typeof year === "number" && Number.isInteger(year) && year >= 1000 && year <= 9999;
}
