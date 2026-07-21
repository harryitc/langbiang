"use client";

// Cắt / thu phóng ảnh NGAY TRONG TRÌNH DUYỆT, trước khi tải lên.
//
// Vì ảnh vốn đã đi thẳng từ trình duyệt lên Vercel Blob (xem upload-client.ts),
// việc cắt chỉ cần chen vào giữa "khách chọn tệp" và "gọi uploadImage" —
// máy chủ không thấy khác biệt gì. Cắt xong ảnh cũng nhẹ đi đáng kể nên đỡ
// đụng trần 5MB (khách) / 20MB (quản trị).

/** Vùng cắt do react-easy-crop trả về, tính bằng pixel của ảnh gốc. */
export type CropArea = { x: number; y: number; width: number; height: number };

/** Cạnh dài tối đa của ảnh sau khi cắt — ảnh 48MP từ điện thoại vượt giới hạn
 *  canvas của Safari, mà web cũng không cần to đến vậy. */
const MAX_EDGE = 2400;
const WEBP_QUALITY = 0.9;

/**
 * Định dạng không cắt được bằng canvas:
 *  - SVG: là ảnh vector, vẽ ra canvas thành ảnh raster mất hết ưu điểm.
 *  - GIF: canvas chỉ lấy được khung hình đầu, mất ảnh động.
 */
export function canCrop(type: string): boolean {
  return type.startsWith("image/") && type !== "image/svg+xml" && type !== "image/gif";
}

/**
 * Đọc ảnh thành bitmap đã XOAY ĐÚNG theo EXIF.
 *
 * Ảnh chụp bằng điện thoại thường nằm ngang trong tệp kèm cờ EXIF báo phải
 * xoay. Trình duyệt tự xoay khi hiện bằng thẻ <img> (react-easy-crop dùng thẻ
 * này), nên canvas cũng phải xoay y hệt thì toạ độ vùng cắt mới khớp.
 */
async function docAnh(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  try {
    return await createImageBitmap(blob, { imageOrientation: "from-image" });
  } catch {
    // Trình duyệt cũ chưa có imageOrientation: dùng thẻ <img> (tự xoay theo
    // EXIF nhờ CSS image-orientation mặc định là from-image).
    return await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new window.Image();
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Không đọc được ảnh này."));
      };
      img.src = url;
    });
  }
}

/** Đổi đuôi tệp cho khớp định dạng mới. */
function doiDuoi(name: string, mime: string): string {
  const duoi = mime === "image/png" ? "png" : "webp";
  const goc = name.replace(/\.[^./\\]+$/, "") || "anh";
  return `${goc}.${duoi}`;
}

/**
 * Cắt ảnh theo vùng đã chọn, trả về File mới sẵn sàng tải lên.
 *
 * PNG giữ nguyên PNG để không mất nền trong suốt (logo nhà tài trợ); còn lại
 * xuất WebP cho nhẹ.
 */
export async function cutAnh(
  file: File,
  area: CropArea,
  { rotation = 0 }: { rotation?: number } = {}
): Promise<File> {
  const anh = await docAnh(file);
  const goc = { w: anh.width, h: anh.height };

  // Bước 1: xoay cả ảnh vào một khung vừa khít.
  // react-easy-crop trả toạ độ vùng cắt theo ảnh ĐÃ XOAY, nên phải xoay trước
  // rồi mới cắt — cắt trước xoay sau sẽ lệch.
  const rad = (rotation * Math.PI) / 180;
  const khungW = Math.abs(Math.cos(rad)) * goc.w + Math.abs(Math.sin(rad)) * goc.h;
  const khungH = Math.abs(Math.sin(rad)) * goc.w + Math.abs(Math.cos(rad)) * goc.h;

  const daXoay = document.createElement("canvas");
  daXoay.width = Math.round(khungW);
  daXoay.height = Math.round(khungH);
  const ctxXoay = daXoay.getContext("2d");
  if (!ctxXoay) throw new Error("Trình duyệt không hỗ trợ cắt ảnh.");
  ctxXoay.translate(khungW / 2, khungH / 2);
  ctxXoay.rotate(rad);
  ctxXoay.drawImage(anh, -goc.w / 2, -goc.h / 2);
  if ("close" in anh) anh.close();

  // Bước 2: cắt vùng đã chọn, thu nhỏ luôn nếu vượt cạnh tối đa.
  const tyLe = Math.min(1, MAX_EDGE / Math.max(area.width, area.height));
  const w = Math.max(1, Math.round(area.width * tyLe));
  const h = Math.max(1, Math.round(area.height * tyLe));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Trình duyệt không hỗ trợ cắt ảnh.");

  const mime = file.type === "image/png" ? "image/png" : "image/webp";
  if (mime !== "image/png") {
    // WebP cũng có kênh trong suốt; tô nền trắng để phần tràn ra ngoài mép ảnh
    // (khi thu nhỏ quá khung) không thành mảng đen.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
  }
  ctx.drawImage(daXoay, area.x, area.y, area.width, area.height, 0, 0, w, h);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, mime, mime === "image/webp" ? WEBP_QUALITY : undefined)
  );
  if (!blob) throw new Error("Không lưu được ảnh sau khi cắt.");

  return new File([blob], doiDuoi(file.name, mime), { type: mime });
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
