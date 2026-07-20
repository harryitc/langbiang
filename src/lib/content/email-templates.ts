// Mẫu email — nội dung email do admin soạn, mỗi form đăng ký chọn mẫu tương ứng.
//
// Module này THUẦN (không Redis, không "server-only") để admin xem trước ngay
// trên trình duyệt bằng đúng hàm mà server dùng lúc gửi thật — xem trước và
// email nhận được không bao giờ lệch nhau.

/** Một mẫu email admin soạn trong CMS. */
export type EmailTemplate = {
  id: string;
  /** Tên hiển thị trong danh sách chọn mẫu, vd "Cảm ơn đã đăng ký". */
  name: string;
  /** Ghi chú cho admin — mẫu này dùng khi nào. */
  note?: string;
  /**
   * Gửi cho ai:
   *  - "nguoi-dang-ky": gửi tới email khách vừa điền trong form.
   *  - "ban-to-chuc":  gửi tới hộp thư BTC (recipientEmail của form).
   */
  sendTo: "nguoi-dang-ky" | "ban-to-chuc";
  /** Tiêu đề email — có thể chứa biến {{...}}. */
  subject: string;
  /** Thân email (HTML từ CKEditor) — có thể chứa biến {{...}}. */
  bodyHtml: string;
};

/**
 * Biến chèn được vào tiêu đề/thân email.
 * Danh sách này vừa dùng để thay giá trị lúc gửi, vừa hiển thị thành bảng
 * gợi ý trong màn hình soạn mẫu để admin không phải nhớ.
 */
export const EMAIL_VARS = [
  { key: "ho_ten", label: "Họ tên người đăng ký", vd: "Nguyễn Văn A" },
  { key: "email", label: "Email người đăng ký", vd: "an@email.com" },
  { key: "ten_form", label: "Tên form đăng ký", vd: "Langbiang 2026" },
  { key: "nam", label: "Năm của mùa hiện tại", vd: "2026" },
  { key: "thoi_diem", label: "Lúc gửi đăng ký", vd: "09:12 20/07/2026" },
  { key: "ten_su_kien", label: "Tên chương trình", vd: "Trăng Sáng Langbiang" },
  { key: "ngay_su_kien", label: "Ngày diễn ra", vd: "Ngày 26 – 27 tháng 9 năm 2026" },
  { key: "dia_diem", label: "Nơi tổ chức", vd: "Phường Langbiang, Đà Lạt" },
  { key: "fanpage", label: "Link Fanpage Facebook", vd: "https://facebook.com/..." },
  { key: "website", label: "Địa chỉ website", vd: "https://langbiang-dalat.vercel.app" },
  {
    key: "bang_thong_tin",
    label: "Bảng toàn bộ thông tin đã điền",
    vd: "(bảng họ tên, email, SĐT…)",
  },
] as const;

export type EmailVarKey = (typeof EMAIL_VARS)[number]["key"];

/** Giá trị các biến khi gửi 1 email cụ thể. */
export type EmailVarValues = Partial<Record<EmailVarKey, string>>;

/**
 * Biến đã là HTML dựng sẵn (không escape).
 * Mọi biến KHÁC đều là chữ khách nhập -> luôn escape để không chèn được thẻ.
 */
const HTML_VARS: ReadonlySet<string> = new Set(["bang_thong_tin"]);

/** Chèn chữ của khách vào HTML an toàn. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Thay {{bien}} bằng giá trị.
 * Biến không có giá trị -> thay bằng rỗng (không để lộ {{...}} trong email gửi đi).
 */
function fillVars(
  tpl: string,
  vars: EmailVarValues,
  { html }: { html: boolean }
): string {
  return tpl.replace(/\{\{\s*([a-z_]+)\s*\}\}/g, (_, key: string) => {
    const raw = vars[key as EmailVarKey] ?? "";
    if (!html) return raw;
    return HTML_VARS.has(key) ? raw : escapeHtml(raw);
  });
}

/* ------------------------------------------------------------------
   Khung email — bảng HTML kiểu cũ để chạy được cả trên Gmail/Outlook
   ------------------------------------------------------------------ */

// Màu lấy đúng từ src/app/globals.css để email đồng bộ với website.
const C = {
  forest: "#1b5e20",
  leafDeep: "#2e7d32",
  leaf: "#5cb85c",
  grass: "#7cc34a",
  sun: "#f5a623",
  cream: "#fdfcf5",
  ink: "#1f2a24",
  muted: "#5b6b63",
  line: "#dfe7e2",
};

