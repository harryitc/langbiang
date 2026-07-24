// Kiểm tra cấu hình gửi thư (OAuth2 hoặc App Password) mà KHÔNG cần chạy Next.
// Dùng: node --env-file=.env.local scripts/kiem-tra-mail.mjs --to=ban@example.com
import nodemailer from "nodemailer";

const to = (process.argv.find((a) => a.startsWith("--to=")) || "").slice(5);
if (!to) {
  console.error("Thiếu --to=<email>. Vd: --to=trangsanglangbiang@gmail.com");
  process.exit(1);
}

const user = process.env.GMAIL_USER;
const tenNguoiGui = process.env.MAIL_FROM_NAME || "Trăng Sáng Langbiang";
let auth;
if (
  process.env.GMAIL_OAUTH_CLIENT_ID &&
  process.env.GMAIL_OAUTH_CLIENT_SECRET &&
  process.env.GMAIL_OAUTH_REFRESH_TOKEN
) {
  console.log("[test] Dùng OAuth2 — người gửi:", user);
  auth = {
    type: "OAuth2",
    user,
    clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
    clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
  };
} else if (process.env.GMAIL_APP_PASSWORD) {
  console.log("[test] Dùng App Password — người gửi:", user);
  auth = { user, pass: process.env.GMAIL_APP_PASSWORD };
} else {
  console.error("[test] Chưa đủ biến môi trường để gửi.");
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth,
});

try {
  await transporter.verify();
  console.log("[test] verify() OK — kết nối & xác thực thành công.");
  const info = await transporter.sendMail({
    from: `${tenNguoiGui} <${user}>`,
    to,
    subject: "Thư thử — cấu hình Gmail OAuth2",
    text: "Nếu bạn nhận được thư này, cấu hình gửi thư đã hoạt động.",
  });
  console.log("[test] Đã gửi. messageId =", info.messageId);
  process.exit(0);
} catch (err) {
  console.error("[test] LỖI:", err?.message || err);
  if (String(err?.message || "").includes("invalid_grant")) {
    console.error(
      "[test] => refresh token sai/hết hạn HOẶC app đang ở chế độ 'Testing'. " +
        "Publish app rồi lấy lại refresh token (xem docs/email-oauth2-setup.md)."
    );
  }
  process.exit(1);
}
