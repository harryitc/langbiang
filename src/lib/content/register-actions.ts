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
//   4. Gửi email (nếu đã cấu hình hộp thư gửi đi). Chưa cấu hình hoặc
//      gửi lỗi thì vẫn coi là đăng ký THÀNH CÔNG — dữ liệu đã nằm trong Redis.
import { daCauHinhGuiThu, guiMotThu } from "./mailer";
import { redis } from "@/lib/redis";
import { getContent } from "./store";
import { addMediaItem } from "./media";
import { VOLUNTEER_ALBUM_ID } from "./media-defaults";
import {
  parseRoles,
  registrationsKey,
  REGISTRATIONS_LIMIT,
  ROLE_SEPARATOR,
  type Registration,
  type RegisterForm,
  type SiteContent,
} from "./schema";
import { renderEmailTemplate } from "./email-templates";
import {
  bienChoNguoiDangKy,
  clean,
  labelOf,
  tenNguoiDangKy,
} from "./email-vars";

export type SubmitResult = { ok: boolean; error?: string };

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

  // Tên các vai trò Đại sứ đang được cấu hình — dùng để lọc ô kiểu "roles".
  const vaiTroHopLe = (form.roles ?? []).map((r) => r.title.trim()).filter(Boolean);

  for (const field of fields) {
    if (!field.name) continue;
    let value = clean(data?.[field.name]);

    if (field.type === "roles") {
      // Trình duyệt gửi gì cũng phải lọc lại: chỉ giữ vai trò có thật trong
      // cấu hình, đúng thứ tự admin đã sắp, không trùng lặp.
      const khachChon = new Set(parseRoles(value));
      value = vaiTroHopLe.filter((t) => khachChon.has(t)).join(ROLE_SEPARATOR);
    }

    labels[field.name] = labelOf(field);
    values[field.name] = value;

    // Ô "roles" mà chưa cấu hình vai trò nào thì khách không có gì để chọn —
    // bắt buộc lúc đó là khoá cứng form, nên bỏ qua.
    const batBuoc =
      field.required && !(field.type === "roles" && vaiTroHopLe.length === 0);
    if (batBuoc && !value) thieu.push(labelOf(field));
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
  if (!daCauHinhGuiThu()) {
    console.warn(
      "[dang-ky] Chưa cấu hình hộp thư gửi đi nên bỏ qua bước gửi email. " +
        "Đăng ký vẫn được lưu, xem ở /admin/dang-ky-nhan-duoc."
    );
    return;
  }

  const { main } = content;
  const vars = bienChoNguoiDangKy(record, form, content);

  const timMau = (id: string | undefined) =>
    id ? content.emailTemplates.find((t) => t.id === id) : undefined;

  // Chiều 1 — báo Ban tổ chức.
  const mauBao = timMau(form.notifyTemplateId);
  const hopThuBTC = clean(form.recipientEmail, 200) || clean(main.site.email, 200);
  if (mauBao && hopThuBTC) {
    await guiThu(hopThuBTC, renderEmailTemplate(mauBao, vars), content.emailFromName);
  } else if (mauBao && !hopThuBTC) {
    console.warn(
      "[dang-ky] Chưa có email nhận (email của form và site.email đều trống) " +
        "nên bỏ qua email báo Ban tổ chức."
    );
  }

  // Chiều 2 — cảm ơn người đăng ký (chỉ khi form có ô email và khách đã điền).
  const mauCamOn = timMau(form.confirmTemplateId);
  if (mauCamOn && vars.email) {
    await guiThu(vars.email, renderEmailTemplate(mauCamOn, vars), content.emailFromName);
  }
}

/** Gửi 1 lá thư; lỗi chỉ ghi log (đăng ký đã lưu rồi, không được hỏng theo). */
async function guiThu(
  to: string,
  mail: { subject: string; html: string; text: string },
  tenNguoiGui: string
): Promise<void> {
  await guiMotThu({ to, ...mail }, tenNguoiGui);
}
