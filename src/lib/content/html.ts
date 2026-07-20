// Làm sạch HTML (rich text từ CKEditor) trước khi render bằng dangerouslySetInnerHTML.
// Nội dung do admin nhập nhưng vẫn phải sanitize để chống XSS (kỹ thuật, mục 6).
import sanitizeHtmlLib from "sanitize-html";

/** Cấu hình: giữ các thẻ định dạng cơ bản + ảnh + bảng; bỏ script/style/iframe. */
const options: sanitizeHtmlLib.IOptions = {
  allowedTags: [
    "p", "br", "hr", "strong", "b", "em", "i", "u", "s", "sub", "sup",
    "blockquote", "code", "pre",
    "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li",
    "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tfoot", "tr", "th", "td",
    "span", "div",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    "*": ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["http", "https", "data"] },
  // Link ra ngoài luôn an toàn khi mở tab mới.
  transformTags: {
    a: sanitizeHtmlLib.simpleTransform("a", { rel: "noopener noreferrer" }, true),
  },
};

/** Trả về HTML an toàn để nhúng vào trang. */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return sanitizeHtmlLib(html, options);
}
