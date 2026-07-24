# Cấu hình gửi email — Gmail OAuth2 (Google Cloud Console)

Website gửi thư qua **Gmail SMTP xác thực bằng OAuth2** (nodemailer, không cần cài
thêm thư viện). Ổn định hơn App Password (không bị thu hồi khi đổi mật khẩu).

- **Account gửi / hiện làm người gửi:** `trangsanglangbiang@gmail.com`
- **Google Cloud project:** có thể nằm dưới account nào cũng được (vd `harryitc.dev`).
  Điều quyết định "ai là người gửi" là **account bạn đăng nhập khi lấy refresh token**,
  KHÔNG phải chủ project. Nên ở bước lấy token, phải đăng nhập bằng
  `trangsanglangbiang@gmail.com`.

Cần 4 biến môi trường:

| Biến | Giá trị |
|------|---------|
| `GMAIL_USER` | `trangsanglangbiang@gmail.com` |
| `GMAIL_OAUTH_CLIENT_ID` | OAuth client ID (Phần 1) |
| `GMAIL_OAUTH_CLIENT_SECRET` | OAuth client secret (Phần 1) |
| `GMAIL_OAUTH_REFRESH_TOKEN` | refresh token, bắt đầu bằng `1//` (Phần 2) |

`MAIL_FROM_NAME` (tên hiển thị) giữ như cũ. `GMAIL_APP_PASSWORD` cũ có thể xoá sau khi
OAuth2 chạy ổn.

---

## Phần 1 — Tạo OAuth2 credential trên Google Cloud Console

1. Vào https://console.cloud.google.com → tạo project mới (vd `langbiang-mail`).
2. **APIs & Services → Library** → tìm **Gmail API** → **Enable**.
3. **APIs & Services → OAuth consent screen**:
   - User Type: **External** → Create.
   - App name: `Trăng Sáng Langbiang`; User support email và Developer contact:
     điền email của bạn.
   - **Scopes** → Add or Remove Scopes → dán thủ công `https://mail.google.com/` → Update.
   - **Test users** → thêm `trangsanglangbiang@gmail.com` (account sẽ gửi thư).
   - Quay lại trang OAuth consent screen → **PUBLISH APP** → **Confirm**.
     Trạng thái phải là **In production**.

   > ⚠️ BẮT BUỘC Publish. Nếu để **Testing**, refresh token hết hạn sau **7 ngày**
   > (còn tệ hơn App Password). Publish thì token sống mãi. Publish chỉ là bấm nút,
   > miễn phí, không cần Google duyệt. Không cần "verification" vì chỉ 1 account
   > tự cấp quyền cho chính mình.

4. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**, Name: `langbiang-mail-web`.
   - **Authorized redirect URIs** → thêm `https://developers.google.com/oauthplayground`.
   - Create → **lưu lại Client ID và Client Secret**.

---

## Phần 2 — Lấy Refresh Token (đăng nhập bằng account gửi)

1. Vào https://developers.google.com/oauthplayground
2. Bấm bánh răng ⚙ (góc phải trên) → tick **Use your own OAuth credentials** →
   dán **Client ID** & **Client Secret** ở Phần 1 → Close.
3. Cột trái, ô **"Input your own scopes"**, dán `https://mail.google.com/` →
   **Authorize APIs**.
4. **Đăng nhập bằng `trangsanglangbiang@gmail.com`** (QUAN TRỌNG — account này quyết
   định người gửi). Qua màn hình cảnh báo "Google hasn't verified this app" bằng
   **Advanced → Go to … (unsafe)** → **Allow**.
5. Bấm **Exchange authorization code for tokens**.
6. **Copy giá trị `Refresh token`** (chuỗi bắt đầu `1//...`).

---

## Phần 3 — Điền biến môi trường & test ở máy (local)

1. Mở `.env.local`, đặt:
   ```
   GMAIL_USER=trangsanglangbiang@gmail.com
   GMAIL_OAUTH_CLIENT_ID=<client id>
   GMAIL_OAUTH_CLIENT_SECRET=<client secret>
   GMAIL_OAUTH_REFRESH_TOKEN=<refresh token 1//...>
   MAIL_FROM_NAME="Trăng Sáng Langbiang"
   ```
   (Có thể xoá dòng `GMAIL_APP_PASSWORD` cũ.)

2. Chạy test gửi thư thật (Node 20.6+; dự án dùng nvm node 26):
   ```bash
   node --env-file=.env.local scripts/kiem-tra-mail.mjs --to=trangsanglangbiang@gmail.com
   ```
   Mong đợi: `[test] Dùng OAuth2`, `verify() OK`, `Đã gửi. messageId = ...`, và có
   thư "Thư thử — cấu hình Gmail OAuth2" trong hộp thư.

   Lỗi `invalid_grant` → token sai hoặc app đang "Testing": Publish app (Phần 1.3)
   rồi lấy lại token (Phần 2).

---

## Phần 4 — Khai báo biến trên Vercel & deploy

1. Vercel project (`trangsang.vn`) → **Settings → Environment Variables**, thêm cho
   cả **Production** và **Preview**:
   - `GMAIL_USER = trangsanglangbiang@gmail.com`
   - `GMAIL_OAUTH_CLIENT_ID`, `GMAIL_OAUTH_CLIENT_SECRET`, `GMAIL_OAUTH_REFRESH_TOKEN`
   - `MAIL_FROM_NAME` (nếu chưa có)
   - **Xoá** `GMAIL_APP_PASSWORD` sau khi xác nhận OAuth2 chạy.
2. Redeploy (Vercel tự deploy khi push, hoặc bấm Redeploy để nạp biến mới).
3. Kiểm tra: `/admin` → **Gửi email** → gửi thử. Thư về đúng hộp, From hiện
   `Trăng Sáng Langbiang <trangsanglangbiang@gmail.com>`, và có bản ghi trong log
   (`email:log` trên Redis).

---

## Refresh token hết hạn khi nào (để sau này còn biết đường sửa)

- App để **Testing** (7 ngày) — nên phải **Published**.
- Không dùng suốt **6 tháng**.
- **Đổi mật khẩu** account `trangsanglangbiang@gmail.com`.
- Tự thu hồi trong Google Account → Security → Third-party access.

Khi hết hạn: làm lại **Phần 2** để lấy refresh token mới, cập nhật biến ở `.env.local`
và Vercel.

---

## Giới hạn & lưu ý

- Gmail thường: **~500 thư/ngày** (đã phản ánh trong hằng số `GIOI_HAN_NGAY = 500`).
- Vì gửi từ một địa chỉ `@gmail.com` thật nên deliverability tốt, Gmail tự ký DKIM,
  không dính vấn đề DMARC như khi giả danh tên miền riêng.
