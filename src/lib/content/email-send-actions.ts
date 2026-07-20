"use server";

// Gửi email CHỦ ĐỘNG — Ban tổ chức tự chọn người nhận rồi bấm gửi.
// (Khác với `register-actions.ts`: ở đó thư gửi tự động lúc khách vừa đăng ký.)
//
// Hai bước, cố ý tách đôi để không ai lỡ tay gửi nhầm:
//   1. `chuanBiGuiEmailAction` — giải ra danh sách người nhận và dựng lá thư
//      xem trước, CHƯA gửi gì cả.
//   2. `guiEmailHangLoatAction` — gửi thật, sau khi admin đã gõ xác nhận.
//
// AN TOÀN: mọi action ở đây đều kiểm tra đăng nhập quản trị NGAY DÒNG ĐẦU vì
// đây là dữ liệu cá nhân của người đăng ký. Ngoài ra, với kiểu "chon" và
// "tat-ca", danh sách địa chỉ email được giải Ở MÁY CHỦ từ dữ liệu trong Redis,
// không bao giờ tin danh sách do trình duyệt gửi lên.
import { CHUA_CAU_HINH, daCauHinhGuiThu, guiNhieuThu } from "./mailer";
import { isAdmin } from "@/lib/admin-auth";
import { getDraftContent } from "./store";
import { listRegistrations } from "./registrations";
import { addEmailLog } from "./email-log";
import {
  renderEmailTemplate,
  type EmailTemplate,
  type EmailVarValues,
} from "./email-templates";
import {
  bienChoNguoiDangKy,
  bienChungCuaChuongTrinh,
  emailNguoiDangKy,
  tenNguoiDangKy,
} from "./email-vars";
import {
  bienDangDung,
  GIOI_HAN_TU_NHAP,
  laEmailHopLe,
  tachEmail,
  type KetQuaChuanBi,
  type KetQuaGui,
  type YeuCauGui,
} from "./email-send-types";
import type { RegisterForm, SiteContent } from "./schema";

/** Câu báo dùng chung khi phiên đăng nhập đã hết hạn. */
const CHUA_DANG_NHAP =
  "Phiên đăng nhập quản trị đã hết hạn. Bạn đăng nhập lại rồi thử lại nhé.";

/** Một người nhận đã giải xong: hiện ra cho admin xem + biến để dựng thư riêng. */
type NguoiNhanDayDu = { ten: string; email: string; vars: EmailVarValues };

/* ------------------------------------------------------------------
   Bước 1 — xem trước
   ------------------------------------------------------------------ */

/**
 * Giải danh sách người nhận và dựng lá thư xem trước. KHÔNG gửi gì cả.
 * Lá thư xem trước dùng thông tin THẬT của người nhận đầu tiên, để admin thấy
 * đúng cái mà người ta sẽ nhận được.
 */
export async function chuanBiGuiEmailAction(
  yeuCau: YeuCauGui
): Promise<KetQuaChuanBi> {
  if (!(await isAdmin())) return { ok: false, error: CHUA_DANG_NHAP };

  const ketQua = await giaiNguoiNhan(yeuCau);
  if (!ketQua.ok) return { ok: false, error: ketQua.error };

  const { mau, nguoiNhan, canhBao } = ketQua;
  const dauTien = nguoiNhan[0];
  const thu = dauTien ? renderEmailTemplate(mau, dauTien.vars) : null;
  const xemTruoc = thu ? { subject: thu.subject, html: thu.html } : null;

  return {
    ok: true,
    nguoiNhan: nguoiNhan.map((n) => ({ ten: n.ten, email: n.email })),
    canhBao,
    xemTruoc,
  };
}

/* ------------------------------------------------------------------
   Bước 2 — gửi thật
   ------------------------------------------------------------------ */

/**
 * Gửi thư cho toàn bộ người nhận.
 * Mỗi người nhận được dựng thư RIÊNG theo thông tin của họ (họ tên, bảng thông
 * tin đã điền…), rồi gửi lần lượt từng lá qua hộp thư của Ban tổ chức.
 * Có lô lỗi thì vẫn báo rõ số gửi được / số hỏng, không báo "thành công" suông.
 */
