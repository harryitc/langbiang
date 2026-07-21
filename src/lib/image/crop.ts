"use client";

// Phần phụ trợ cho việc cắt ảnh. Toàn bộ phần nặng — đọc hướng xoay EXIF,
// xoay/lật, cắt, thu nhỏ — do thư viện react-advanced-cropper lo; ở đây chỉ
// còn hai việc nó không làm: đổi canvas thành File để tải lên, và lấy ảnh
// đang có trên mạng về để cắt lại.
//
// Ảnh vốn đi thẳng từ trình duyệt lên Vercel Blob (xem upload-client.ts) nên
// cắt xong là tải lên được ngay, máy chủ không cần biết gì thêm.

/**
 * KHÔNG thu nhỏ ảnh: giữ nguyên độ phân giải vùng đã cắt.
 *
 * Chỉ chặn một ngưỡng an toàn vì Safari không dựng nổi canvas quá ~16.7 triệu
 * điểm ảnh (ảnh 48MP của điện thoại đời mới vượt ngưỡng này) — quá thì canvas
 * trả về rỗng, ảnh hỏng hẳn. Ngưỡng này chỉ chạm tới với ảnh cực lớn.
 */
export const MAX_AREA = 16_000_000;

/**
 * Chất lượng WebP.
 *  - Ảnh chụp: 0.95 — mắt thường không phân biệt được với ảnh gốc.
 *  - Ảnh gốc PNG (thường là logo, đồ hoạ có nét sắc và nền trong suốt): 1.0,
 *    mức này trình duyệt nhân Chromium mã hoá không mất dữ liệu, chữ và
 *    đường nét không bị nhoè viền.
 */
const CHAT_LUONG_ANH_CHUP = 0.95;
const CHAT_LUONG_DO_HOA = 1;

/**
 * Định dạng không cắt được bằng canvas:
 *  - SVG: là ảnh vector, vẽ ra canvas thành ảnh raster mất hết ưu điểm.
 *  - GIF: canvas chỉ lấy được khung hình đầu, mất ảnh động.
 */
export function canCrop(type: string): boolean {
  return type.startsWith("image/") && type !== "image/svg+xml" && type !== "image/gif";
}

/** Đổi đuôi tệp thành .webp, giữ phần tên. */
function doiDuoi(name: string): string {
  const goc = name.replace(/\.[^./\\]+$/, "") || "anh";
  return `${goc}.webp`;
}

/**
 * Đổi canvas mà thư viện trả về thành File sẵn sàng tải lên.
 *
 * Mọi ảnh đều xuất WebP — nhẹ hơn JPEG/PNG ở cùng chất lượng và vẫn giữ được
 * nền trong suốt, nên logo nhà tài trợ không bị nền trắng.
 */
export async function canvasThanhFile(
  canvas: HTMLCanvasElement,
  goc: File
): Promise<File> {
  const chatLuong =
    goc.type === "image/png" ? CHAT_LUONG_DO_HOA : CHAT_LUONG_ANH_CHUP;
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", chatLuong)
  );
  if (!blob) throw new Error("Không lưu được ảnh sau khi cắt.");
  return new File([blob], doiDuoi(goc.name), { type: "image/webp" });
}

/**
 * Tải ảnh đã có trên mạng về thành File để cắt lại.
 *
 * Ảnh /public và ảnh Vercel Blob đều lấy được; ảnh dán từ trang ngoài có thể
 * bị chặn CORS nên báo câu dễ hiểu thay vì để lỗi thô nổi lên.
 */
export async function taiVeDeCat(url: string, name: string): Promise<File> {
  let blob: Blob;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    blob = await res.blob();
  } catch {
    throw new Error(
      "Không tải được ảnh này về để cắt (ảnh từ trang ngoài thường bị chặn). " +
        "Bạn tải ảnh lên kho rồi cắt giúp nhé."
    );
  }
  if (!canCrop(blob.type)) {
    throw new Error("Ảnh SVG và ảnh động GIF thì không cắt được.");
  }
  return new File([blob], name || "anh", { type: blob.type });
}
