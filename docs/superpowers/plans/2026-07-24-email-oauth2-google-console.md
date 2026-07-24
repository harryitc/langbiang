# Chuyển email sang Gmail OAuth2 (Google Cloud Console) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Đổi cơ chế xác thực gửi thư của website từ Gmail App Password (hay bị thu hồi) sang Gmail SMTP + OAuth2 (XOAuth2), lấy credential từ Google Cloud Console, để gửi thư miễn phí và ổn định lâu dài.

**Architecture:** Toàn bộ việc gửi thư đã đi qua MỘT cửa duy nhất là `src/lib/content/mailer.ts`. Migration chỉ chạm 2 chỗ trong file này: hàm dựng transport (`layTransporter`) và hàm kiểm tra cấu hình (`daCauHinhGuiThu`). Ta thêm chế độ OAuth2 nhưng GIỮ nhánh App Password làm dự phòng (tự dò theo biến môi trường), nên không phá deploy hiện tại. Mọi thứ khác — templates, gửi hàng loạt, auto-send khi đăng ký, admin UI — không đổi một dòng.

**Tech Stack:** Next.js 16, TypeScript, nodemailer 9 (đã có sẵn, hỗ trợ XOAuth2 native — KHÔNG cần cài `googleapis`), Gmail SMTP `smtp.gmail.com:465`, Google Cloud Console OAuth2.

## Global Constraints

- Tài khoản Gmail gửi đi giữ nguyên: `harryitc.dev@gmail.com` (biến `GMAIL_USER`).
- KHÔNG thêm dependency mới vào `package.json`. nodemailer 9 đã hỗ trợ `auth.type = "OAuth2"`; lấy refresh token bằng Google OAuth 2.0 Playground (không cần code).
- OAuth consent screen BẮT BUỘC ở chế độ **In production (Published)**, KHÔNG để "Testing" (Testing → refresh token hết hạn sau 7 ngày).
- Scope OAuth: `https://mail.google.com/` (SMTP XOAuth2 cần scope full mail, không phải `gmail.send`).
- Giữ backward-compat: nếu chỉ có `GMAIL_APP_PASSWORD` (không có biến OAuth2) thì vẫn chạy như cũ.
- Tên biến môi trường mới, dùng nguyên văn: `GMAIL_OAUTH_CLIENT_ID`, `GMAIL_OAUTH_CLIENT_SECRET`, `GMAIL_OAUTH_REFRESH_TOKEN`.
- Comment và text hướng người dùng viết bằng tiếng Việt, theo giọng file `mailer.ts` hiện tại.
- Không parallel khi gửi lô (giữ nguyên logic tuần tự chống throttling của Gmail).

---

## File Structure

- `src/lib/content/mailer.ts` — **Modify.** Thêm 2 hàm pure để chọn chế độ auth + dựng `auth` object; sửa `daCauHinhGuiThu` và `layTransporter`. Đây là file chính.
- `.env.example` — **Modify.** Thêm 3 biến OAuth2 kèm chú thích cách lấy.
- `.env.local` — **Modify (local, KHÔNG commit).** Điền giá trị thật.
- `scripts/kiem-tra-mail.mjs` — **Create.** Script chạy tay để `verify()` kết nối SMTP + gửi 1 thư thử, dùng làm "test" cho migration này (repo chưa có test runner).
- `docs/email-oauth2-setup.md` — **Create.** Ghi lại các bước Google Cloud Console để sau này bàn giao / khôi phục.

---

## Task 1: Lấy credential OAuth2 từ Google Cloud Console (thao tác tay, có tài liệu)

Đây là bước tạo dữ liệu, không có code chạy tự động. Kết thúc task bạn phải có 3 giá trị thật: Client ID, Client Secret, Refresh Token.

**Files:**
- Create: `docs/email-oauth2-setup.md`

**Interfaces:**
- Produces: 3 giá trị chuỗi cho Task 3 & 4 — `GMAIL_OAUTH_CLIENT_ID`, `GMAIL_OAUTH_CLIENT_SECRET`, `GMAIL_OAUTH_REFRESH_TOKEN`. Refresh token phải lấy từ một app đã **Published**.