/**
 * Bọc nội dung vào khung email hoàn chỉnh (header trăng + footer).
 * Email client bỏ qua <style> và class -> mọi thứ phải là inline style,
 * bố cục bằng <table>, bề ngang cố định 600px.
 */
export function wrapEmailShell(
  bodyHtml: string,
  opts: { title: string; preheader?: string; footerNote?: string }
): string {
  const { title, preheader = "", footerNote = "" } = opts;
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.cream};">
  <!-- Dòng xem trước trong hộp thư, không hiện trong email -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.cream};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 8px rgba(27,94,32,.08);">

        <!-- Header -->
        <tr><td style="background:linear-gradient(120deg,${C.leafDeep},${C.leaf} 45%,${C.grass});padding:28px 32px;">
          <div style="font-size:30px;line-height:1;margin-bottom:8px;">🌕</div>
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#ffffff;">
            ${escapeHtml(title)}
          </div>
        </td></tr>

        <!-- Nội dung -->
        <tr><td style="padding:28px 32px;font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.65;color:${C.ink};">
          ${bodyHtml}
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:18px 32px 26px;border-top:1px solid ${C.line};font-family:system-ui,Arial,sans-serif;font-size:12px;line-height:1.6;color:${C.muted};">
          ${footerNote ? `<div style="margin-bottom:6px;">${footerNote}</div>` : ""}
          <div>Email này được gửi tự động — bạn không cần trả lời.</div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Bảng "thông tin bạn đã điền" dựng từ các ô trong form. */
