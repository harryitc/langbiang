// Mô hình dữ liệu cho Content Store (Admin CMS).
// Website là khung mẫu; toàn bộ nội dung đọc từ store này.
// Tái sử dụng các type sẵn có trong src/lib/site.ts để đồng bộ với dữ liệu mặc định.
import type { Sponsor, Member } from "@/lib/site";
import type { EmailTemplate } from "./email-templates";

export type { Sponsor, Member };
export type { EmailTemplate };

/* ------------------------------------------------------------------
   Các kiểu con dùng chung
   ------------------------------------------------------------------ */

/** Ảnh trong thư viện (gallery) — dùng cho trang chính và trang "Nhìn lại". */
export type Photo = {
  src: string;
  caption?: string;
  desc?: string;
  /** Ảnh cao (chiếm 2 hàng trong lưới masonry). */
  tall?: boolean;
};

/** Một thẻ có biểu tượng (activities). */
export type IconCard = {
  icon: string;
  title: string;
  desc: string;
};

/** Một mốc trong ngày của lịch trình. */
export type TimelineItem = {
  time: string;
  title: string;
  desc: string;
};

/** Một ngày trong lịch trình, gồm nhiều mốc. */
export type TimelineDay = {
  day: string;
  date: string;
  items: TimelineItem[];
};

/** Câu hỏi thường gặp. */
export type Faq = {
  q: string;
  a: string;
};

/** Một kênh gây quỹ. */
export type FundraisingChannel = {
  icon: string;
  name: string;
  note: string;
  cta: string;
  href: string;
  highlight: boolean;
};

/** Khối gây quỹ (đơn + danh sách kênh). */
export type Fundraising = {
  title: string;
  desc: string;
  channels: FundraisingChannel[];
};

/**
 * Dải "Gian hàng quyên góp" màu cam ở trang chủ.
 *
 * Đường dẫn của hai nút KHÔNG nằm ở đây: nút chính luôn trỏ tới gian hàng
 * Shopee (`site.shopee`, sửa ở mục Thương hiệu & SEO), nút phụ luôn trỏ tới
 * trang Gây quỹ của chính website. Ở đây chỉ đổi chữ.
 */
export type DonateBand = {
  /** Nhãn nhỏ trong ô bo tròn, phía trên tiêu đề. */
  eyebrow: string;
  title: string;
  desc: string;
  /** Chữ trên nút trắng (dẫn sang gian hàng Shopee). */
  primaryLabel: string;
  /** Chữ trên nút viền (dẫn sang trang Gây quỹ). */
  secondaryLabel: string;
};

/** Một hạng tài trợ + các đơn vị trong hạng. */
export type SponsorTier = {
  tier: string;
  sponsors: Sponsor[];
};

/** Ban tổ chức (sáng lập + thành viên). */
export type Board = {
  founders: Member[];
  members: Member[];
};

/**
 * Báo cáo chi tiêu — không trình bày bảng trên web nữa, chỉ trỏ sang
 * Google Sheet cho tiện cập nhật. Bỏ trống `url` thì phần này tự ẩn.
 */
export type SpendingReport = {
  /** Link Google Sheet báo cáo chi tiêu. */
  url: string;
  /** Ghi chú ngắn hiển thị cạnh nút (tuỳ chọn). Hỗ trợ ký hiệu {năm}. */
  note?: string;
};

/** Thông tin thương hiệu + liên hệ + SEO/OG. */
export type SiteMeta = {
  name: string;
  shortName: string;
  tagline: string;
  subtitle: string;
  description: string;
  facebook: string;
  email: string;
  shopee: string;
  keywords: string[];
  ogImage?: string;
  /** Logo hiển thị ở thanh menu (dùng chung toàn site). */
  logo?: string;
  /**
   * Dòng chữ nhỏ phía TRÊN tiêu đề lớn ở trang chủ.
   * Bỏ trống -> dùng khẩu hiệu (tagline) để không phải nhập lặp.
   */
  heroTagline?: string;
};

