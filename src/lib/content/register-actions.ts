"use server";

// Nhận đăng ký từ các form "Đăng ký đồng hành" (trang chủ và các trang chia sẻ
// riêng /dang-ky/<id>).
//
// Đây là action CÔNG KHAI (khách chưa đăng nhập vẫn gọi được). Luồng xử lý:
//   1. Tìm đúng form theo formId, kiểm tra khách đã điền đủ các ô bắt buộc
//      chưa — thiếu thì báo lỗi, không lưu.
//   2. LƯU VÀO REDIS trước tiên, vào danh sách riêng của form đó. Đây là lưới
//      an toàn: kể cả email không gửi được thì Ban tổ chức vẫn xem lại được ở
//      mục "Đăng ký nhận được".
//   3. Ảnh khách gửi kèm (ô nhập kiểu "Ảnh") được đưa vào kho ảnh, album
//      "Tình nguyện viên", đặt tên theo tên người đăng ký.
//   4. Gửi email báo tin (nếu đã cấu hình RESEND_API_KEY). Chưa cấu hình hoặc
//      gửi lỗi thì vẫn coi là đăng ký THÀNH CÔNG — dữ liệu đã nằm trong Redis.
import { Resend } from "resend";
import { redis } from "@/lib/redis";
import { getContent } from "./store";
import { addMediaItem } from "./media";
import { VOLUNTEER_ALBUM_ID } from "./media-defaults";
import {
  registrationsKey,
  REGISTRATIONS_LIMIT,
  type Registration,
  type RegisterField,
  type RegisterForm,
  type SiteContent,
} from "./schema";
import {
  buildInfoTable,
  renderEmailTemplate,
  type EmailVarValues,
} from "./email-templates";
import { eventDateLabel } from "./year";

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
 * @param formId Id (slug) của form khách vừa gửi — quyết định đơn được lưu vào
 *   danh sách nào và email báo tin gửi về đâu.
 * @param data Dữ liệu khách điền: mã trường -> nội dung. Riêng khoá `_website`
 *   là ô ẩn chống spam (bot hay điền bừa) — có giá trị thì bỏ qua lặng lẽ.
 */
export async function submitRegistrationAction(
  formId: string,
  data: Record<string, string>
): Promise<SubmitResult> {
  // --- Chống spam: ô ẩn mà có chữ thì gần như chắc chắn là bot ---------------
  if (clean(data?._website)) return { ok: true };

  const content = await getContent();
  const { main } = content;
  const form = main.registerForms.find((f) => f.id === formId);
  if (!form) {
    return {
      ok: false,
      error: "Form đăng ký này không còn nữa. Bạn thử tải lại trang giúp nhé.",
    };
  }
  const fields = form.fields ?? [];

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
  const key = registrationsKey(form.id);
  try {
    await redis.lpush(key, JSON.stringify(record));
    await redis.ltrim(key, 0, REGISTRATIONS_LIMIT - 1);
  } catch (err) {
    console.error("[dang-ky] Không lưu được đăng ký vào Redis:", err);
    return {
      ok: false,
      error: "Hệ thống đang bận, chưa nhận được đăng ký. Bạn thử lại giúp nhé.",
    };
  }

  // --- 3. Đưa ảnh khách gửi vào kho ảnh (không bắt buộc) -------------------
  await luuAnhVaoKho(form, record);

  // --- 4. Gửi email báo tin (không bắt buộc) -------------------------------
  await guiEmail(record, form, content);

  return { ok: true };
}

/**
 * Tên người đăng ký — lấy từ ô chữ ngắn đầu tiên có nhãn chứa "tên", không có
 * thì lấy ô đầu tiên của form. Dùng để đặt tên cho ảnh trong kho.
 */
function tenNguoiDangKy(form: RegisterForm, record: Registration): string {
  const oTen =
    form.fields.find(
      (f) => f.type === "text" && f.label.toLowerCase().includes("tên")
    ) ?? form.fields[0];
  return oTen ? clean(record.values[oTen.name], 120) : "";
}

/**
 * Thêm ảnh khách gửi kèm vào kho ảnh, album "Tình nguyện viên".
 * Mọi trục trặc chỉ ghi log — đăng ký đã lưu rồi, không được làm hỏng kết quả.
 */
