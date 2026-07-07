// URL gốc của site — ưu tiên biến môi trường, tự nhận domain khi deploy trên Vercel.
// Đặt NEXT_PUBLIC_SITE_URL = domain thật (vd https://trangsanglangbiang.com) để chắc chắn.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://langbiang-dalat.vercel.app");

export const site = {
  name: "Trăng Sáng Langbiang",
  shortName: "Trăng Sáng Langbiang",
  tagline: "Dự án tình nguyện",
  subtitle: "Tại phường Langbiang – Đà Lạt, tỉnh Lâm Đồng",
  dateLabel: "Ngày 19 – 20 tháng 9 năm 2026",
  dateISO: "2026-09-19",
  location: "Phường Langbiang, Đà Lạt, Lâm Đồng",
  url: siteUrl,
  description:
    "Trăng Sáng Langbiang là dự án tình nguyện mang Trung thu ấm áp, sân chơi và những phần quà yêu thương đến các em nhỏ vùng cao Langbiang – Đà Lạt, Lâm Đồng. Mùa 2026 diễn ra ngày 19–20/9. Đăng ký đồng hành cùng chúng mình!",
  facebook: "https://www.facebook.com/profile.php?id=61580211752903",
  email: "trangsanglangbiang@gmail.com",
  // TODO: thay bằng link gian hàng Shopee gây quỹ thật
  shopee: "https://shopee.vn/trangsanglangbiang",
  keywords: [
    "Trăng Sáng Langbiang",
    "tình nguyện Đà Lạt",
    "Trung thu vùng cao",
    "thiện nguyện Lâm Đồng",
    "Langbiang",
    "dự án tình nguyện 2026",
    "quyên góp Trung thu",
  ],
};

export const stats = [
  { value: 500, suffix: "+", label: "Em nhỏ nhận quà" },
  { value: 80, suffix: "", label: "Tình nguyện viên" },
  { value: 30, suffix: "+", label: "Nhà hảo tâm đồng hành" },
  { value: 2, suffix: " ngày", label: "Hành trình yêu thương" },
];

export const activities = [
  {
    icon: "🌕",
    title: "Đêm hội Trăng rằm",
    desc: "Rước đèn, phá cỗ, múa lân và những màn văn nghệ rực rỡ dưới ánh trăng Langbiang.",
  },
  {
    icon: "🎁",
    title: "Trao quà yêu thương",
    desc: "Những phần quà Trung thu, nhu yếu phẩm và học bổng gửi đến các em nhỏ vùng cao.",
  },
  {
    icon: "🎨",
    title: "Sân chơi sáng tạo",
    desc: "Gian hàng trò chơi dân gian, làm lồng đèn, tô tượng và vẽ tranh cùng các em.",
  },
  {
    icon: "📚",
    title: "Góc học tập",
    desc: "Tặng sách vở, dụng cụ học tập và khơi dậy ước mơ đến trường cho trẻ em bản làng.",
  },
  {
    icon: "🩺",
    title: "Chăm sóc sức khỏe",
    desc: "Khám bệnh, phát thuốc và hướng dẫn vệ sinh cho bà con và các em nhỏ.",
  },
  {
    icon: "🌱",
    title: "Xanh Langbiang",
    desc: "Dọn vệ sinh, trồng cây và lan tỏa ý thức bảo vệ thiên nhiên núi rừng cao nguyên.",
  },
];

export const timeline = [
  {
    day: "Ngày 1",
    date: "19/09/2026",
    items: [
      { time: "05:30", title: "Tập trung & khởi hành", desc: "Đoàn xuất phát từ TP.HCM hướng về cao nguyên Langbiang." },
      { time: "13:00", title: "Đến Langbiang", desc: "Nhận chỗ nghỉ, chuẩn bị hậu cần và trang trí sân khấu." },
      { time: "16:00", title: "Dựng gian hàng", desc: "Set-up sân chơi, khu trao quà và các tiểu cảnh check-in." },
      { time: "19:00", title: "Đêm hội Trăng rằm", desc: "Chương trình văn nghệ, rước đèn và phá cỗ cùng các em nhỏ." },
    ],
  },
  {
    day: "Ngày 2",
    date: "20/09/2026",
    items: [
      { time: "07:00", title: "Sân chơi buổi sáng", desc: "Trò chơi dân gian, làm lồng đèn và các hoạt động trải nghiệm." },
      { time: "09:30", title: "Trao quà & học bổng", desc: "Gửi tặng quà, nhu yếu phẩm và học bổng đến các em." },
      { time: "11:30", title: "Bữa cơm yêu thương", desc: "Cùng nhau chuẩn bị và sẻ chia bữa trưa ấm áp." },
      { time: "14:00", title: "Tổng kết & tạm biệt", desc: "Chụp ảnh lưu niệm, thu dọn và lên đường trở về." },
    ],
  },
];

