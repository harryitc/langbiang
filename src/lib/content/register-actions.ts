"use server";

// Nhận đăng ký từ form "Đăng ký đồng hành" ở trang chủ.
//
// Đây là action CÔNG KHAI (khách chưa đăng nhập vẫn gọi được). Luồng xử lý:
//   1. Kiểm tra khách đã điền đủ các ô bắt buộc chưa — thiếu thì báo lỗi, không lưu.
//   2. LƯU VÀO REDIS trước tiên. Đây là lưới an toàn: kể cả email không gửi
//      được thì Ban tổ chức vẫn xem lại được ở mục "Đăng ký nhận được".
//   3. Gửi email báo tin (nếu đã cấu hình RESEND_API_KEY). Chưa cấu hình hoặc
//      gửi lỗi thì vẫn coi là đăng ký THÀNH CÔNG — dữ liệu đã nằm trong Redis.
import { Resend } from "resend";
import { redis } from "@/lib/redis";
import { getContent } from "./store";
import {
  REGISTRATIONS_KEY,
  REGISTRATIONS_LIMIT,
  type Registration,
  type RegisterField,
} from "./schema";

export type SubmitResult = { ok: boolean; error?: string };

/** Địa chỉ người gửi mặc định của Resend (dùng được ngay, không cần domain). */
const DEFAULT_FROM = "Trăng Sáng Langbiang <onboarding@resend.dev>";

/** Cắt bớt chuỗi quá dài để không ai nhồi dữ liệu rác vào store. */
function clean(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Nhãn hiển thị của một ô nhập (thiếu nhãn thì lấy tạm mã trường). */
function labelOf(field: RegisterField): string {
  return field.label.trim() || field.name;
}

/**
 * Ghi nhận một lượt đăng ký.
 * @param data Dữ liệu khách điền: mã trường -> nội dung. Riêng khoá `_website`
 *   là ô ẩn chống spam (bot hay điền bừa) — có giá trị thì bỏ qua lặng lẽ.
 */
export async function submitRegistrationAction(
  data: Record<string, string>
): Promise<SubmitResult> {
  // --- Chống spam: ô ẩn mà có chữ thì gần như chắc chắn là bot ---------------
  if (clean(data?._website)) return { ok: true };

  const { main } = await getContent();
  const fields = main.register.fields ?? [];

  // --- 1. Kiểm tra các ô bắt buộc ------------------------------------------
  const values: Record<string, string> = {};
  const labels: Record<string, string> = {};
  const thieu: string[] = [];

  for (const field of fields) {
    if (!field.name) continue;
    const value = clean(data?.[field.name]);
    labels[field.name] = labelOf(field);
    values[field.name] = value;
    if (field.required && !value) thieu.push(labelOf(field));
  }

  if (thieu.length > 0) {
    return {
      ok: false,
      error: `Bạn còn thiếu: ${thieu.join(", ")}. Vui lòng điền đủ rồi gửi lại nhé.`,
    };
  }

  const record: Registration = {
    at: new Date().toISOString(),
    values,
    labels,
  };

  // --- 2. Lưu Redis trước (bắt buộc) ---------------------------------------
  try {
    await redis.lpush(REGISTRATIONS_KEY, JSON.stringify(record));
    await redis.ltrim(REGISTRATIONS_KEY, 0, REGISTRATIONS_LIMIT - 1);
  } catch (err) {
    console.error("[dang-ky] Không lưu được đăng ký vào Redis:", err);
    return {
      ok: false,
      error: "Hệ thống đang bận, chưa nhận được đăng ký. Bạn thử lại giúp nhé.",
    };
  }

  // --- 3. Gửi email báo tin (không bắt buộc) -------------------------------
  await guiEmailBaoTin(record, main.register.recipientEmail, main.site.email);

  return { ok: true };
}

/**
 * Gửi email báo có người đăng ký. Mọi trục trặc ở đây đều chỉ ghi log —
 * đăng ký đã lưu rồi nên không được làm hỏng kết quả trả về cho khách.
 */
async function guiEmailBaoTin(
  record: Registration,
  recipientEmail: string | undefined,
  siteEmail: string | undefined
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = clean(recipientEmail, 200) || clean(siteEmail, 200);

  if (!apiKey) {
    console.warn(
      "[dang-ky] Chưa cấu hình RESEND_API_KEY nên bỏ qua bước gửi email. " +
        "Đăng ký vẫn được lưu, xem ở /admin/dang-ky-nhan-duoc."
    );
    return;
  }
  if (!to) {
    console.warn(
      "[dang-ky] Chưa có email nhận (main.register.recipientEmail và " +
        "main.site.email đều trống) nên bỏ qua bước gửi email."
    );
    return;
  }

  const thoiDiem = new Date(record.at).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });
  const dong = Object.entries(record.labels).map(([name, label]) => ({
    label,
    value: record.values[name] || "(để trống)",
  }));
  const ten = dong.find((d) => d.value !== "(để trống)")?.value ?? "";

  const text = [
    `Có người vừa đăng ký đồng hành trên website.`,
    `Thời điểm: ${thoiDiem}`,
    "",
    ...dong.map((d) => `${d.label}: ${d.value}`),
  ].join("\n");

  const html = `
    <div style="font-family:system-ui,Arial,sans-serif;color:#1f2a24">
      <h2 style="margin:0 0 4px">Có người vừa đăng ký đồng hành 🌙</h2>
      <p style="margin:0 0 16px;color:#5b6b63">Thời điểm: ${escapeHtml(thoiDiem)}</p>
      <table cellpadding="8" style="border-collapse:collapse">
        ${dong
          .map(
            (d) => `<tr>
              <td style="border:1px solid #dfe7e2;font-weight:600;white-space:nowrap">${escapeHtml(d.label)}</td>
              <td style="border:1px solid #dfe7e2">${escapeHtml(d.value)}</td>
            </tr>`
          )
          .join("")}
      </table>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || DEFAULT_FROM,
      to: [to],
      subject: `[Đăng ký mới] ${ten || "Có người vừa đăng ký đồng hành"}`,
      text,
      html,
    });
    if (error) console.error("[dang-ky] Resend trả về lỗi:", error);
  } catch (err) {
    console.error("[dang-ky] Không gửi được email báo tin:", err);
  }
}

/** Chèn chữ của khách vào HTML email an toàn. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
