// Đọc danh sách đăng ký khách gửi từ form ở trang chủ.
// CHỈ dùng trong khu quản trị (đã có guard đăng nhập) — không bao giờ trả dữ
// liệu này ra trang công khai.
import { redis } from "@/lib/redis";
import {
  REGISTRATIONS_KEY,
  REGISTRATIONS_LIMIT,
  type Registration,
} from "./schema";

/** Kiểm tra thô một bản ghi đọc từ Redis có đúng hình dạng không. */
function laDangKy(v: unknown): v is Registration {
  if (typeof v !== "object" || v === null) return false;
  const r = v as Record<string, unknown>;
  return typeof r.at === "string" && typeof r.values === "object";
}

/**
 * Các lượt đăng ký, mới nhất trước.
 * Lỗi Redis -> trả mảng rỗng để trang admin không vỡ.
 */
export async function listRegistrations(): Promise<Registration[]> {
  let raw: unknown[];
  try {
    raw = await redis.lrange(REGISTRATIONS_KEY, 0, REGISTRATIONS_LIMIT - 1);
  } catch (err) {
    console.error("[dang-ky] Không đọc được danh sách đăng ký:", err);
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
    .filter(laDangKy)
    .map((r) => ({
      at: r.at,
      values: (r.values ?? {}) as Record<string, string>,
      labels: (r.labels ?? {}) as Record<string, string>,
    }));
}
