// URL gốc của site — ưu tiên biến môi trường, tự nhận domain khi deploy trên Vercel.
// Đặt NEXT_PUBLIC_SITE_URL = domain thật (vd https://trangsanglangbiang.com) để chắc chắn.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://trangsanglangbiang.vn");

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
  { src: "/gallery/g1.jpg", caption: "Khoảnh khắc Langbiang 2025", tall: true },
  { src: "/gallery/g2.jpg", caption: "Nụ cười em thơ", tall: false },
  { src: "/gallery/g3.jpg", caption: "Trao quà Trung thu", tall: false },
  { src: "/gallery/g4.jpg", caption: "Rước đèn dưới trăng", tall: false },
  { src: "/gallery/g5.jpg", caption: "Sân chơi dân gian", tall: true },
  { src: "/gallery/g6.jpg", caption: "Tình nguyện viên", tall: false },
  { src: "/gallery/g7.jpg", caption: "Núi rừng Langbiang", tall: false },
  { src: "/gallery/g8.jpg", caption: "Đêm hội Trăng rằm", tall: false },
  { src: "/gallery/g9.jpg", caption: "Sẻ chia yêu thương", tall: true },
  { src: "/gallery/g10.jpg", caption: "Bên các em nhỏ", tall: false },
  { src: "/gallery/g11.jpg", caption: "Hành trình thiện nguyện", tall: false },
  { src: "/gallery/g12.jpg", caption: "Khoảnh khắc chia tay", tall: false },
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
   ------------------------------------------------------------------ */
export const sponsorTiers = [
  {
    tier: "Nhà tài trợ Kim cương",
    sponsors: [{ name: "Công ty ABC" }, { name: "Tập đoàn XYZ" }],
  },
  {
    tier: "Nhà tài trợ Vàng",
    sponsors: [{ name: "Cà phê Đà Lạt" }, { name: "Nông sản Cao Nguyên" }, { name: "Nhà sách Ánh Sáng" }],
  },
  {
    tier: "Đơn vị đồng hành",
    sponsors: [
      { name: "CLB Thiện Nguyện Trẻ" },
      { name: "Nhóm Bạn Đà Lạt" },
      { name: "Hội SV Tình Nguyện" },
      { name: "Quán Cơm 2K" },
      { name: "Xưởng In Xanh" },
      { name: "Vận Tải Lâm Đồng" },
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
