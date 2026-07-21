// defaultContent — nội dung mặc định, migrate 1 lần từ src/lib/site.ts,
// src/lib/gallery2025.ts và trang /2025 hiện tại. Dùng làm fallback an toàn:
// mọi bản đọc từ Redis đều merge-deep lên đây nên site không bao giờ "vỡ".
import {
  site,
  activities,
  timeline,
  gallery,
  faqs,
  fundraising,
  sponsorTiers,
  board,
  news as siteNews,
} from "@/lib/site";
import { gallery2025 } from "@/lib/gallery2025";
import {
  CONTENT_VERSION,
  type AmbassadorRole,
  type Photo,
  type SiteContent,
} from "./schema";
import {
  defaultEmailTemplates,
  TEMPLATE_BAO_BTC_ID,
  TEMPLATE_CAM_ON_ID,
} from "./email-templates";

/**
 * Bốn vai trò "Đại sứ" mặc định.
 *
 * Dùng ở hai chỗ: nội dung mặc định của form đăng ký (dưới đây) và bước nâng
 * cấp dữ liệu cũ trong store.ts. Admin sửa thoải mái trong mục "Form đăng ký".
 */
export const DEFAULT_ROLES: AmbassadorRole[] = [
  {
    icon: "🚌",
    title: "Đại sứ Hành trình",
    desc: "Trực tiếp mang yêu thương đến Langbiang (tự túc một phần kinh phí cho việc di chuyển và sinh hoạt).",
  },
  {
    icon: "🤝",
    title: "Đại sứ Kết nối",
    desc: "Trở thành hậu phương vững chắc, chung tay tổ chức và kết nối các nguồn lực trước khi chương trình diễn ra.",
  },
  {
    icon: "💝",
    title: "Đại sứ Đồng hành",
    desc: "Trao gửi sự sẻ chia từ xa, tiếp thêm sức mạnh cho các em nhỏ bằng hiện kim và những món quà thiết thực.",
  },
  {
    icon: "📣",
    title: "Đại sứ Truyền thông",
    desc: "Lan toả thông điệp và hình ảnh của dự án đến cộng đồng thông qua tiếng nói và sức ảnh hưởng cá nhân.",
  },
];

/** Nối các đoạn văn thành HTML an toàn (body: string[] -> bodyHtml). */
function paragraphsToHtml(paras: string[]): string {
  return paras.map((p) => `<p>${p}</p>`).join("");
}

/** Ảnh thư viện 2025 (as const, readonly) -> Photo[] có thể chỉnh sửa. */
const gallery2025Photos: Photo[] = gallery2025.map((g) => ({
  src: g.src,
  caption: g.caption,
  tall: g.tall,
}));

/**
 * Tổng kết mùa 2025 (rich text) — chuyển từ nội dung trang /2025 (Summary.tsx)
 * sang HTML để lưu trong store và render bằng CKEditor.
 */
const summary2025Html = paragraphsToHtml([
  "<strong>“Trăng Sáng LangBiang 2025”</strong> đã chính thức khép lại, để lại phía sau là một mùa Trung Thu ngập tràn tiếng cười, những cái ôm thật chặt và ánh mắt lấp lánh hạnh phúc của các em nhỏ nơi núi rừng LangBiang.",
  "Mỗi chiếc lồng đèn được thắp sáng, mỗi phần quà được trao tận tay, mỗi trò chơi, mỗi tiết mục văn nghệ hay từng bữa ăn sẻ chia đều là những mảnh ghép tạo nên một bức tranh đầy yêu thương.",
  "Ban Tổ chức xin gửi lời tri ân chân thành và sâu sắc nhất đến tất cả Quý Nhà tài trợ, Quý Đơn vị đồng hành và những cá nhân đã dành sự tin tưởng, sẻ chia để cùng chúng tôi mang yêu thương đến với các em nhỏ.",
  "Xin cảm ơn tất cả các anh chị tình nguyện viên đã dành thời gian, công sức và cả trái tim để chuẩn bị từng phần quà, dựng sân khấu, tổ chức các hoạt động và mang đến những nụ cười rạng rỡ cho các em nhỏ.",
  "Hẹn gặp lại trong những hành trình thiện nguyện tiếp theo, nơi yêu thương sẽ tiếp tục được trao đi và hy vọng sẽ tiếp tục được thắp sáng. 🌕💙",
]);

