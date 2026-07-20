// Cấp token để KHÁCH (chưa đăng nhập) tải ảnh tình nguyện viên thẳng lên
// Vercel Blob khi điền form đăng ký.
//
// Đường này CÔNG KHAI nên siết chặt hơn hẳn route admin
// (src/app/api/admin/blob-upload/route.ts — route đó giữ nguyên, không đụng tới):
//   - chỉ nhận ảnh (không nhận tệp khác);
//   - tối đa 5MB mỗi ảnh (route admin cho 20MB);
//   - luôn ghi vào thư mục tnv/;
//   - mỗi địa chỉ IP chỉ được ~5 lượt mỗi giờ (đếm bằng Redis).
import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

/** Định dạng ảnh cho phép — cố ý KHÔNG có SVG (SVG chạy được mã). */
const ALLOWED = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

/** Ảnh chân dung không cần to; 5MB là quá dư. */
const MAX_BYTES = 5 * 1024 * 1024;
/** Thư mục cố định trên Blob cho ảnh khách gửi kèm đăng ký. */
const UPLOAD_FOLDER = "tnv";
/** Số lượt tải lên tối đa cho mỗi IP trong một giờ. */
const RATE_LIMIT = 5;
const RATE_WINDOW_SECONDS = 60 * 60;

/** Địa chỉ IP của khách (sau proxy của Vercel). */
function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for") ?? "";
  return forwarded.split(",")[0].trim() || "unknown";
}

/**
 * Đếm lượt tải lên của một IP trong một giờ.
 * Redis trục trặc -> cho qua (thà nhận đăng ký còn hơn chặn nhầm khách thật).
 */
async function vuotHanMuc(ip: string): Promise<boolean> {
  const key = `upload-rate:${ip}`;
  try {
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, RATE_WINDOW_SECONDS);
    return count > RATE_LIMIT;
  } catch (err) {
    console.error("[dang-ky/upload] Không đếm được lượt tải lên:", err);
    return false;
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "Chưa bật lưu trữ ảnh (thiếu BLOB_READ_WRITE_TOKEN). Bạn cứ gửi đăng ký, phần ảnh có thể bổ sung sau.",
      },
      { status: 501 }
    );
  }

  const body = (await request.json()) as HandleUploadBody;

  // Chỉ tính lượt khi khách XIN TOKEN để tải ảnh mới.
  // Vercel còn gọi lại chính đường này một lần nữa lúc tải xong
  // (type = "blob.upload-completed"); tính cả lượt đó thì mỗi ảnh bị trừ hai
  // lượt, hạn mức 5 ảnh/giờ thành ra chỉ còn 2.
  if (
    body?.type === "blob.generate-client-token" &&
    (await vuotHanMuc(clientIp(request)))
  ) {
    return NextResponse.json(
      {
        error:
          "Bạn đã gửi khá nhiều ảnh trong một giờ qua. Vui lòng thử lại sau ít phút nhé.",
      },
      { status: 429 }
    );
  }

  try {
    const result = await handleUpload({
      body,
      request,
      // KHÔNG đòi đăng nhập (khách vãng lai đang điền form) — bù lại bằng
      // giới hạn định dạng / dung lượng / thư mục / số lượt ở trên.
      onBeforeGenerateToken: async (pathname) => {
        // Ép mọi ảnh nằm trong đúng thư mục tnv/ — không cho ghi đè chỗ khác.
        if (!pathname.startsWith(`${UPLOAD_FOLDER}/`)) {
          throw new Error("Ảnh phải nằm trong thư mục dành cho đăng ký.");
        }
        return {
          allowedContentTypes: ALLOWED,
          addRandomSuffix: true,
          maximumSizeInBytes: MAX_BYTES,
        };
      },
      // Vercel gọi lại khi tải xong (không chạy ở localhost) — không cần xử lý gì.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Tải ảnh thất bại.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
