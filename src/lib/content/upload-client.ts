"use client";

// Tải ảnh từ trình duyệt THẲNG lên Vercel Blob (FR7).
// Không đi qua server action: server action giới hạn body 1MB và serverless
// Vercel chặn cứng 4.5MB, trong khi ảnh thật thường 2–10MB.
import { upload } from "@vercel/blob/client";

/** Tên tệp an toàn, giữ phần mở rộng. */
function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

/**
 * Tải 1 ảnh lên Blob, trả URL công khai.
 * Ném Error kèm thông báo tiếng Việt nếu thất bại.
 */
export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Tệp không phải ảnh hợp lệ.");
  }
  const dir = folder.replace(/^\/+|\/+$/g, "") || "uploads";
  try {
    const blob = await upload(`${dir}/${safeName(file.name)}`, file, {
      access: "public",
      handleUploadUrl: "/api/admin/blob-upload",
    });
    return blob.url;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    // Route trả 501 khi chưa cấu hình BLOB_READ_WRITE_TOKEN.
    if (msg.includes("BLOB_READ_WRITE_TOKEN") || msg.includes("Chưa bật lưu trữ ảnh")) {
      throw new Error("Chưa bật lưu trữ ảnh. Vui lòng dán liên kết ảnh thay thế.");
    }
    throw new Error(msg || "Tải ảnh thất bại. Vui lòng thử lại.");
  }
}