export const gallery = [
  { src: "/gallery/g1.jpg", caption: "Khoảnh khắc Langbiang 2025", desc: "Chuyến đi mở đầu cho hành trình mang trăng sáng đến với trẻ em vùng cao.", tall: true },
  { src: "/gallery/g2.jpg", caption: "Nụ cười em thơ", desc: "Ánh mắt trong veo và nụ cười hồn nhiên là món quà quý nhất của mỗi chuyến đi.", tall: false },
  { src: "/gallery/g3.jpg", caption: "Trao quà Trung thu", desc: "Từng phần quà nhỏ gói ghém yêu thương gửi đến các em nhỏ dưới chân núi.", tall: false },
  { src: "/gallery/g4.jpg", caption: "Rước đèn dưới trăng", desc: "Đêm hội lung linh ánh đèn ông sao, rộn ràng tiếng cười giữa núi rừng.", tall: false },
  { src: "/gallery/g5.jpg", caption: "Sân chơi dân gian", desc: "Những trò chơi tuổi thơ gắn kết tình nguyện viên và các em nhỏ.", tall: true },
  { src: "/gallery/g6.jpg", caption: "Tình nguyện viên", desc: "Những trái tim trẻ tình nguyện, sẵn sàng sẻ chia trên mọi nẻo đường.", tall: false },
  { src: "/gallery/g7.jpg", caption: "Núi rừng Langbiang", desc: "Vẻ đẹp hùng vĩ của cao nguyên Đà Lạt – nơi hành trình bắt đầu.", tall: false },
  { src: "/gallery/g8.jpg", caption: "Đêm hội Trăng rằm", desc: "Ánh trăng rằm soi sáng đêm hội đoàn viên ấm áp nghĩa tình.", tall: false },
  { src: "/gallery/g9.jpg", caption: "Sẻ chia yêu thương", desc: "Mỗi cái ôm, mỗi bàn tay nắm chặt là một mảnh yêu thương được trao đi.", tall: true },
  { src: "/gallery/g10.jpg", caption: "Bên các em nhỏ", desc: "Cùng học, cùng chơi, cùng lớn lên trong vòng tay ấm áp của cộng đồng.", tall: false },
  { src: "/gallery/g11.jpg", caption: "Hành trình thiện nguyện", desc: "Băng rừng vượt suối, mang ánh sáng và niềm tin đến những bản làng xa.", tall: false },
  { src: "/gallery/g12.jpg", caption: "Khoảnh khắc chia tay", desc: "Tạm biệt trong lưu luyến, hẹn ngày trở lại với thật nhiều yêu thương.", tall: false },
];

export const faqs = [
  {
    q: "Ai có thể tham gia dự án?",
    a: "Tất cả các bạn từ 18 tuổi, có tinh thần thiện nguyện, sức khỏe tốt và sắp xếp được thời gian 19–20/9/2026 đều có thể đăng ký làm tình nguyện viên.",
  },
  {
    q: "Chi phí tham gia như thế nào?",
    a: "Tình nguyện viên đóng góp một khoản phí hậu cần (di chuyển, ăn ở). Chi tiết sẽ được gửi qua email sau khi bạn đăng ký thành công.",
  },
  {
    q: "Mình có thể đồng hành mà không đi trực tiếp không?",
    a: "Hoàn toàn được! Bạn có thể đồng hành bằng cách quyên góp quà, nhu yếu phẩm, kinh phí hoặc lan tỏa dự án đến cộng đồng.",
  },
  {
    q: "Làm sao để liên hệ với ban tổ chức?",
    a: "Bạn có thể nhắn tin trực tiếp qua Fanpage Facebook hoặc gửi email cho chúng mình. Đội ngũ sẽ phản hồi trong thời gian sớm nhất.",
  },
];