async function luuAnhVaoKho(
  form: RegisterForm,
  record: Registration
): Promise<void> {
  const anh = form.fields
    .filter((f) => f.type === "photo" && record.values[f.name])
    .map((f) => record.values[f.name]);
  if (anh.length === 0) return;

  const ten = tenNguoiDangKy(form, record) || "Tình nguyện viên";
  for (const url of anh) {
    try {
      await addMediaItem({ url, name: ten, albumId: VOLUNTEER_ALBUM_ID });
    } catch (err) {
      console.error("[dang-ky] Không thêm được ảnh vào kho ảnh:", err);
    }
  }
}

/**
 * Gửi email sau khi có người đăng ký — hai chiều, cả hai đều KHÔNG bắt buộc:
 *   - báo tin về hộp thư Ban tổ chức (mẫu `notifyTemplateId`);
 *   - cảm ơn người vừa đăng ký (mẫu `confirmTemplateId`).
 *
 * Nội dung email lấy từ mẫu admin soạn trong CMS, không nằm cứng ở đây nữa.
 * Mọi trục trặc chỉ ghi log — đăng ký đã lưu vào Redis rồi nên không được làm
 * hỏng kết quả trả về cho khách.
 */
async function guiEmail(
  record: Registration,
  form: RegisterForm,
  content: SiteContent
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[dang-ky] Chưa cấu hình RESEND_API_KEY nên bỏ qua bước gửi email. " +
        "Đăng ký vẫn được lưu, xem ở /admin/dang-ky-nhan-duoc."
    );
    return;
  }

  const { main } = content;
  const tenForm = form.name.trim() || form.id;
  const dong = Object.entries(record.labels).map(([name, label]) => ({
    label,
    value: record.values[name] || "(để trống)",
  }));

  const vars: EmailVarValues = {
    ho_ten: tenNguoiDangKy(form, record),
    email: emailNguoiDangKy(form, record),
    ten_form: tenForm,
    nam: String(content.currentYear),
    thoi_diem: new Date(record.at).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    }),
    ten_su_kien: main.site.name,
    ngay_su_kien: eventDateLabel(main.event.dateLabel, content.currentYear),
    dia_diem: main.event.location,
    fanpage: main.site.facebook,
    website: process.env.NEXT_PUBLIC_SITE_URL || "",
    bang_thong_tin: buildInfoTable(dong),
  };

  const timMau = (id: string | undefined) =>
    id ? content.emailTemplates.find((t) => t.id === id) : undefined;

  // Chiều 1 — báo Ban tổ chức.
  const mauBao = timMau(form.notifyTemplateId);
  const hopThuBTC = clean(form.recipientEmail, 200) || clean(main.site.email, 200);
  if (mauBao && hopThuBTC) {
    await send(apiKey, hopThuBTC, renderEmailTemplate(mauBao, vars));
  } else if (mauBao && !hopThuBTC) {
    console.warn(
      "[dang-ky] Chưa có email nhận (email của form và site.email đều trống) " +
        "nên bỏ qua email báo Ban tổ chức."
    );
  }

  // Chiều 2 — cảm ơn người đăng ký (chỉ khi form có ô email và khách đã điền).
  const mauCamOn = timMau(form.confirmTemplateId);
  if (mauCamOn && vars.email) {
    await send(apiKey, vars.email, renderEmailTemplate(mauCamOn, vars));
  }
}

/** Gửi 1 email qua Resend; lỗi chỉ ghi log. */
async function send(
  apiKey: string,
  to: string,
  mail: { subject: string; html: string; text: string }
): Promise<void> {
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM || DEFAULT_FROM,
      to: [to],
      subject: mail.subject,
      text: mail.text,
      html: mail.html,
    });
    if (error) console.error("[dang-ky] Resend trả về lỗi:", error);
  } catch (err) {
    console.error("[dang-ky] Không gửi được email:", err);
  }
}

/** Email khách điền — lấy từ ô nhập kiểu "email" đầu tiên của form. */
function emailNguoiDangKy(form: RegisterForm, record: Registration): string {
  const o = form.fields.find((f) => f.type === "email");
  return o ? clean(record.values[o.name], 200) : "";
}
