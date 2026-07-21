// Dựng giá trị các biến {{...}} cho một lá thư.
//
// Tách riêng khỏi `register-actions.ts` vì hai chỗ cùng cần:
//   - gửi TỰ ĐỘNG lúc khách vừa đăng ký (register-actions.ts);
//   - gửi CHỦ ĐỘNG do Ban tổ chức bấm nút (email-send-actions.ts).
// Cùng một hàm -> thư gửi tay và thư gửi tự động không bao giờ lệch nội dung.
import { buildInfoTable, type EmailVarValues } from "./email-templates";
import type { Registration, RegisterField, RegisterForm, SiteContent } from "./schema";
import { eventDateLabel } from "./year";


/** Cắt bớt chuỗi quá dài để không ai nhồi dữ liệu rác vào email. */
export function clean(v: unknown, max = 2000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Nhãn hiển thị của một ô nhập (thiếu nhãn thì lấy tạm mã trường). */
export function labelOf(field: RegisterField): string {
  return field.label.trim() || field.name;
}

/**
 * Tên người đăng ký — lấy từ ô chữ ngắn đầu tiên có nhãn chứa "tên", không có
 * thì lấy ô đầu tiên của form.
 */
export function tenNguoiDangKy(
  form: RegisterForm,
  record: Registration
): string {
  const oTen =
    form.fields.find(
      (f) => f.type === "text" && f.label.toLowerCase().includes("tên")
    ) ?? form.fields[0];
  return oTen ? clean(record.values[oTen.name], 120) : "";
}

/**
 * Vai trò Đại sứ khách đã chọn — lấy từ ô nhập kiểu "roles" đầu tiên.
 * Chọn nhiều thì trả về chuỗi đã nối sẵn ("A, B"); form không có ô vai trò
 * hoặc khách bỏ trống thì trả về chuỗi rỗng.
 */
function vaiTroNguoiDangKy(
  form: RegisterForm,
  record: Registration
): string {
  const o = form.fields.find((f) => f.type === "roles");
  return o ? clean(record.values[o.name], 400) : "";
}

/** Email khách điền — lấy từ ô nhập kiểu "email" đầu tiên của form. */
export function emailNguoiDangKy(
  form: RegisterForm,
  record: Registration
): string {
  const o = form.fields.find((f) => f.type === "email");
  return o ? clean(record.values[o.name], 200) : "";
}

/**
 * Các biến chung của chương trình (không phụ thuộc người nhận nào cả):
 * tên sự kiện, ngày, địa điểm, fanpage, website…
 * @param tenForm Tên form để điền biến {{ten_form}}; không liên quan form nào
 *   thì truyền chuỗi rỗng.
 */
export function bienChungCuaChuongTrinh(
  content: SiteContent,
  tenForm: string
): EmailVarValues {
  const { main } = content;
  return {
    ten_form: tenForm,
    nam: String(content.currentYear),
    ten_su_kien: main.site.name,
    ngay_su_kien: eventDateLabel(main.event.dateLabel, content.currentYear),
    dia_diem: main.event.location,
    fanpage: main.site.facebook,
    website: process.env.NEXT_PUBLIC_SITE_URL || "",
  };
}

/**
 * Toàn bộ biến cho lá thư gửi tới MỘT người đăng ký cụ thể — biến chung của
 * chương trình cộng thông tin riêng của người đó (họ tên, email, bảng thông
 * tin đã điền, thời điểm gửi).
 */
export function bienChoNguoiDangKy(
  record: Registration,
  form: RegisterForm,
  content: SiteContent
): EmailVarValues {
  const dong = Object.entries(record.labels ?? {}).map(([name, label]) => ({
    label,
    value: record.values[name] || "(để trống)",
  }));

  return {
    ...bienChungCuaChuongTrinh(content, form.name.trim() || form.id),
    ho_ten: tenNguoiDangKy(form, record),
    email: emailNguoiDangKy(form, record),
    vai_tro: vaiTroNguoiDangKy(form, record),
    thoi_diem: new Date(record.at).toLocaleString("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
    }),
    bang_thong_tin: buildInfoTable(dong),
  };
}
