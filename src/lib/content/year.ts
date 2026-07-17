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
