import "server-only";

// Gửi thư đi — MỘT cửa duy nhất cho cả website.
//
// Dùng SMTP của Gmail: thư đi từ chính hộp thư của Ban tổ chức, nên người nhận
// thấy địa chỉ quen thuộc và ít bị xếp vào thư rác. Quan trọng hơn: gửi được
// cho BẤT KỲ AI.
//
// (Trước đây dùng Resend với địa chỉ mặc định onboarding@resend.dev. Khi chưa
// xác thực tên miền, Resend CHỈ cho gửi tới email chủ tài khoản — nên tình
// nguyện viên không bao giờ nhận được thư cảm ơn. Đó là lý do đổi sang đây.)
//
// Hỗ trợ HAI cách xác thực với Gmail, tự dò theo biến môi trường:
//
//  A) OAuth2 (KHUYẾN NGHỊ — ổn định, không bị thu hồi khi đổi mật khẩu):
//     GMAIL_USER                 — địa chỉ Gmail dùng để gửi (chính là account
//                                  đã bấm "cho phép" khi lấy refresh token)
//     GMAIL_OAUTH_CLIENT_ID      — OAuth client ID (Google Cloud Console)
//     GMAIL_OAUTH_CLIENT_SECRET  — OAuth client secret
//     GMAIL_OAUTH_REFRESH_TOKEN  — refresh token (app phải Published, xem
//                                  docs/email-oauth2-setup.md)
//
//  B) App Password (cũ, dự phòng — hay bị Google thu hồi):
//     GMAIL_USER + GMAIL_APP_PASSWORD (mật khẩu ứng dụng 16 ký tự).
//
// Có đủ bộ OAuth2 -> dùng OAuth2. Không thì thử App Password. Không có gì ->
// không gửi, chỉ ghi log; mọi việc khác vẫn chạy.
import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

/** Một lá thư đã sẵn sàng gửi. */
export type ThuGui = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

/** Kết quả gửi một lô thư. */
export type KetQuaGui = {
  soThanhCong: number;
  soLoi: number;
  /** Lý do lỗi ĐẦU TIÊN gặp phải — để hiện cho admin, không bắt đọc log. */
  loiDauTien?: string;
};

/** Gmail chặn ở khoảng 500 thư/ngày với tài khoản thường. */
export const GIOI_HAN_NGAY = 500;

/** Chọn cách xác thực dựa trên biến môi trường đang có. */
function cheDoAuth(): "oauth2" | "app-password" | null {
  if (!process.env.GMAIL_USER) return null;
  if (
    process.env.GMAIL_OAUTH_CLIENT_ID &&
    process.env.GMAIL_OAUTH_CLIENT_SECRET &&
    process.env.GMAIL_OAUTH_REFRESH_TOKEN
  ) {
    return "oauth2";
  }
  if (process.env.GMAIL_APP_PASSWORD) return "app-password";
  return null;
}

/** Object `auth` cho nodemailer, hoặc null nếu chưa đủ cấu hình. */
function dungAuth(): SMTPTransport.Options["auth"] | null {
  switch (cheDoAuth()) {
    case "oauth2":
      return {
        type: "OAuth2",
        user: process.env.GMAIL_USER,
        clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
        clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
      };
    case "app-password":
      return {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      };
    default:
      return null;
  }
}

/** Cấu hình đã đủ để gửi chưa. */
export function daCauHinhGuiThu(): boolean {
  return cheDoAuth() !== null;
}

/** Câu giải thích khi chưa cấu hình — dùng chung để không viết lại nhiều nơi. */
export const CHUA_CAU_HINH =
  "Chưa cấu hình hộp thư gửi đi. Cần GMAIL_USER cùng bộ OAuth2 " +
  "(GMAIL_OAUTH_CLIENT_ID, GMAIL_OAUTH_CLIENT_SECRET, GMAIL_OAUTH_REFRESH_TOKEN) " +
  "hoặc GMAIL_APP_PASSWORD. Xem docs/email-oauth2-setup.md.";

/**
 * Dòng "người gửi" hiện trong hộp thư người nhận.
 * TÊN do admin đặt trong CMS (truyền vào đây); ĐỊA CHỈ lấy từ cấu hình máy chủ
 * vì đổi địa chỉ là phải đổi cả mật khẩu ứng dụng.
 */
function nguoiGui(tenHienThi?: string): string {
  const ten = tenHienThi?.trim() || process.env.MAIL_FROM_NAME || "Trăng Sáng Langbiang";
  return `${ten} <${process.env.GMAIL_USER}>`;
}

// Dùng lại một kết nối cho nhiều thư (pool) — mở kết nối mới cho từng lá thư
// vừa chậm vừa dễ bị Gmail chặn vì trông như đăng nhập liên tục.
let transporter: Transporter | null = null;

function layTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: dungAuth() ?? undefined,
      pool: true,
      maxConnections: 3,
      // Gmail khó chịu khi bị dội quá nhanh; giữ nhịp vừa phải.
      rateDelta: 1000,
      rateLimit: 5,
    });
  }
  return transporter;
}

/**
 * Gửi MỘT lá thư. Trả về lý do lỗi nếu hỏng, `null` nếu xong.
 * Không bao giờ ném lỗi ra ngoài — nơi gọi tự quyết định xử lý thế nào.
 */
export async function guiMotThu(
  thu: ThuGui,
  tenNguoiGui?: string
): Promise<string | null> {
  if (!daCauHinhGuiThu()) {
    console.warn("[mail] " + CHUA_CAU_HINH);
    return CHUA_CAU_HINH;
  }
  try {
    await layTransporter().sendMail({
      from: nguoiGui(tenNguoiGui),
      to: thu.to,
      subject: thu.subject,
      text: thu.text,
      html: thu.html,
    });
    return null;
  } catch (err) {
    const ly = err instanceof Error ? err.message : "Không rõ nguyên nhân.";
    console.error("[mail] Không gửi được thư tới", thu.to, "-", ly);
    return ly;
  }
}

/**
 * Gửi NHIỀU thư, lần lượt từng lá.
 *
 * Cố ý KHÔNG gửi ồ ạt song song: Gmail giới hạn theo nhịp, dội quá nhanh là bị
 * chặn tạm thời cả hộp thư. Thà chậm hơn vài giây còn hơn mất khả năng gửi.
 * Một lá hỏng cũng không dừng cả lô — trả về số thành công / số lỗi để nơi gọi
 * báo trung thực cho người dùng.
 */
export async function guiNhieuThu(
  danhSach: ThuGui[],
  tenNguoiGui?: string
): Promise<KetQuaGui> {
  if (!daCauHinhGuiThu()) {
    return {
      soThanhCong: 0,
      soLoi: danhSach.length,
      loiDauTien: CHUA_CAU_HINH,
    };
  }

  let soThanhCong = 0;
  let soLoi = 0;
  let loiDauTien: string | undefined;

  for (const thu of danhSach) {
    const loi = await guiMotThu(thu, tenNguoiGui);
    if (loi) {
      soLoi += 1;
      loiDauTien ??= loi;
    } else {
      soThanhCong += 1;
    }
  }

  return { soThanhCong, soLoi, loiDauTien };
}
