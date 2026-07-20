"use client";

// Tải ảnh tình nguyện viên từ trình duyệt của KHÁCH thẳng lên Vercel Blob.
// Đi qua đường công khai /api/dang-ky/upload (có giới hạn định dạng, dung
// lượng và số lượt theo IP) — KHÔNG dùng đường của khu quản trị.
import { upload } from "@vercel/blob/client";

/** Ảnh chân dung không cần to; trùng với giới hạn phía máy chủ. */
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

/** Tên tệp an toàn, giữ phần mở rộng. */
function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "-");
}

/**
 * Tải 1 ảnh khách chọn lên và trả về đường dẫn công khai.
 * Ném Error kèm thông báo tiếng Việt để form hiện thẳng cho khách đọc.
 */
export async function uploadRegistrationPhoto(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Tệp bạn chọn không phải ảnh. Hãy chọn ảnh jpg, png hoặc webp.");
  }
  if (file.size > MAX_PHOTO_BYTES) {
    throw new Error("Ảnh nặng quá 5MB. Bạn chọn ảnh nhẹ hơn giúp nhé.");
  }
  try {
    const blob = await upload(`tnv/${safeName(file.name)}`, file, {
      access: "public",
      handleUploadUrl: "/api/dang-ky/upload",
    });
    return blob.url;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "";
    if (msg.includes("BLOB_READ_WRITE_TOKEN") || msg.includes("Chưa bật lưu trữ ảnh")) {
      throw new Error("Hiện chưa gửi kèm ảnh được. Bạn cứ điền các ô còn lại nhé.");
    }
    throw new Error(msg || "Tải ảnh lên không được. Bạn thử lại giúp nhé.");
  }
}