export async function guiEmailHangLoatAction(
  yeuCau: YeuCauGui
): Promise<KetQuaGui> {
  if (!(await isAdmin()))
    return { ok: false, soThanhCong: 0, soLoi: 0, error: CHUA_DANG_NHAP };

  if (!daCauHinhGuiThu()) {
    return { ok: false, soThanhCong: 0, soLoi: 0, error: CHUA_CAU_HINH };
  }

  // Giải lại người nhận Ở MÁY CHỦ một lần nữa — không dùng lại danh sách đã
  // hiện ở bước xem trước, vì danh sách đó nằm trong trình duyệt, sửa được.
  const ketQua = await giaiNguoiNhan(yeuCau);
  if (!ketQua.ok)
    return { ok: false, soThanhCong: 0, soLoi: 0, error: ketQua.error };

  const { mau, nguoiNhan, tenForm } = ketQua;
  // Dựng sẵn từng lá thư — mỗi người nhận có bộ biến riêng (tên, bảng thông
  // tin đã điền...) nên nội dung không ai giống ai.
  const danhSachThu = nguoiNhan.map((n) => {
    const thu = renderEmailTemplate(mau, n.vars);
    return { to: n.email, subject: thu.subject, html: thu.html, text: thu.text };
  });

  const { soThanhCong, soLoi, loiDauTien } = await guiNhieuThu(danhSachThu);

  await addEmailLog({
    at: new Date().toISOString(),
    tenMau: mau.name.trim() || mau.id,
    kieu: yeuCau.kieu,
    tenForm: yeuCau.kieu === "tu-nhap" ? "" : tenForm,
    soNguoiNhan: nguoiNhan.length,
    soThanhCong,
    soLoi,
  });

  return {
    ok: soLoi === 0 && soThanhCong > 0,
    soThanhCong,
    soLoi,
    // Có lá hỏng thì nói thẳng lý do, đừng bắt admin đi đọc log.
    error: soLoi > 0 ? loiDauTien : undefined,
  };
}

/* ------------------------------------------------------------------
   Phần dùng chung của cả hai bước
   ------------------------------------------------------------------ */

type KetQuaGiai =
  | { ok: false; error: string }
  | {
      ok: true;
      mau: EmailTemplate;
      tenForm: string;
      nguoiNhan: NguoiNhanDayDu[];
      canhBao: string[];
    };

/**
 * Từ yêu cầu của trình duyệt -> danh sách người nhận thật kèm biến của từng người.
 * Đây là chỗ DUY NHẤT quyết định thư sẽ đi tới đâu, nên mọi kiểm tra an toàn
 * đều nằm ở đây.
 */
async function giaiNguoiNhan(yeuCau: YeuCauGui): Promise<KetQuaGiai> {
  const content = await getDraftContent();

  const mau = content.emailTemplates.find((t) => t.id === yeuCau.templateId);
  if (!mau) {
    return {
      ok: false,
      error:
        "Không tìm thấy mẫu email bạn chọn. Có thể mẫu vừa bị xoá — bạn tải lại trang rồi chọn lại nhé.",
    };
  }

  const form = content.main.registerForms.find((f) => f.id === yeuCau.formId);
  const tenForm = form ? form.name.trim() || form.id : "";
  const canhBao: string[] = [];

  const nguoiNhan =
    yeuCau.kieu === "tu-nhap"
      ? nguoiNhanTuNhap(yeuCau.emailTuNhap ?? "", content, tenForm, canhBao, mau)
      : await nguoiNhanTuDangKy(yeuCau, form, content, canhBao);

  if (nguoiNhan.length === 0) {
    return {
      ok: false,
      error:
        yeuCau.kieu === "tu-nhap"
          ? "Chưa có địa chỉ email nào hợp lệ. Bạn kiểm tra lại ô nhập giúp nhé."
          : "Không có ai để gửi. Có thể những người bạn chọn chưa điền email, hoặc form này chưa có đăng ký nào.",
    };
  }

  return { ok: true, mau, tenForm, nguoiNhan, canhBao };
}