/** Thông tin sự kiện (năm nằm trong dateLabel qua ký hiệu {năm}). */
export type EventInfo = {
  dateLabel: string;
  dateISO: string;
  dateEndISO?: string;
  /**
   * Dòng chữ nhỏ phía trên đồng hồ đếm ngược ở trang chủ.
   * Bỏ trống -> dùng câu mặc định (COUNTDOWN_LABEL_MAC_DINH).
   */
  countdownLabel?: string;
  /** Địa điểm chính — dùng cho dữ liệu gửi Google và làm mặc định cho các nơi khác. */
  location: string;
  /** Ghi đè riêng cho chân trang (bỏ trống -> dùng địa điểm chính). */
  locationFooter?: string;
  /** Ghi đè riêng cho mục Lịch trình. */
  locationTimeline?: string;
  /** Ghi đè riêng cho trang Chương trình. */
  locationProgram?: string;
};

/**
 * Câu mặc định trên đồng hồ đếm ngược, dùng khi admin để trống
 * `EventInfo.countdownLabel`. Để ở đây (không nằm cứng trong Hero) để cả trang
 * chủ lẫn ô nhập trong admin cùng lấy một chỗ, không lệch nhau.
 */
export const COUNTDOWN_LABEL_MAC_DINH = "Đếm ngược ngày khởi hành";

/** Mục "Giới thiệu" ở trang chủ (chữ; ảnh nằm ở main.aboutImage). */
export type AboutSection = {
  /** Nhãn nhỏ phía trên tiêu đề. */
  eyebrow: string;
  /** Nửa đầu tiêu đề (chữ thường). */
  title: string;
  /** Nửa sau tiêu đề — được tô màu gradient xanh. */
  titleHighlight: string;
  /** Các đoạn văn giới thiệu, hiển thị theo đúng thứ tự. */
  paragraphs: string[];
  /** Dòng đậm trong ô kính trên ảnh. Bỏ trống thì tự tính "Mùa N · năm". */
  badgeTitle?: string;
  /** Dòng nhỏ trong ô kính trên ảnh, nằm dưới dòng đậm. */
  badgeNote: string;
  /** Chữ trên nút chính (luôn trỏ xuống khối Đăng ký). */
  ctaPrimaryLabel: string;
};

/**
 * Một vai trò "Đại sứ" mà khách có thể chọn khi đăng ký.
 *
 * NGUỒN DUY NHẤT: danh sách này vừa là những thẻ giới thiệu hiện ở khối Đăng
 * ký, vừa là các lựa chọn của ô nhập kiểu "roles". Trước đây hai thứ đó là hai
 * danh sách rời nhau nên chỉnh một bên là lệch — nay gộp làm một.
 */
export type AmbassadorRole = {
  icon: string;
  title: string;
  desc: string;
};

/** Kiểu ô nhập của một trường trong form đăng ký. */
export type RegisterFieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "textarea"
  | "select"
  /**
   * Ô chọn VAI TRÒ ĐẠI SỨ — hiện thành lưới thẻ giống ngoài trang chủ, khách
   * tích được NHIỀU vai trò cùng lúc. Không có `options` riêng: lựa chọn lấy
   * thẳng từ `RegisterSection.roles` nên không bao giờ lệch với thẻ hiển thị.
   */
  | "roles"
  /** Ô để khách tự chọn ảnh từ máy và tải lên (ảnh tình nguyện viên). */
  | "photo";

/** Một trường của form đăng ký. */
export type RegisterField = {
  /** Mã trường (name của ô nhập) — không hiển thị cho khách. */
  name: string;
  label: string;
  type: RegisterFieldType;
  placeholder?: string;
  required?: boolean;
  /**
   * Danh sách lựa chọn — CHỈ dùng khi type = "select".
   * Ô kiểu "roles" không dùng khoá này; nó đọc `RegisterSection.roles`.
   */
  options?: string[];
};

/** Nhiều vai trò được lưu chung trong một ô, ngăn nhau bằng dấu này. */
export const ROLE_SEPARATOR = ", ";

