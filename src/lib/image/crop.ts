"use client";

// Phần phụ trợ cho việc cắt ảnh. Toàn bộ phần nặng — đọc hướng xoay EXIF,
// xoay/lật, cắt, thu nhỏ — do thư viện react-advanced-cropper lo; ở đây chỉ
// còn hai việc nó không làm: đổi canvas thành File để tải lên, và lấy ảnh
// đang có trên mạng về để cắt lại.
//
// Ảnh vốn đi thẳng từ trình duyệt lên Vercel Blob (xem upload-client.ts) nên
// cắt xong là tải lên được ngay, máy chủ không cần biết gì thêm.

/** Cạnh dài tối đa sau khi cắt — ảnh 48MP từ điện thoại vượt giới hạn canvas
 *  của Safari, mà web cũng không cần to đến vậy. */
export const MAX_EDGE = 2400;
const WEBP_QUALITY = 0.9;

/**
 * Định dạng không cắt được bằng canvas:
 *  - SVG: là ảnh vector, vẽ ra canvas thành ảnh raster mất hết ưu điểm.
 *  - GIF: canvas chỉ lấy được khung hình đầu, mất ảnh động.
 */
export function canCrop(type: string): boolean {
  return type.startsWith("image/") && type !== "image/svg+xml" && type !== "image/gif";
}

/** Đổi đuôi tệp cho khớp định dạng mới. */
function doiDuoi(name: string, mime: string): string {
  const duoi = mime === "image/png" ? "png" : "webp";
  const goc = name.replace(/\.[^./\\]+$/, "") || "anh";
  return `${goc}.${duoi}`;
}

/**
 * Đổi canvas mà thư viện trả về thành File sẵn sàng tải lên.
 *
 * PNG giữ nguyên PNG để không mất nền trong suốt (logo nhà tài trợ); còn lại
 * xuất WebP cho nhẹ.
 */
export async function canvasThanhFile(
  canvas: HTMLCanvasElement,
  goc: File
): Promise<File> {
  const mime = goc.type === "image/png" ? "image/png" : "image/webp";
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mime, mime === "image/webp" ? WEBP_QUALITY : undefined)
  );
  if (!blob) throw new Error("Không lưu được ảnh sau khi cắt.");
  return new File([blob], doiDuoi(goc.name, mime), { type: mime });
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