- [ ] **Step 1: Tạo project + bật Gmail API**

Vào https://console.cloud.google.com → tạo project mới (vd `langbiang-mail`). Vào **APIs & Services → Library** → tìm **Gmail API** → **Enable**.

- [ ] **Step 2: Cấu hình OAuth consent screen và PUBLISH**

**APIs & Services → OAuth consent screen**:
- User Type: **External** → Create.
- Điền App name (vd `Trăng Sáng Langbiang`), User support email = `harryitc.dev@gmail.com`, Developer contact = `harryitc.dev@gmail.com`.
- Scopes: bấm **Add or Remove Scopes**, dán thủ công `https://mail.google.com/` → Update.
- Test users: thêm `harryitc.dev@gmail.com`.
- Quay lại trang OAuth consent screen → bấm **PUBLISH APP** → xác nhận **Confirm**. Trạng thái phải chuyển thành **In production**.

⚠️ Nếu để "Testing", refresh token sẽ hết hạn sau 7 ngày — đúng cái lỗi đang muốn tránh. Bắt buộc **In production**.

Google sẽ báo "unverified app" khi bạn tự cấp quyền — không sao, vì bạn cấp cho chính tài khoản chủ app; bấm **Advanced → Go to (unsafe)** để tiếp tục. Không cần Google verification cho việc dùng nội bộ 1 tài khoản.

- [ ] **Step 3: Tạo OAuth Client ID**

**APIs & Services → Credentials → Create Credentials → OAuth client ID**:
- Application type: **Web application**.
- Name: `langbiang-mail-web`.
- Authorized redirect URIs: thêm `https://developers.google.com/oauthplayground`.
- Create → **lưu lại Client ID và Client Secret**.

- [ ] **Step 4: Lấy Refresh Token bằng OAuth Playground**

Vào https://developers.google.com/oauthplayground:
- Bấm bánh răng (⚙, góc phải trên) → tick **Use your own OAuth credentials** → dán Client ID & Client Secret vừa tạo → Close.
- Cột trái, ô "Input your own scopes", dán `https://mail.google.com/` → **Authorize APIs**.
- Đăng nhập bằng `harryitc.dev@gmail.com`, chấp nhận quyền (qua màn hình cảnh báo unverified nếu có).
- Bấm **Exchange authorization code for tokens**.
- **Copy giá trị `Refresh token`** (chuỗi bắt đầu bằng `1//...`).

- [ ] **Step 5: Ghi lại quy trình vào tài liệu**

Tạo `docs/email-oauth2-setup.md` tóm tắt đúng 5 bước trên (để bàn giao). Nội dung tối thiểu:

```markdown
# Cấu hình gửi email — Gmail OAuth2 (Google Cloud Console)

Website gửi thư qua Gmail SMTP xác thực bằng OAuth2. Cần 4 biến môi trường:

- `GMAIL_USER` — địa chỉ Gmail gửi đi (harryitc.dev@gmail.com)
- `GMAIL_OAUTH_CLIENT_ID` — OAuth client ID
- `GMAIL_OAUTH_CLIENT_SECRET` — OAuth client secret
- `GMAIL_OAUTH_REFRESH_TOKEN` — refresh token (bắt đầu bằng 1//)

## Cách lấy (khi cần tạo lại)
1. console.cloud.google.com → project → APIs & Services → Library → bật **Gmail API**.
2. OAuth consent screen: External → điền thông tin → scope `https://mail.google.com/`
   → **PUBLISH APP** (phải là "In production", KHÔNG để "Testing" vì token hết hạn 7 ngày).
3. Credentials → Create → OAuth client ID → Web application
   → redirect URI: https://developers.google.com/oauthplayground → lưu Client ID + Secret.
4. developers.google.com/oauthplayground → ⚙ Use your own OAuth credentials → dán ID/Secret
   → scope https://mail.google.com/ → Authorize → Exchange → copy **Refresh token**.