export const defaultContent: SiteContent = {
  version: CONTENT_VERSION,
  currentYear: 2026,

  main: {
    site: {
      name: site.name,
      shortName: site.shortName,
      tagline: site.tagline,
      subtitle: site.subtitle,
      description: site.description,
      facebook: site.facebook,
      email: site.email,
      shopee: site.shopee,
      keywords: [...site.keywords],
      ogImage: "/og.jpg",
      logo: "/logo-mark.png",
      // Chữ ở trang chủ độc lập với khẩu hiệu dùng cho SEO.
      heroTagline: site.tagline,
    },
    // Chỉ nhập phần ngày/tháng — năm do hệ thống tự nối theo currentYear
    // (không để người dùng phải giữ ký hiệu {năm} dễ xoá nhầm).
    // Các khoá không bắt buộc vẫn PHẢI có mặt ở đây, kể cả để chuỗi rỗng:
    // normalize() trộn nội dung theo đúng danh sách khoá của bản mặc định này,
    // khoá nào vắng mặt ở đây thì chữ admin nhập vào sẽ bị bỏ lúc đọc ra.
    event: {
      dateLabel: "Ngày 26 – 27 tháng 9",
      dateISO: site.dateISO,
      dateEndISO: "2026-09-27",
      countdownLabel: "",
      location: site.location,
      locationFooter: "",
      locationTimeline: "",
      locationProgram: "",
    },
    activities: activities.map((a) => ({ ...a })),
    timeline: timeline.map((d) => ({
      day: d.day,
      date: d.date,
      items: d.items.map((it) => ({ ...it })),
    })),
    gallery: gallery.map((g) => ({ ...g })),
    // 4 ảnh nổi ở Hero (bố cục bay lượn giữ trong code, chỉ ảnh là đổi được).
    heroPhotos: ["/gallery/g8.jpg", "/gallery/g4.jpg", "/gallery/g2.jpg", "/gallery/g6.jpg"],
    aboutImage: "/gallery/about.jpg",
    // Chữ mục "Giới thiệu" — giữ đúng nội dung đã hardcode trong About.tsx.
    about: {
      eyebrow: "Về dự án",
      title: "Mang ánh trăng ấm áp",
      titleHighlight: "đến với núi rừng",
      paragraphs: [
        "Trăng sáng Langbiang là dự án tình nguyện phi lợi nhuận, mang một mùa Trung thu trọn vẹn đến các em nhỏ vùng cao tại phường Langbiang – Đà Lạt, tỉnh Lâm Đồng.",
        "Năm trước, chúng mình đã cùng nhau thắp sáng những nụ cười trong đêm hội Trăng rằm. Năm nay, hành trình yêu thương ấy tiếp tục — với những phần quà, sân chơi và cả những ước mơ được chắp cánh.",
      ],
      badgeNote: "Trở lại Langbiang với thật nhiều yêu thương.",
      ctaPrimaryLabel: "Đăng ký đồng hành 🌙",
    },
    // Form hiện ở khối "Đăng ký" ngoài trang chủ (id phải có trong registerForms).
    activeRegisterFormId: "langbiang-2026",
    // Danh sách form đăng ký. Form đầu tiên giữ đúng nội dung đã hardcode trong
    // Register.tsx; mỗi form còn có đường dẫn chia sẻ riêng /dang-ky/<id>.
    registerForms: [
      {
        id: "langbiang-2026",
        name: "Langbiang 2026",
        eyebrow: "Tham gia cùng chúng mình",
        title: "Cùng thắp sáng",
        titleHighlight: "một mùa trăng yêu thương",
        description:
          "Dù bạn trực tiếp lên đường hay đồng hành từ xa, mỗi tấm lòng đều góp phần làm nên điều kỳ diệu cho các em nhỏ Langbiang.",
        roles: DEFAULT_ROLES,
        formTitle: "Đăng ký đồng hành",
        fields: [
          {
            name: "name",
            label: "Họ và tên",
            type: "text",
            placeholder: "Nguyễn Văn A",
            required: true,
          },
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "ban@email.com",
            required: true,
          },
          {
            name: "phone",
            label: "Số điện thoại",
            type: "tel",
            placeholder: "09xx xxx xxx",
            required: true,
          },
          { name: "dob", label: "Ngày sinh", type: "date", required: true },
          {
            name: "organization",
            label: "Đơn vị học tập / công tác",
            type: "text",
            placeholder: "Trường / công ty",
          },
          {
            name: "role",
            label: "Bạn muốn đồng hành với vai trò",
            type: "roles",
            required: true,
          },
          {
            name: "message",
            label: "Lời nhắn",
            type: "textarea",
            placeholder: "Chia sẻ mong muốn của bạn...",
          },
          {
            // Ảnh khách tự tải lên -> vào kho ảnh, album "Tình nguyện viên",
            // đặt tên theo tên người đăng ký.
            name: "photo",
            label: "Ảnh của bạn",
            type: "photo",
            placeholder: "Ảnh chân dung để Ban tổ chức dễ nhận ra bạn",
          },
        ],
        submitLabel: "Gửi đăng ký 🌙",
        successTitle: "Cảm ơn bạn rất nhiều!",
        successNote:
          "Ban tổ chức sẽ liên hệ với bạn trong thời gian sớm nhất qua email hoặc điện thoại.",
        successAgainLabel: "Gửi đăng ký khác",
        contactNote: "Hoặc liên hệ trực tiếp qua",
        contactLinkLabel: "Fanpage Facebook",
        // Hộp thư nhận thông báo đăng ký. Bỏ trống -> dùng tạm site.email.
        recipientEmail: "",
        // Hai mẫu email dùng cho form này (sửa lời văn ở mục "Mẫu email").
        confirmTemplateId: TEMPLATE_CAM_ON_ID,
        notifyTemplateId: TEMPLATE_BAO_BTC_ID,
      },
    ],
    faqs: faqs.map((f) => ({ ...f })),
    donateBand: {
      eyebrow: "Gian hàng gây quỹ",
      title: "Sở hữu kỷ vật, Trao gửi yêu thương 🎁",
      desc: "Toàn bộ lợi nhuận sẽ được chuyển thành những phần quà trao tận tay các em nhỏ tại Langbiang.",
      primaryLabel: "Ủng hộ qua Shopee",
      secondaryLabel: "Các hình thức đồng hành khác",
    },
    fundraising: {
      title: fundraising.title,
      desc: fundraising.desc,
      channels: fundraising.channels.map((c) => ({ ...c })),
    },
    // Nhà tài trợ của MÙA HIỆN TẠI — bắt đầu trống, admin tự thêm cho năm nay.
    // (Nhà tài trợ mùa 2025 thuộc về pastYears[2025], không dùng lại ở đây.)
    sponsorTiers: [],
    board: {
      founders: board.founders.map((m) => ({ ...m })),
      members: board.members.map((m) => ({ ...m })),
    },
    // Báo cáo chi tiêu: chỉ là link Google Sheet (admin dán vào), không dựng
    // bảng trên web. Bỏ trống -> phần này tự ẩn ở trang Gây quỹ.
    spendingReport: {
      url: "",
      note: "Toàn bộ khoản thu – chi mùa {năm} được cập nhật công khai trên Google Sheet.",
    },
    // Chữ ở chân trang — giữ đúng nội dung đã hardcode trong Footer.tsx.
    footer: {
      description:
        "Dự án tình nguyện mang Trung thu ấm áp đến các em nhỏ vùng cao Langbiang – Đà Lạt, Lâm Đồng.",
      facebookLabel: "Theo dõi Fanpage",
      exploreTitle: "Khám phá",
      contactTitle: "Liên hệ",
      copyrightNote: "Được tạo bằng tất cả yêu thương 💚",
      bottomNote: "Langbiang · Đà Lạt · Lâm Đồng",
    },
  },

  // FR4 — năm đã qua. pastYears[0] = mùa 2025 (từ /2025 + gallery2025).
  pastYears: [
    {
      year: 2025,
      title: "Nhìn lại mùa 2025",
      subtitle:
        "Mùa Trăng Sáng Langbiang đầu tiên — nơi những tấm lòng gặp nhau và viết nên một câu chuyện thật đẹp giữa cao nguyên.",
      eyebrow: "Hồi ức",
      bgImage: "/gallery/team.jpg",
      summaryHtml: summary2025Html,
      gallery: gallery2025Photos,
      sponsorTiers: sponsorTiers.map((t) => ({
        tier: t.tier,
        sponsors: t.sponsors.map((s) => ({ ...s })),
      })),
      // Link Google Sheet báo cáo thu – chi mùa 2025 (admin dán vào sau).
      spendingReport: {
        url: "",
        note: "Toàn bộ khoản thu – chi mùa {năm} được cập nhật công khai trên Google Sheet.",
      },
    },
  ],

  // Mẫu email gửi tự động khi có người đăng ký (admin sửa được lời văn).
  emailTemplates: defaultEmailTemplates.map((t) => ({ ...t })),
  // Tên hiện ở ô "người gửi" trong hộp thư người nhận.
  emailFromName: site.name,

  // Tin tức — chuyển body: string[] -> bodyHtml.
  news: siteNews.map((n) => ({
    id: n.id,
    img: n.img,
    tag: n.tag,
    title: n.title,
    excerpt: n.excerpt,
    bodyHtml: n.body ? paragraphsToHtml(n.body) : undefined,
    link: n.link,
  })),
};