/** Tách chuỗi vai trò đã lưu thành danh sách tên. */
export function parseRoles(value: string | undefined): string[] {
  return (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Khối "Đăng ký" ở trang chủ. */
export type RegisterSection = {
  eyebrow: string;
  title: string;
  /** Dòng thứ hai của tiêu đề — in bằng phông chữ viết tay, cỡ lớn hơn. */
  titleHighlight: string;
  description: string;
  /**
   * Các vai trò Đại sứ — vừa hiện thành thẻ giới thiệu, vừa là lựa chọn của ô
   * nhập kiểu "roles". Sửa ở đây là đổi cả hai nơi.
   */
  roles: AmbassadorRole[];
  /** Tiêu đề phía trên form. */
  formTitle: string;
  fields: RegisterField[];
  submitLabel: string;
  /** Màn cảm ơn sau khi gửi. */
  successTitle: string;
  successNote: string;
  successAgainLabel: string;
  /** Dòng cuối form: chữ dẫn + nhãn liên kết (đích lấy từ site.facebook). */
  contactNote: string;
  contactLinkLabel: string;
  /**
   * Email NHẬN thông báo mỗi khi có người đăng ký (hộp thư của Ban tổ chức).
   * Khác hẳn `site.email` — cái kia là email công khai in trên website cho
   * khách liên hệ. Bỏ trống thì hệ thống gửi tạm về `site.email`.
   */
  recipientEmail?: string;
};

/**
 * Một FORM đăng ký hoàn chỉnh. Website có thể có nhiều form song song (mỗi đợt
 * tuyển một form), mỗi form có đường dẫn riêng để chia sẻ: `/dang-ky/<id>`.
 * Trang chủ hiển thị đúng MỘT form — form có id trùng `activeRegisterFormId`.
 */
export type RegisterForm = RegisterSection & {
  /** Slug dùng cho đường dẫn `/dang-ky/<id>` — chữ thường, số, gạch ngang; duy nhất. */
  id: string;
  /** Tên gọi nội bộ để admin nhận ra form, vd "Langbiang 2026". */
  name: string;
  /**
   * Mẫu email CẢM ƠN gửi cho người vừa đăng ký (id trong `emailTemplates`).
   *
   * Ba trạng thái KHÁC NHAU, đừng gộp:
   *  - chuỗi rỗng "" : admin CỐ Ý chọn "Không gửi" -> tôn trọng, không gửi.
   *  - undefined     : form có từ trước khi có tính năng mẫu email -> lúc đọc
   *                    được bù mẫu mặc định (xem migrateEmailTemplates).
   *  - id có thật    : dùng mẫu đó.
   */
  confirmTemplateId?: string;
  /**
   * Mẫu email BÁO TIN gửi về hộp thư Ban tổ chức (`recipientEmail`).
   * Ba trạng thái giống `confirmTemplateId`. Không gửi thì đăng ký vẫn lưu và
   * xem được trong khu quản trị.
   */
  notifyTemplateId?: string;
};

/** Định dạng hợp lệ của slug form (đường dẫn chia sẻ). */
export const REGISTER_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Đổi một chuỗi tiếng Việt bất kỳ thành slug gợi ý cho đường dẫn form. */
export function toRegisterSlug(raw: string): string {
  return raw
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Form đang hiển thị ở trang chủ. Id đã lưu mà không còn form nào khớp (form bị
 * xoá/đổi slug) thì lùi về form đầu tiên để trang chủ không bao giờ trống.
 */
export function activeRegisterForm(
  forms: RegisterForm[],
  activeId: string
): RegisterForm | undefined {
  return forms.find((f) => f.id === activeId) ?? forms[0];
}

/* ------------------------------------------------------------------
   Một lượt đăng ký khách gửi từ form ở trang chủ
   ------------------------------------------------------------------ */
export type Registration = {
  /** Thời điểm gửi, dạng ISO. */
  at: string;
  /** Dữ liệu khách điền: mã trường -> nội dung. */
  values: Record<string, string>;
  /** Nhãn của từng trường tại thời điểm gửi (để về sau vẫn đọc hiểu được). */
  labels: Record<string, string>;
};

/**
 * Khoá Redis chứa danh sách đăng ký của MỘT form (list, mới nhất ở đầu).
 * Mỗi form một khoá riêng nên đơn của đợt này không lẫn sang đợt khác.
 */
export const registrationsKey = (formId: string) => `registrations:${formId}`;
/** Chỉ giữ lại chừng này bản ghi gần nhất (cho mỗi form). */
export const REGISTRATIONS_LIMIT = 500;

/** Bài tin tức (nội dung dài lưu ở dạng HTML an toàn — CKEditor). */
export type NewsPost = {
  id: string;
  img: string;
  tag: string;
  title: string;
  excerpt: string;
  bodyHtml?: string;
  link: string;
  date?: string;
};

/**
 * Chân trang — hiện ở CUỐI MỌI TRANG.
 *
 * Chỉ gồm phần chữ. Danh sách liên kết "Khám phá" và các dòng địa điểm / ngày /
 * email cố ý KHÔNG nằm ở đây: chúng sinh ra từ các trang đang có và từ mục
 * "Sự kiện" cùng "Thương hiệu", nên sửa một chỗ là cả website đổi theo.
 */
export type FooterContent = {
  /** Đoạn giới thiệu ngắn dưới tên dự án. */
  description: string;
  /** Chữ trên nút dẫn sang Fanpage (địa chỉ lấy ở mục Thương hiệu). */
  facebookLabel: string;
  /** Tiêu đề cột liên kết. */
  exploreTitle: string;
  /** Tiêu đề cột thông tin liên hệ. */
  contactTitle: string;
  /** Câu đứng sau dòng bản quyền "© {năm} {tên dự án}." */
  copyrightNote: string;
  /** Dòng nhỏ nằm bên phải cùng hàng với bản quyền. */
  bottomNote: string;
};

/* ------------------------------------------------------------------
   Nội dung trang chính (một bộ duy nhất)
   ------------------------------------------------------------------ */
export type MainContent = {
  site: SiteMeta;
  event: EventInfo;
  activities: IconCard[];
  timeline: TimelineDay[];
  gallery: Photo[];
  /** 4 ảnh polaroid bay quanh màn hình đầu trang (Hero) — chỉ đổi ảnh, bố cục giữ trong code. */
  heroPhotos: string[];
  /** Ảnh lớn của mục "Giới thiệu" ở trang chủ. */
  aboutImage: string;
  /** Chữ của mục "Giới thiệu" ở trang chủ. */
  about: AboutSection;
  /**
   * Tất cả form đăng ký. Mỗi form có đường dẫn chia sẻ riêng `/dang-ky/<id>`;
   * trang chủ chỉ hiện form được chọn ở `activeRegisterFormId`.
   */
  registerForms: RegisterForm[];
  /** Id của form đang hiển thị ở khối "Đăng ký" ngoài trang chủ. */
  activeRegisterFormId: string;
  faqs: Faq[];
  /** Chữ trên dải "Gian hàng quyên góp" ở trang chủ. */
  donateBand: DonateBand;
  fundraising: Fundraising;
  sponsorTiers: SponsorTier[];
  board: Board;
  spendingReport: SpendingReport;
  footer: FooterContent;
};

/* ------------------------------------------------------------------
   Một trang "Nhìn lại" (năm đã qua) — 3 phần
   ------------------------------------------------------------------ */
export type PastYear = {
  /** Năm — duy nhất, là đường dẫn /{year}. */
  year: number;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  bgImage?: string;
  /** Tổng kết — rich text (CKEditor). */
  summaryHtml: string;
  gallery: Photo[];
  sponsorTiers: SponsorTier[];
  /** Báo cáo thu – chi của mùa đó (link Google Sheet). Bỏ trống thì ẩn. */
  spendingReport?: SpendingReport;
};

/* ------------------------------------------------------------------
   Toàn bộ nội dung site
   ------------------------------------------------------------------ */
export type SiteContent = {
  version: number;
  /** FR3 — số năm hiện tại, đồng bộ khắp giao diện. */
  currentYear: number;
  main: MainContent;
  /** FR4 — danh mục năm đã qua (độc lập). */
  pastYears: PastYear[];
  /** Dòng tin tức, mới nhất trước. */
  news: NewsPost[];
  /**
   * Kho mẫu email dùng chung cho mọi form đăng ký. Mỗi form trỏ tới mẫu nào
   * là việc của form (`confirmTemplateId` / `notifyTemplateId`), nên sửa lời
   * văn một lần là mọi form đang dùng mẫu đó đổi theo.
   */
  emailTemplates: EmailTemplate[];
  /**
   * TÊN người gửi hiện trong hộp thư người nhận, vd "Trăng Sáng Langbiang".
   * Địa chỉ gửi thì lấy từ cấu hình máy chủ (GMAIL_USER) — người dùng không
   * sửa được, vì đổi địa chỉ là phải đổi cả mật khẩu ứng dụng.
   * Bỏ trống -> dùng tên chương trình.
   */
  emailFromName: string;
};

/**
 * Số ảnh tối đa được chiếu trên slideshow trang chủ (BannerSlider).
 * Dùng chung cho cả component hiển thị lẫn editor để hai bên không lệch nhau.
 */
export const SLIDESHOW_LIMIT = 6;

/* ------------------------------------------------------------------
   Hằng số store
   ------------------------------------------------------------------ */
// v2: spendingReport đổi từ bảng {items,total,updatedNote} sang link Google Sheet
// {url,note}; main.sponsorTiers mặc định để trống (tách khỏi dữ liệu mùa 2025).
// v3: bỏ hẳn stats, volunteerTeams/volunteerCount, donations, testimonials
// (cả ở main lẫn pastYears). Phần con người chỉ còn Ban tổ chức (main.board).
// v4: mỗi năm đã qua có báo cáo thu – chi riêng (PastYear.spendingReport).
// v5: logo, ảnh Hero và ảnh mục Giới thiệu quản lý được từ admin.
// v6: bỏ whyJoin (không trang nào render).
// v7: địa điểm tách riêng cho từng nơi hiển thị (chân trang / lịch trình /
// trang Chương trình), bỏ trống thì dùng địa điểm chính.
// v8: tách chữ ở trang chủ khỏi phần SEO (site.heroTagline).
// v9: chữ mục Giới thiệu (main.about) và khối Đăng ký (main.register) quản lý
// được từ admin — form đăng ký nay render động theo main.register.fields;
// bỏ nút phụ "Vì sao nên tham gia?" ở mục Giới thiệu (trỏ tới khối đã xoá).
// v10: form đăng ký ở trang chủ gửi thật — mỗi lượt đăng ký được lưu vào Redis
// và gửi email báo về hộp thư riêng của Ban tổ chức (main.register
// .recipientEmail, khác email công khai site.email); xem lại các lượt đăng ký ở
// mục "Đăng ký nhận được" trong khu quản trị.
// v11: nhiều form đăng ký song song — main.register (một form duy nhất) đổi
// thành main.registerForms[] + main.activeRegisterFormId (form hiện ở trang
// chủ). Mỗi form có đường dẫn chia sẻ riêng /dang-ky/<id> và một danh sách đăng
// ký riêng trong Redis (registrations:<id>). Thêm kiểu ô nhập "photo" để khách
// tự tải ảnh lên; ảnh đó tự vào kho ảnh, album "Tình nguyện viên".
// v12: mẫu email soạn được từ admin (emailTemplates). Mỗi form đăng ký chọn
// mẫu cảm ơn gửi người đăng ký (confirmTemplateId) và mẫu báo tin gửi Ban tổ
// chức (notifyTemplateId); nội dung email không còn nằm cứng trong code.
// v13: tên người gửi email (emailFromName) sửa được từ admin thay vì nằm cứng
// trong biến môi trường.
// v14: chữ ở chân trang (main.footer) sửa được từ admin — đoạn giới thiệu, chữ
// trên nút Fanpage, hai tiêu đề cột và hai dòng cuối trang.
// v15: vai trò Đại sứ gộp về MỘT nguồn duy nhất. Trước đây thẻ giới thiệu
// (register.highlights) và các lựa chọn của ô "vai trò" (field.options) là hai
// danh sách rời nhau nên luôn lệch; nay chung `registerForms[].roles`. Thêm kiểu
// ô nhập "roles": hiện đúng lưới thẻ như ngoài trang chủ và cho khách tích
// NHIỀU vai trò (lưu chung một ô, ngăn nhau bằng ", ").
// v16: chữ trên đồng hồ đếm ngược sửa được từ admin (main.event.countdownLabel).
// Nhân tiện bù ba khoá địa điểm ghi riêng (locationFooter/Timeline/Program) vào
// bản mặc định — chúng vốn thiếu ở đó nên normalize() sẽ bỏ mất chữ admin nhập,
// lỗi chưa lộ ra chỉ vì chưa ai điền ba ô ấy.
// v17: chữ trên dải "Gian hàng quyên góp" ở trang chủ (main.donateBand) sửa
// được từ admin thay vì nằm cứng trong DonateBand.tsx.
// v18: đổi lời văn mặc định của dải "Gian hàng quyên góp" -> "Gian hàng gây
// quỹ". Chỉ đổi CHỮ chứ không đổi cấu trúc, nhưng vẫn phải bump: khoá của
// unstable_cache có kèm số này, không đổi thì bản đã nhớ vẫn được dùng và
// khách còn thấy chữ cũ (Data Cache trên Vercel sống qua cả lần triển khai mới).
export const CONTENT_VERSION = 18;
/** Tag cho unstable_cache/revalidateTag. */
export const CONTENT_TAG = "content";
/** Khoá Redis cho bản đã xuất bản (khách xem). */
export const PUBLISHED_KEY = "content:published";
/** Khoá Redis cho bản nháp (admin sửa). */
export const DRAFT_KEY = "content:draft";