## Refresh token hết hạn khi nào
- App để "Testing" (7 ngày) — nên phải Published.
- Không dùng suốt 6 tháng.
- Đổi mật khẩu tài khoản Google.
- Tự thu hồi trong Google Account → Security → Third-party access.
Nếu hết hạn: làm lại bước 4 để lấy refresh token mới, cập nhật biến môi trường.
```

- [ ] **Step 6: Commit tài liệu**

```bash
git add docs/email-oauth2-setup.md
git commit -m "docs: hướng dẫn cấu hình Gmail OAuth2 cho email"
```

---

## Task 2: Sửa `mailer.ts` — thêm chế độ OAuth2, giữ App Password làm dự phòng

**Files:**
- Modify: `src/lib/content/mailer.ts:40-82` (hàm `daCauHinhGuiThu`, khối comment đầu file, hàm `layTransporter`)
- Test: `scripts/kiem-tra-mail.mjs` (tạo ở Task 3 — task này verify bằng `tsc`/`lint`)

**Interfaces:**
- Consumes: 4 biến môi trường `GMAIL_USER`, `GMAIL_OAUTH_CLIENT_ID`, `GMAIL_OAUTH_CLIENT_SECRET`, `GMAIL_OAUTH_REFRESH_TOKEN` (và `GMAIL_APP_PASSWORD` cho nhánh cũ).
- Produces: `daCauHinhGuiThu(): boolean` (giữ nguyên chữ ký — mọi nơi gọi không đổi). Nội bộ thêm `cheDoAuth(): "oauth2" | "app-password" | null` và `dungAuth(): SMTPTransport.Options["auth"] | null`. Không export 2 hàm mới ra ngoài — chỉ dùng trong file.

- [ ] **Step 1: Cập nhật khối comment đầu file cho đúng thực tế**

Trong `src/lib/content/mailer.ts`, thay khối comment dòng 13-17 (đoạn "Cần hai biến môi trường... Thiếu một trong hai") bằng:

```ts
// Hỗ trợ HAI cách xác thực với Gmail, tự dò theo biến môi trường:
//
//  A) OAuth2 (KHUYẾN NGHỊ — ổn định, không bị thu hồi khi đổi mật khẩu):
//     GMAIL_USER                 — địa chỉ Gmail dùng để gửi
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
```

- [ ] **Step 2: Thêm hàm chọn chế độ + dựng auth, và sửa `daCauHinhGuiThu`**

Thay nguyên hàm `daCauHinhGuiThu` (dòng 40-43) bằng đoạn sau (thêm import kiểu ở đầu file nếu cần):

```ts
import type SMTPTransport from "nodemailer/lib/smtp-transport";

