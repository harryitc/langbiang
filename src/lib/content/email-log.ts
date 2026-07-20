// Nhật ký "đã gửi email gì cho ai" — để Ban tổ chức nhìn lại được lịch sử và
// không gửi trùng một lá thư hai lần mà không hay biết.
//
// CHỈ dùng trong khu quản trị (đã có guard đăng nhập). Nhật ký chỉ ghi con số
// tổng kết, KHÔNG lưu danh sách địa chỉ email của từng lượt gửi.
import { redis } from "@/lib/redis";
import type { KieuNguoiNhan, NhatKyGuiEmail } from "./email-send-types";

/** Khoá Redis chứa nhật ký gửi email. */
const EMAIL_LOG_KEY = "email:log";

/** Chỉ giữ lại chừng này lượt gửi gần nhất. */
export const EMAIL_LOG_LIMIT = 200;

/** Kiểm tra thô một bản ghi đọc từ Redis có đúng hình dạng không. */
function laNhatKy(v: unknown): v is NhatKyGuiEmail {
  if (typeof v !== "object" || v === null) return false;
  const r = v as Record<string, unknown>;
  return typeof r.at === "string" && typeof r.soNguoiNhan === "number";
}

/**
 * Ghi thêm một lượt gửi vào nhật ký.
 * Lỗi Redis chỉ ghi log — thư đã gửi đi rồi, không được vì ghi nhật ký hỏng mà
 * báo cho admin là gửi thất bại.
 */
export async function addEmailLog(entry: NhatKyGuiEmail): Promise<void> {
  try {
    await redis.lpush(EMAIL_LOG_KEY, JSON.stringify(entry));
    await redis.ltrim(EMAIL_LOG_KEY, 0, EMAIL_LOG_LIMIT - 1);
  } catch (err) {
    console.error("[gui-email] Không ghi được nhật ký gửi email:", err);
  }
}

/**
 * Các lượt gửi gần nhất, mới nhất trước.
 * Lỗi Redis -> trả mảng rỗng để trang admin không vỡ.
 */
export async function listEmailLogs(): Promise<NhatKyGuiEmail[]> {
  let raw: unknown[];
  try {
    raw = await redis.lrange(EMAIL_LOG_KEY, 0, EMAIL_LOG_LIMIT - 1);
  } catch (err) {
    console.error("[gui-email] Không đọc được nhật ký gửi email:", err);
    return [];
  }

  return raw
    .map((item) => {
      // Upstash tự parse JSON; phòng trường hợp trả về chuỗi thì parse tay.
      if (typeof item === "string") {
        try {
          return JSON.parse(item) as unknown;
        } catch {
          return null;
        }
      }
      return item;
    })
    .filter(laNhatKy)
    .map((r) => ({
      at: r.at,
      tenMau: r.tenMau || "(không rõ)",
      kieu: (r.kieu || "chon") as KieuNguoiNhan,
      tenForm: r.tenForm || "",
      soNguoiNhan: r.soNguoiNhan,
      soThanhCong: r.soThanhCong ?? 0,
      soLoi: r.soLoi ?? 0,
    }));
}
