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
      handleUploadUrl: UPLOAD_URL,
    });
    return blob.url;
  } catch (error) {
    throw new Error(await loiDeHieu(error));
  }
}

const UPLOAD_URL = "/api/dang-ky/upload";

/**
 * Đổi lỗi của thư viện thành câu khách đọc hiểu.
 *
 * Khi máy chủ từ chối, @vercel/blob chỉ ném "Failed to retrieve the client
 * token" — nuốt mất lý do thật (chưa bật lưu trữ ảnh, quá hạn mức...). Nên
 * hỏi lại máy chủ đúng một lần để lấy câu giải thích tiếng Việt.
 */
async function loiDeHieu(error: unknown): Promise<string> {
  const goc = error instanceof Error ? error.message : "";
  const MAC_DINH = "Tải ảnh lên không được. Bạn thử lại giúp nhé.";

  // Lỗi đã rõ ràng rồi (vd quá dung lượng) thì dùng luôn.
  if (goc && !goc.includes("client token")) return goc;

  try {
    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Cố ý gửi thân rỗng: chỉ cần chạm tới các bước kiểm TRƯỚC khi cấp token
      // (thiếu cấu hình / quá hạn mức) để đọc câu báo lỗi.
      body: "{}",
    });
    const data = (await res.json()) as { error?: string };
    if (res.status === 501) {
      return "Hiện chưa gửi kèm ảnh được. Bạn cứ điền các ô còn lại rồi gửi nhé.";
    }
    if (data?.error) return data.error;
  } catch {
    // không hỏi được thì thôi, dùng câu mặc định
  }
  return MAC_DINH;
}