/* ------------------------------------------------------------------
   GÂY QUỸ (Shopee) — Lê Minh Vũ đề xuất đưa link gian hàng gây quỹ
   ------------------------------------------------------------------ */
export const fundraising = {
  title: "Gian hàng gây quỹ",
  desc: "Mỗi sản phẩm bạn mua tại gian hàng Shopee của dự án là một phần quà Trung thu gửi đến các em nhỏ Langbiang. Mua sắm cũng là sẻ chia!",
  channels: [
    {
      icon: "🛒",
      name: "Gian hàng Shopee",
      note: "Ủng hộ qua mua sắm sản phẩm gây quỹ",
      cta: "Ghé gian hàng",
      href: site.shopee,
      highlight: true,
    },
    {
      icon: "💳",
      name: "Chuyển khoản trực tiếp",
      note: "Vietcombank • 0123456789 • TRANG SANG LANGBIANG",
      cta: "Sao chép STK",
      href: "#",
      highlight: false,
    },
    {
      icon: "🎁",
      name: "Ủng hộ hiện vật",
      note: "Quà Trung thu, sách vở, nhu yếu phẩm...",
      cta: "Liên hệ Fanpage",
      href: site.facebook,
      highlight: false,
    },
  ],
};

/* ------------------------------------------------------------------
   DANH SÁCH TÌNH NGUYỆN VIÊN 2025 (placeholder — thay tên thật sau)
   ------------------------------------------------------------------ */
export const volunteerTeams = [
  {
    name: "Ban Tổ chức",
    members: ["Phan Ngọc Cường", "Lê Minh Vũ", "Nguyễn Thị Mai", "Trần Quốc Bảo"],
  },
  {
    name: "Ban Chương trình",
    members: ["Đỗ Hoàng Long", "Vũ Thảo Nhi", "Phạm Gia Hân", "Ngô Minh Khôi", "Lý Tuyết Vân"],
  },
  {
    name: "Ban Hậu cần",
    members: ["Bùi Thanh Tùng", "Hoàng Yến Nhi", "Đặng Văn Phú", "Cao Mỹ Linh", "Tạ Đức Anh"],
  },
  {
    name: "Ban Truyền thông",
    members: ["Nguyễn Hải Đăng", "Trịnh Khánh Ly", "Lê Bảo Trâm", "Võ Thành Đạt"],
  },
  {
    name: "Ban Vận động tài trợ",
    members: ["Phan Thị Kim Ngân", "Dương Quốc Huy", "Hồ Ngọc Diệp", "Đinh Tiến Dũng"],
  },
];

// tổng số TNV hiển thị (đồng bộ với stats)
export const volunteerCount = 80;

/* ------------------------------------------------------------------
   ĐƠN VỊ TÀI TRỢ & ĐỒNG HÀNH 2025 (placeholder)
   TODO: thay logo thật (đặt file trong /public/sponsors/), link & giới thiệu
   ------------------------------------------------------------------ */
export type Sponsor = {
  name: string;
  logo?: string; // đường dẫn logo thật, vd "/sponsors/abc.png". Bỏ trống -> hiện chữ viết tắt
  url?: string; // website đơn vị
  intro?: string; // lời giới thiệu ngắn (hiện khi bấm vào logo)
};

export const sponsorTiers: { tier: string; sponsors: Sponsor[] }[] = [
  {
    tier: "Nhà tài trợ & đơn vị đồng hành",
    sponsors: [
      {
        name: "WESET",
        intro: "Trung tâm Anh ngữ WESET — đơn vị tài trợ đồng hành cùng Trăng Sáng Langbiang.",
      },
      {
        name: "Phở Huỳnh Trâm",
        intro: "Phở Huỳnh Trâm hỗ trợ những bữa ăn ấm lòng cho đoàn tình nguyện.",
      },
      {
        name: "Sun Taxi Group",
        intro: "Sun Taxi Group hỗ trợ di chuyển, đưa đón đoàn trong suốt hành trình.",
      },
      {
        name: "Bệnh viện Đa khoa Tâm Phúc",
        intro: "Bệnh viện Đa khoa Tâm Phúc (Tam Phuc Hospital) đồng hành, chăm sóc y tế cho chương trình.",
      },
    ],
  },
];

