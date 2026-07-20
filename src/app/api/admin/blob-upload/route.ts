// Cấp token để trình duyệt tải ảnh THẲNG lên Vercel Blob (FR7).
// Đi đường client upload thay vì server action vì server action giới hạn body 1MB
// và serverless Vercel chặn cứng ở 4.5MB — ảnh thật thường vượt cả hai.
import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

/** Định dạng ảnh cho phép (FR7-R1). */
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif", "image/svg+xml"];

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Chưa bật lưu trữ ảnh (thiếu BLOB_READ_WRITE_TOKEN). Vui lòng dán liên kết ảnh thay thế." },
      { status: 501 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      // Chỉ admin đã đăng nhập mới được cấp token tải lên.
      onBeforeGenerateToken: async () => {
        if (!(await isAdmin())) throw new Error("unauthorized");
        return {
          allowedContentTypes: ALLOWED,
          addRandomSuffix: true,
          maximumSizeInBytes: 20 * 1024 * 1024, // 20MB
        };
      },
      // Vercel gọi lại khi tải xong (không chạy ở localhost) — không cần xử lý gì.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Tải ảnh thất bại.";
    return NextResponse.json(
      { error: msg === "unauthorized" ? "Bạn cần đăng nhập lại." : msg },
      { status: msg === "unauthorized" ? 401 : 400 }
    );
  }
}