/**
 * Kiểu 1 & 2 — người nhận lấy từ danh sách đăng ký trong Redis.
 * Trình duyệt chỉ nói "form nào" và "những mốc thời gian nào đã tích"; địa chỉ
 * email luôn đọc từ dữ liệu gốc ở đây.
 */
async function nguoiNhanTuDangKy(
  yeuCau: YeuCauGui,
  form: RegisterForm | undefined,
  content: SiteContent,
  canhBao: string[]
): Promise<NguoiNhanDayDu[]> {
  if (!form) return [];

  const tatCa = await listRegistrations(form.id);
  const daChon =
    yeuCau.kieu === "chon"
      ? (() => {
          const moc = new Set(yeuCau.mocThoiGian ?? []);
          return tatCa.filter((r) => moc.has(r.at));
        })()
      : tatCa;

  const ra: NguoiNhanDayDu[] = [];
  const daCoEmail = new Set<string>();
  let soThieuEmail = 0;
  let soTrung = 0;

  for (const record of daChon) {
    const email = emailNguoiDangKy(form, record);
    if (!email || !laEmailHopLe(email)) {
      soThieuEmail += 1;
      continue;
    }
    const khoa = email.toLowerCase();
    if (daCoEmail.has(khoa)) {
      soTrung += 1;
      continue;
    }
    daCoEmail.add(khoa);
    ra.push({
      ten: tenNguoiDangKy(form, record) || email,
      email,
      vars: bienChoNguoiDangKy(record, form, content),
    });
  }

  if (soThieuEmail > 0) {
    canhBao.push(
      `${soThieuEmail} người đăng ký không có địa chỉ email hợp lệ nên đã được bỏ qua.`
    );
  }
  if (soTrung > 0) {
    canhBao.push(
      `${soTrung} lượt đăng ký trùng địa chỉ email với người khác trong danh sách — mỗi địa chỉ chỉ nhận một lá thư.`
    );
  }
  return ra;
}

/**
 * Kiểu 3 — địa chỉ Ban tổ chức tự gõ (nhà tài trợ, đối tác…).
 * Ở đây buộc phải tin dữ liệu trình duyệt gửi lên, nên kiểm chặt: đúng dạng
 * email và giới hạn số lượng mỗi lượt.
 */
function nguoiNhanTuNhap(
  raw: string,
  content: SiteContent,
  tenForm: string,
  canhBao: string[],
  mau: EmailTemplate
): NguoiNhanDayDu[] {
  const tatCa = tachEmail(raw);
  const hopLe = tatCa.filter(laEmailHopLe);
  const soSai = tatCa.length - hopLe.length;
  if (soSai > 0) {
    canhBao.push(
      `${soSai} địa chỉ không đúng dạng email nên đã được bỏ qua.`
    );
  }

  const dungSo = hopLe.slice(0, GIOI_HAN_TU_NHAP);
  if (hopLe.length > GIOI_HAN_TU_NHAP) {
    canhBao.push(
      `Mỗi lượt chỉ gửi được tối đa ${GIOI_HAN_TU_NHAP} địa chỉ tự nhập, nên lần này chỉ gửi cho ${GIOI_HAN_TU_NHAP} địa chỉ đầu tiên.`
    );
  }

  // Người nhận tự nhập không gắn với lượt đăng ký nào -> các biến riêng như
  // {{ho_ten}}, {{bang_thong_tin}} sẽ hiện ra trống. Báo trước cho admin.
  const bienRieng = bienDangDung(mau.subject, mau.bodyHtml).filter((b) =>
    ["ho_ten", "thoi_diem", "bang_thong_tin"].includes(b)
  );
  if (bienRieng.length > 0) {
    canhBao.push(
      `Mẫu này có dùng ${bienRieng
        .map((b) => `{{${b}}}`)
        .join(", ")} — là thông tin riêng của người đăng ký. Gửi tới địa chỉ tự nhập thì những chỗ đó sẽ TRỐNG. Bạn nên chọn mẫu khác, hoặc bỏ các biến này ra khỏi mẫu.`
    );
  }

  const chung = bienChungCuaChuongTrinh(content, tenForm);
  return dungSo.map((email) => ({
    ten: "",
    email,
    vars: { ...chung, email },
  }));
}