/* ------------------------------------------------------------------
   TIN TỨC / BẢN TIN — content dạng bài đăng trên Fanpage
   ------------------------------------------------------------------ */
export const news = [
  {
    img: "/gallery/g2.jpg",
    date: "22/09/2025",
    tag: "Tổng kết",
    title: "Trọn vẹn mùa trăng đầu tiên tại Langbiang 💚",
    excerpt:
      "Hai ngày một đêm với hơn 500 phần quà, 80 tình nguyện viên và vô vàn nụ cười. Cảm ơn tất cả những tấm lòng đã cùng chúng mình thắp sáng Trung thu vùng cao!",
  },
  {
    img: "/gallery/g5.jpg",
    date: "15/09/2025",
    tag: "Hành trình",
    title: "Đêm hội Trăng rằm rực rỡ dưới chân núi",
    excerpt:
      "Rước đèn, phá cỗ, múa lân... các em nhỏ Langbiang đã có một đêm Trung thu thật đáng nhớ. Cùng nhìn lại những khoảnh khắc lung linh nhất nhé!",
  },
  {
    img: "/gallery/g8.jpg",
    date: "01/09/2025",
    tag: "Kêu gọi",
    title: "Chung tay góp một mùa Trung thu cho em",
    excerpt:
      "Chỉ còn ít ngày nữa là đến hành trình. Mỗi chiếc lồng đèn, mỗi quyển vở đều là món quà ý nghĩa. Cùng đồng hành với Trăng Sáng Langbiang bạn nhé!",
  },
];

/* ------------------------------------------------------------------
   TẠI SAO NÊN THAM GIA — lý do đồng hành
   ------------------------------------------------------------------ */
export const whyJoin = [
  {
    icon: "🤝",
    title: "Kết nối những trái tim",
    desc: "Gặp gỡ, đồng hành cùng những người trẻ giàu nhiệt huyết và tấm lòng thiện nguyện.",
  },
  {
    icon: "🌱",
    title: "Trưởng thành & sẻ chia",
    desc: "Rèn kỹ năng tổ chức, làm việc nhóm và lan toả giá trị tốt đẹp đến cộng đồng.",
  },
  {
    icon: "💚",
    title: "Minh bạch & tin cậy",
    desc: "Mọi đóng góp đều được công khai, sử dụng đúng mục đích và báo cáo sau mỗi mùa.",
  },
];

/* ------------------------------------------------------------------
   BAN SÁNG LẬP & BAN TỔ CHỨC (placeholder — thay ảnh + tiểu sử thật)
   TODO: ảnh thật đặt trong /public/team/ (vd /team/cuong.jpg)
   ------------------------------------------------------------------ */
export type Member = {
  name: string;
  role: string;
  photo?: string; // ảnh thật; bỏ trống -> hiện avatar chữ cái
  bio: string;
};

export const board: { founders: Member[]; organizers: Member[] } = {
  // TODO: cập nhật ảnh (/public/team/) + tiểu sử thật cho từng thành viên
  founders: [
    {
      name: "Lê Minh Vũ",
      role: "Trưởng ban sáng lập",
      photo: "/team/le-minh-vu.jpg",
      bio: "Người dẫn dắt Trăng Sáng Langbiang — định hướng dự án và kết nối nguồn lực để mang một mùa Trung thu trọn vẹn đến trẻ em vùng cao.",
    },
    {
      name: "Phạm Minh Phát",
      role: "Đồng sáng lập",
      photo: "/team/pham-minh-phat.jpg",
      bio: "Đồng hành xây dựng Trăng Sáng Langbiang từ những ngày đầu tiên.",
    },
    {
      name: "Nguyễn Anh Hào",
      role: "Đồng sáng lập",
      photo: "/team/nguyen-anh-hao.jpg",
      bio: "Đồng hành xây dựng Trăng Sáng Langbiang từ những ngày đầu tiên.",
    },
  ],
  organizers: [
    {
      name: "Nguyễn Thị Mai",
      role: "Trưởng ban Chương trình",
      photo: "",
      bio: "Chịu trách nhiệm nội dung, kịch bản đêm hội và các hoạt động cho các em nhỏ.",
    },
    {
      name: "Trần Quốc Bảo",
      role: "Trưởng ban Hậu cần",
      photo: "",
      bio: "Lo hậu cần, di chuyển và an toàn cho toàn đoàn trong suốt hành trình.",
    },
    {
      name: "Đỗ Hoàng Long",
      role: "Trưởng ban Truyền thông",
      photo: "",
      bio: "Phụ trách hình ảnh, bản tin và lan toả câu chuyện của dự án đến cộng đồng.",
    },
    {
      name: "Phạm Gia Hân",
      role: "Trưởng ban Vận động tài trợ",
      photo: "",
      bio: "Kết nối các nhà hảo tâm, đơn vị đồng hành để gây quỹ cho mùa trăng.",
    },
  ],
};