export function buildInfoTable(
  rows: { label: string; value: string }[]
): string {
  if (rows.length === 0) return "";
  const tds = rows
    .map(
      (r) => `<tr>
        <td style="padding:9px 12px;border:1px solid ${C.line};background:#f7faf7;font-weight:600;white-space:nowrap;vertical-align:top;">${escapeHtml(r.label)}</td>
        <td style="padding:9px 12px;border:1px solid ${C.line};">${escapeHtml(r.value)}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:14px;">${tds}</table>`;
}

/** Nút bấm (email client không hỗ trợ CSS button -> dùng thẻ a dạng khối). */
export function emailButton(label: string, href: string): string {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 26px;background:${C.leafDeep};color:#ffffff;text-decoration:none;border-radius:999px;font-weight:600;font-size:15px;">${escapeHtml(label)}</a>`;
}

/* ------------------------------------------------------------------
   Kết xuất 1 mẫu thành email gửi được
   ------------------------------------------------------------------ */

export type RenderedEmail = { subject: string; html: string; text: string };

/** HTML -> chữ thuần, cho bản text đi kèm (lọc spam tốt hơn & máy đọc được). */
function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|h[1-6]|li)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    // Bảng 2 cột (nhãn | giá trị) -> "Nhãn: giá trị" cho dễ đọc ở bản text.
    .replace(/<\/td>\s*<td[^>]*>/gi, ": ")
    .replace(/<\/?td[^>]*>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Thay biến + bọc khung -> email hoàn chỉnh sẵn sàng gửi. */
export function renderEmailTemplate(
  tpl: EmailTemplate,
  vars: EmailVarValues
): RenderedEmail {
  const subject = fillVars(tpl.subject, vars, { html: false });
  const body = fillVars(tpl.bodyHtml, vars, { html: true });
  const html = wrapEmailShell(body, {
    title: subject,
    preheader: htmlToText(body).slice(0, 120),
    footerNote: vars.ten_su_kien
      ? `${escapeHtml(vars.ten_su_kien)}${vars.website ? ` — <a href="${escapeHtml(vars.website)}" style="color:${C.leafDeep};">${escapeHtml(vars.website)}</a>` : ""}`
      : "",
  });
  return { subject, html, text: htmlToText(body) };
}

/** Giá trị mẫu để admin bấm "Xem trước" mà chưa cần có đăng ký thật. */
export const PREVIEW_VARS: EmailVarValues = {
  ho_ten: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  ten_form: "Langbiang 2026",
  nam: "2026",
  thoi_diem: "09:12 20/07/2026",
  ten_su_kien: "Trăng Sáng Langbiang",
  ngay_su_kien: "Ngày 26 – 27 tháng 9 năm 2026",
  dia_diem: "Phường Langbiang, Đà Lạt, Lâm Đồng",
  fanpage: "https://www.facebook.com/trangsanglangbiang",
  website: "https://langbiang-dalat.vercel.app",
  bang_thong_tin: buildInfoTable([
    { label: "Họ và tên", value: "Nguyễn Văn A" },
    { label: "Email", value: "nguyenvana@email.com" },
    { label: "Số điện thoại", value: "0901 234 567" },
    { label: "Ngày sinh", value: "2004-05-18" },
    { label: "Vai trò", value: "Tình nguyện viên" },
  ]),
};

/* ------------------------------------------------------------------
   Mẫu mặc định — có sẵn khi mở CMS lần đầu, admin sửa thoải mái
   ------------------------------------------------------------------ */

export const TEMPLATE_CAM_ON_ID = "cam-on-dang-ky";
export const TEMPLATE_BAO_BTC_ID = "bao-ban-to-chuc";

/** Mẫu email hoàn chỉnh gửi cho người vừa đăng ký. */
const camOnBody = `
<p style="margin:0 0 14px;">Chào <strong>{{ho_ten}}</strong>,</p>

<p style="margin:0 0 14px;">
  Ban Tổ chức <strong>{{ten_su_kien}}</strong> đã nhận được đăng ký của bạn cho
  <strong>{{ten_form}}</strong>. Cảm ơn bạn đã sẵn lòng đồng hành để mang một mùa
  Trung thu trọn vẹn đến các em nhỏ vùng cao 🌙
</p>

<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px;background:#f7faf7;border-left:4px solid #5cb85c;border-radius:8px;">
  <tr><td style="padding:14px 16px;font-size:14px;line-height:1.7;">
    <div style="margin-bottom:4px;"><strong>Chương trình:</strong> {{ten_su_kien}} {{nam}}</div>
    <div style="margin-bottom:4px;"><strong>Thời gian:</strong> {{ngay_su_kien}}</div>
    <div><strong>Địa điểm:</strong> {{dia_diem}}</div>
  </td></tr>
</table>

<p style="margin:0 0 10px;font-weight:600;">Thông tin bạn đã gửi</p>
{{bang_thong_tin}}

<p style="margin:20px 0 14px;">
  Ban Tổ chức sẽ xem qua và liên hệ lại với bạn qua email hoặc điện thoại trong
  thời gian sớm nhất. Nếu có thông tin nào cần chỉnh sửa, bạn cứ trả lời email
  này hoặc nhắn cho tụi mình qua Fanpage nhé.
</p>

<p style="margin:0 0 26px;">
  <a href="{{fanpage}}" style="display:inline-block;padding:12px 26px;background:#2e7d32;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:600;font-size:15px;">Nhắn cho Ban Tổ chức</a>
</p>

<p style="margin:0;color:#5b6b63;">
  Hẹn gặp bạn dưới ánh trăng Langbiang,<br>
  <strong style="color:#1b5e20;">Ban Tổ chức {{ten_su_kien}}</strong>
</p>
`.trim();

/** Mẫu email báo cho Ban Tổ chức khi có người đăng ký mới. */
const baoBtcBody = `
<p style="margin:0 0 14px;">
  Vừa có một đăng ký mới qua form <strong>{{ten_form}}</strong>.
</p>

<p style="margin:0 0 16px;color:#5b6b63;font-size:14px;">
  Thời điểm gửi: {{thoi_diem}}
</p>

{{bang_thong_tin}}

<p style="margin:20px 0 0;font-size:14px;color:#5b6b63;">
  Xem toàn bộ danh sách đăng ký trong trang quản trị, mục
  <strong>Đăng ký nhận được</strong>.
</p>
`.trim();

export const defaultEmailTemplates: EmailTemplate[] = [
  {
    id: TEMPLATE_CAM_ON_ID,
    name: "Cảm ơn đã đăng ký",
    note: "Gửi tự động cho người vừa điền form, xác nhận đã nhận được đăng ký.",
    sendTo: "nguoi-dang-ky",
    subject: "Cảm ơn bạn đã đăng ký {{ten_form}} 🌕",
    bodyHtml: camOnBody,
  },
  {
    id: TEMPLATE_BAO_BTC_ID,
    name: "Báo tin cho Ban Tổ chức",
    note: "Gửi vào hộp thư Ban Tổ chức mỗi khi có người đăng ký mới.",
    sendTo: "ban-to-chuc",
    subject: "[{{ten_form}}] Đăng ký mới — {{ho_ten}}",
    bodyHtml: baoBtcBody,
  },
];