/** Chọn cách xác thực dựa trên biến môi trường đang có. */
function cheDoAuth(): "oauth2" | "app-password" | null {
  const coUser = !!process.env.GMAIL_USER;
  if (!coUser) return null;
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
```

- [ ] **Step 3: Cập nhật câu thông báo chưa cấu hình**

Thay hằng `CHUA_CAU_HINH` (dòng 46-48) bằng:

```ts
export const CHUA_CAU_HINH =
  "Chưa cấu hình hộp thư gửi đi. Cần GMAIL_USER cùng bộ OAuth2 " +
  "(GMAIL_OAUTH_CLIENT_ID, GMAIL_OAUTH_CLIENT_SECRET, GMAIL_OAUTH_REFRESH_TOKEN) " +
  "hoặc GMAIL_APP_PASSWORD. Xem docs/email-oauth2-setup.md.";
```

- [ ] **Step 4: Dùng `dungAuth()` trong `layTransporter`**

Thay khối `auth: { ... }` trong `layTransporter` (dòng 70-73) bằng:

```ts
      auth: dungAuth() ?? undefined,
```

Giữ nguyên `host`, `port`, `secure`, `pool`, `maxConnections`, `rateDelta`, `rateLimit`. nodemailer tự làm mới access token từ refresh token khi dùng OAuth2, pool vẫn hoạt động bình thường.

- [ ] **Step 5: Kiểm tra biên dịch TypeScript + lint**

Run: `cd /home/harryitc/my_project/langbiang && npx tsc --noEmit && npx next lint`
Expected: PASS, không lỗi type ở `mailer.ts`. (Nếu `next lint` cảnh báo file khác không liên quan thì bỏ qua; `mailer.ts` phải sạch.)

- [ ] **Step 6: Commit**

```bash
git add src/lib/content/mailer.ts
git commit -m "feat(email): thêm xác thực Gmail OAuth2, giữ App Password dự phòng"
```

---

## Task 3: Script kiểm tra kết nối + gửi thư thử (thay cho unit test)

Repo chưa có test runner; migration email chỉ chứng minh được bằng kết nối thật tới Gmail. Script này là "test" của plan: `verify()` + gửi 1 thư.

**Files:**
- Create: `scripts/kiem-tra-mail.mjs`

**Interfaces:**
- Consumes: 4 biến OAuth2 từ `.env.local`, và tham số CLI `--to=<email>` để nhận thư thử.
- Produces: exit code 0 nếu gửi được, 1 nếu lỗi (in rõ lý do).

- [ ] **Step 1: Viết script kiểm tra**

Tạo `scripts/kiem-tra-mail.mjs`:

```js
// Kiểm tra cấu hình gửi thư (OAuth2 hoặc App Password) mà KHÔNG cần chạy Next.
// Dùng: node --env-file=.env.local scripts/kiem-tra-mail.mjs --to=ban@example.com
import nodemailer from "nodemailer";

const to = (process.argv.find((a) => a.startsWith("--to=")) || "").slice(5);
if (!to) {
  console.error("Thiếu --to=<email>. Vd: --to=harryitc.dev@gmail.com");
  process.exit(1);
}

const user = process.env.GMAIL_USER;
let auth;
if (
  process.env.GMAIL_OAUTH_CLIENT_ID &&
  process.env.GMAIL_OAUTH_CLIENT_SECRET &&
  process.env.GMAIL_OAUTH_REFRESH_TOKEN
) {
  console.log("[test] Dùng OAuth2");
  auth = {
    type: "OAuth2",
    user,
    clientId: process.env.GMAIL_OAUTH_CLIENT_ID,
    clientSecret: process.env.GMAIL_OAUTH_CLIENT_SECRET,
    refreshToken: process.env.GMAIL_OAUTH_REFRESH_TOKEN,
  };
} else if (process.env.GMAIL_APP_PASSWORD) {
  console.log("[test] Dùng App Password");
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
    from: `Trăng Sáng Langbiang <${user}>`,
    to,
    subject: "Thư thử — cấu hình OAuth2",
    text: "Nếu bạn nhận được thư này, cấu hình gửi thư đã hoạt động.",
  });
  console.log("[test] Đã gửi. messageId =", info.messageId);
  process.exit(0);
} catch (err) {
  console.error("[test] LỖI:", err?.message || err);
  process.exit(1);
}
```

- [ ] **Step 2: Điền `.env.local` với credential thật từ Task 1**

Mở `.env.local`, thêm (giữ `GMAIL_USER` cũ, có thể xoá dòng `GMAIL_APP_PASSWORD` sau khi test OAuth2 xong):

```
GMAIL_OAUTH_CLIENT_ID=<client id từ Task 1>
GMAIL_OAUTH_CLIENT_SECRET=<client secret từ Task 1>
GMAIL_OAUTH_REFRESH_TOKEN=<refresh token 1//... từ Task 1>
```

- [ ] **Step 3: Chạy test gửi thư thật**

Run (dùng nvm node 26 như thói quen dự án):
```bash
cd /home/harryitc/my_project/langbiang && node --env-file=.env.local scripts/kiem-tra-mail.mjs --to=harryitc.dev@gmail.com
```
Expected: in `[test] Dùng OAuth2`, `verify() OK`, `Đã gửi. messageId = ...`, exit 0. Kiểm tra hộp thư `harryitc.dev@gmail.com` thấy "Thư thử — cấu hình OAuth2".

Nếu lỗi `invalid_grant` → refresh token sai hoặc app đang "Testing"; làm lại Task 1 Step 2 (Publish) và Step 4.

- [ ] **Step 4: Commit script**

```bash
git add scripts/kiem-tra-mail.mjs
git commit -m "chore(email): script kiểm tra kết nối & gửi thư thử"
```

---

## Task 4: Cập nhật `.env.example`, thu hồi App Password cũ, deploy

**Files:**
- Modify: `.env.example:14-19`

**Interfaces:**
- Consumes: kết quả Task 2 & 3 (mailer đã chạy OAuth2, test đã pass).

- [ ] **Step 1: Cập nhật `.env.example`**

Thay khối dòng 14-19 trong `.env.example` bằng:

```
# Hộp thư gửi đi (Gmail). Chọn 1 trong 2 cách xác thực:
#
# Cách A — OAuth2 (KHUYẾN NGHỊ, ổn định lâu dài). Xem docs/email-oauth2-setup.md.
GMAIL_USER=...
GMAIL_OAUTH_CLIENT_ID=...
GMAIL_OAUTH_CLIENT_SECRET=...
GMAIL_OAUTH_REFRESH_TOKEN=...
#
# Cách B — App Password (dự phòng, hay bị thu hồi). Chỉ cần khi KHÔNG dùng OAuth2:
# GMAIL_APP_PASSWORD=...
MAIL_FROM_NAME="Trăng Sáng Langbiang"
```

- [ ] **Step 2: Khai báo biến môi trường trên Vercel**

Trên Vercel project (`langbiang-dalat.vercel.app`) → Settings → Environment Variables, thêm cho cả Production & Preview:
- `GMAIL_OAUTH_CLIENT_ID`, `GMAIL_OAUTH_CLIENT_SECRET`, `GMAIL_OAUTH_REFRESH_TOKEN` (giá trị từ Task 1).
- Giữ `GMAIL_USER`, `MAIL_FROM_NAME`.
- **Xoá** `GMAIL_APP_PASSWORD` khỏi Vercel sau khi xác nhận OAuth2 chạy.

- [ ] **Step 3: Thu hồi App Password cũ (bảo mật)**

Vì `avwirnifjfxtdoox` đã lộ trong `.env.local` trên đĩa: vào https://myaccount.google.com/apppasswords → xoá App Password cũ. Xoá luôn dòng `GMAIL_APP_PASSWORD=...` trong `.env.local`.

- [ ] **Step 4: Commit `.env.example` và push**

```bash
git add .env.example
git commit -m "docs(email): .env.example dùng Gmail OAuth2, App Password thành dự phòng"
git push origin master
```

- [ ] **Step 5: Xác minh trên production**

Sau khi Vercel deploy xong, vào `/admin` → **Gửi email**, gửi thử cho 1 địa chỉ của bạn. Expected: gửi thành công, hộp thư ghi log (`email:log` trong Redis) có bản ghi mới, và thư về đúng hộp.

---

## Self-Review

**Spec coverage:**
- "Đổi sang Google Console" → Task 1 (tạo OAuth2 credential trên Google Cloud Console).
- "Xài vĩnh viễn mà free" → Global Constraints + Task 1 Step 2 (Publish app để token không hết hạn 7 ngày); Gmail free 500 thư/ngày.
- "App Password hay hết hạn" → Task 2 chuyển sang OAuth2; Task 4 Step 3 thu hồi App Password lộ.
- Giữ mọi tính năng cũ (admin sender, auto-send, templates) → migration khu trú trong `mailer.ts`, chữ ký `daCauHinhGuiThu` không đổi.

**Placeholder scan:** Các `<client id...>`, `<refresh token...>` là chỗ điền giá trị thật do người dùng lấy ở Task 1 — không phải placeholder code. Toàn bộ code đều là bản đầy đủ chạy được.

**Type consistency:** `cheDoAuth()` trả `"oauth2" | "app-password" | null` dùng nhất quán ở `dungAuth()` và `daCauHinhGuiThu()`. `dungAuth()` trả `SMTPTransport.Options["auth"] | null`, khớp `auth: dungAuth() ?? undefined` trong `layTransporter`. Script test (`kiem-tra-mail.mjs`) lặp lại đúng logic dò biến môi trường như `mailer.ts` (cố ý, vì script chạy ngoài Next, không import `server-only`).
