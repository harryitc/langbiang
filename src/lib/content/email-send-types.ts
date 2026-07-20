// Kiểu dữ liệu & hằng số cho màn hình "Gửi email".
//
// Module này THUẦN (không Redis, không gửi thư) để cả trình duyệt lẫn máy chủ
// cùng dùng một định nghĩa — hai bên không bao giờ hiểu khác nhau về dữ liệu.

/** Chọn người nhận theo cách nào. */
export type KieuNguoiNhan =
  /** Những người đăng ký được tích chọn trong bảng. */
  | "chon"
  /** Tất cả người đã đăng ký form đang chọn. */
  | "tat-ca"
  /** Địa chỉ email Ban tổ chức tự gõ (nhà tài trợ, đối tác…). */
  | "tu-nhap";

/** Một người sẽ nhận thư — chỉ tên và email, đủ để hiện ra cho admin xem lại. */
export type NguoiNhan = { ten: string; email: string };

/**
 * Yêu cầu gửi mà trình duyệt gửi lên máy chủ.
 *
 * CHÚ Ý AN TOÀN: với kiểu "chon" và "tat-ca", trình duyệt KHÔNG gửi lên địa chỉ
 * email nào cả — chỉ gửi form nào và những mốc thời gian đã tích. Máy chủ tự
 * đọc lại danh sách đăng ký để biết gửi cho ai. Nhờ vậy, kể cả có người lọt qua
 * được lớp đăng nhập quản trị thì cũng không biến trang này thành công cụ gửi
 * thư rác tới địa chỉ tuỳ ý được.
 */
export type YeuCauGui = {
  /** Mã mẫu email dùng để soạn nội dung thư. */
  templateId: string;
  kieu: KieuNguoiNhan;
  /** Form đang chọn — quyết định lấy danh sách đăng ký nào. */
  formId: string;
  /** Kiểu "chon": mốc thời gian gửi (trường `at`) của các dòng đã tích. */
  mocThoiGian?: string[];
  /** Kiểu "tu-nhap": các địa chỉ admin gõ, cách nhau bằng dấu phẩy hoặc xuống dòng. */
  emailTuNhap?: string;
};

/** Kết quả bước xem trước — máy chủ trả về danh sách người nhận đã giải xong. */
export type KetQuaChuanBi =
  | { ok: false; error: string }
  | {
      ok: true;
      nguoiNhan: NguoiNhan[];
      /** Những điều admin nên biết trước khi bấm gửi (không chặn gửi). */
      canhBao: string[];
      /** Lá thư đúng như người nhận ĐẦU TIÊN sẽ thấy. */
      xemTruoc: { subject: string; html: string } | null;
    };

/** Kết quả bước gửi thật. */
export type KetQuaGui = {
  /** Chỉ true khi TẤT CẢ đều gửi được. */
  ok: boolean;
  soThanhCong: number;
  soLoi: number;
  /** Lỗi khiến không gửi được lượt nào (thiếu cấu hình, không có người nhận…). */
  error?: string;
};

/** Một dòng trong nhật ký "đã gửi những gì". */
export type NhatKyGuiEmail = {
  /** Thời điểm gửi, dạng ISO. */
  at: string;
  /** Tên mẫu email lúc gửi (chép lại, để sau này đổi tên mẫu vẫn tra được). */
  tenMau: string;
  kieu: KieuNguoiNhan;
  /** Tên form liên quan; kiểu "tu-nhap" thì để rỗng. */
  tenForm: string;
  soNguoiNhan: number;
  soThanhCong: number;
  soLoi: number;
};

/** Tối đa bao nhiêu địa chỉ tự gõ trong MỘT lượt gửi. */
export const GIOI_HAN_TU_NHAP = 200;

/** Kiểm tra thô một địa chỉ email có đúng dạng không. */
export function laEmailHopLe(v: string): boolean {
  return /^[^\s@,;]+@[^\s@,;.]+(\.[^\s@,;.]+)+$/.test(v.trim());
}

/** Tách chuỗi admin gõ thành danh sách địa chỉ (bỏ trùng, bỏ khoảng trắng thừa). */
export function tachEmail(raw: string): string[] {
  const ra: string[] = [];
  const daCo = new Set<string>();
  for (const phan of raw.split(/[\s,;]+/)) {
    const e = phan.trim();
    if (!e) continue;
    const khoa = e.toLowerCase();
    if (daCo.has(khoa)) continue;
    daCo.add(khoa);
    ra.push(e);
  }
  return ra;
}

/** Các biến {{...}} đang có trong một mẫu email (tiêu đề + thân thư). */
export function bienDangDung(subject: string, bodyHtml: string): string[] {
  const ra = new Set<string>();
  for (const m of `${subject}\n${bodyHtml}`.matchAll(
    /\{\{\s*([a-z_]+)\s*\}\}/g
  )) {
    ra.add(m[1]);
  }
  return [...ra];
}