/* ------------------------------------------------------------------
   DANH SÁCH ĐÓNG GÓP (placeholder — cập nhật thật sau mỗi đợt)
   ------------------------------------------------------------------ */
export type Donation = {
  name: string;
  amount?: string; // vd "2.000.000đ" — để trống nếu là hiện vật
  gift?: string; // hiện vật, vd "50 phần quà"
  date: string;
};

export const donations: Donation[] = [
  { name: "Anh Nguyễn Văn A", amount: "5.000.000đ", date: "20/09/2025" },
  { name: "Chị Trần Thị B", amount: "2.000.000đ", date: "18/09/2025" },
  { name: "Gia đình cô C", gift: "80 phần quà Trung thu", date: "15/09/2025" },
  { name: "CLB Thiện Nguyện Trẻ", amount: "3.500.000đ", date: "12/09/2025" },
  { name: "Bạn ẩn danh", amount: "1.000.000đ", date: "10/09/2025" },
  { name: "Nhà sách Ánh Sáng", gift: "200 quyển vở, bút", date: "08/09/2025" },
];

/* ------------------------------------------------------------------
   CẢM NHẬN TÌNH NGUYỆN VIÊN (placeholder)
   ------------------------------------------------------------------ */
export type Testimonial = {
  name: string;
  role: string;
  avatar?: string;
  quote: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Thảo Nhi",
    role: "TNV Ban Chương trình 2025",
    avatar: "",
    quote:
      "Nhìn nụ cười của các em khi nhận lồng đèn, mình biết mọi vất vả đều xứng đáng. Một mùa trăng mình sẽ nhớ mãi.",
  },
  {
    name: "Minh Khôi",
    role: "TNV Hậu cần 2025",
    avatar: "",
    quote:
      "Lần đầu đi thiện nguyện xa nhà, mình học được cách sẻ chia và trân trọng những điều nhỏ bé. Cảm ơn Langbiang!",
  },
  {
    name: "Yến Nhi",
    role: "TNV Truyền thông 2025",
    avatar: "",
    quote:
      "Được ghi lại từng khoảnh khắc của hành trình là một may mắn. Ai cũng ấm áp và hết mình vì các em.",
  },
];

/* ------------------------------------------------------------------
   BÁO CÁO CHI (placeholder — thay số liệu thực tế sau mỗi mùa)
   ------------------------------------------------------------------ */
export type SpendingItem = {
  icon: string;
  item: string;
  amount: string;
  note?: string;
};

export const spendingReport: { items: SpendingItem[]; total: string; updatedNote: string } = {
  items: [
    { icon: "🎁", item: "Quà & nhu yếu phẩm cho các em", amount: "45.000.000đ", note: "500+ phần quà" },
    { icon: "🏮", item: "Đêm hội & sân chơi Trung thu", amount: "25.000.000đ", note: "Sân khấu, lồng đèn, trò chơi" },
    { icon: "📚", item: "Sách vở, học bổng, dụng cụ học tập", amount: "20.000.000đ" },
    { icon: "🚌", item: "Hậu cần & di chuyển đoàn", amount: "10.000.000đ" },
  ],
  total: "100.000.000đ",
  updatedNote: "Số liệu mang tính minh hoạ — sẽ cập nhật báo cáo thực tế sau mùa 2026.",
};
