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
  dateLabel: "Ngày 26 – 27 tháng 9 năm 2026",
  dateISO: "2026-09-26",
  location: "Phường Langbiang, Đà Lạt, Lâm Đồng",
  url: siteUrl,
  description:
    "Trăng Sáng Langbiang là dự án tình nguyện mang Trung thu ấm áp, sân chơi và những phần quà yêu thương đến các em nhỏ vùng cao Langbiang – Đà Lạt, Lâm Đồng. Mùa 2026 diễn ra ngày 26–27/9. Đăng ký đồng hành cùng chúng mình!",
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
    date: "26/09/2026",
    items: [
      { time: "05:30", title: "Tập trung & khởi hành", desc: "Đoàn xuất phát từ TP.HCM hướng về cao nguyên Langbiang." },
      { time: "13:00", title: "Đến Langbiang", desc: "Nhận chỗ nghỉ, chuẩn bị hậu cần và trang trí sân khấu." },
      { time: "16:00", title: "Dựng gian hàng", desc: "Set-up sân chơi, khu trao quà và các tiểu cảnh check-in." },
      { time: "19:00", title: "Đêm hội Trăng rằm", desc: "Chương trình văn nghệ, rước đèn và phá cỗ cùng các em nhỏ." },
    ],
  },
  {
    day: "Ngày 2",
    date: "27/09/2026",
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
    a: "Tất cả các bạn từ 18 tuổi, có tinh thần thiện nguyện, sức khỏe tốt và sắp xếp được thời gian 26–27/9/2026 đều có thể đăng ký làm tình nguyện viên.",
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
    tier: "Nhà tài trợ mùa 2025",
    sponsors: [
      {
        name: "WESET English Center",
        logo: "/sponsors/weset.png",
        url: "https://weset.edu.vn",
        intro: "Trung tâm Anh ngữ WESET — đơn vị tài trợ đồng hành cùng Trăng Sáng Langbiang.",
      },
      {
        name: "Phở Huỳnh Trâm",
        logo: "/sponsors/pho-huynh-tram.png",
        url: "https://phohuynhtram.com",
        intro: "Phở Huỳnh Trâm hỗ trợ những bữa ăn ấm lòng cho đoàn tình nguyện.",
      },
      {
        name: "Sun Taxi Group",
        logo: "/sponsors/sun-taxi.png",
        url: "https://suntaxi.vn",
        intro: "Sun Taxi Group hỗ trợ di chuyển, đưa đón đoàn trong suốt hành trình.",
      },
      {
        name: "Bệnh viện Đa khoa Tâm Phúc",
        logo: "/sponsors/tam-phuc.png",
        url: "http://benhvientamphuc.com.vn",
        intro: "Bệnh viện Đa khoa Tâm Phúc (Tam Phuc Hospital) đồng hành, chăm sóc y tế cho chương trình.",
      },
    ],
  },
];

/* ------------------------------------------------------------------
   TIN TỨC / BẢN TIN — content dạng bài đăng trên Fanpage
   ------------------------------------------------------------------ */
export type NewsPost = {
  /** Slug dùng cho URL /tin-tuc/[id] */
  id: string;
  img: string;
  tag: string;
  title: string;
  excerpt: string;
  /** Nội dung đầy đủ (mỗi phần tử là 1 đoạn văn). Nếu bỏ trống sẽ dùng excerpt. */
  body?: string[];
  /** Link bài gốc trên Fanpage Facebook */
  link: string;
};

export const news: NewsPost[] = [
  {
    id: "tong-ket-mua-trang-dau-tien",
    img: "/tintuc/n6.png",
    tag: "Tổng kết",
    title: "Trọn vẹn mùa trăng đầu tiên tại Langbiang 💚",
    excerpt:
      "Hai ngày một đêm với hơn 500 phần quà, 80 tình nguyện viên và vô vàn nụ cười. Cảm ơn tất cả những tấm lòng đã cùng chúng mình thắp sáng Trung thu vùng cao!",
    body: [
      "Hai ngày một đêm tại phường Langbiang khép lại với thật nhiều cảm xúc. Hơn 500 phần quà đã được trao tận tay các em nhỏ, cùng 80 tình nguyện viên miệt mài xuyên suốt hành trình.",
      "Từ những sân chơi rộn tiếng cười, những màn múa lân, đến ánh đèn lồng lung linh trong đêm hội trăng rằm — tất cả tạo nên một mùa Trung thu trọn vẹn cho các em vùng cao.",
      "Cảm ơn tất cả những tấm lòng, những nhà hảo tâm và tình nguyện viên đã cùng chúng mình thắp sáng Langbiang. Hẹn gặp lại ở mùa trăng tiếp theo!",
    ],
    link: "https://www.facebook.com/share/p/1TddG8KRT1/",
  },
  {
    id: "hoi-trang-ram-tuoi-tho-co-tich",
    img: "/tintuc/n8.png",
    tag: "Hoạt động",
    title: "Hội Trăng rằm - Tuổi thơ cổ tích tại Langbiang 🏮",
    excerpt:
      "Không gian LangBiang hôm ấy bỗng rộn ràng và đầy ắp tiếng cười. Các em nhỏ được vui chơi hết mình trong những trò chơi dân gian, được sống lại trong thế giới cổ tích qua kịch Tấm Cám, Sự tích chú Cuội cung trăng...",
    body: [
      "Không gian Langbiang hôm ấy bỗng rộn ràng và đầy ắp tiếng cười. Các em nhỏ được vui chơi hết mình trong những trò chơi dân gian quen thuộc.",
      "Đặc biệt, các em còn được sống lại trong thế giới cổ tích qua những vở kịch Tấm Cám, Sự tích chú Cuội cung trăng do chính các anh chị tình nguyện viên hóa thân biểu diễn.",
      "Một đêm hội trăng rằm đúng nghĩa — nơi tuổi thơ được trọn vẹn với những giấc mơ cổ tích.",
    ],
    link: "https://www.facebook.com/share/p/14jbS3XKESE/",
  },
  {
    id: "nau-an-cho-em",
    img: "/tintuc/n1.jpg",
    tag: "Hoạt động",
    title: "Nấu ăn cho em - Hơi ấm lan toả giữa núi rừng Langbiang 🍜",
    excerpt:
      "Trong cái se lạnh và cơn mưa lất phất của núi rừng LangBiang, chương trình “Nấu ăn cho em” đã mang đến một khoảnh khắc thật ấm lòng. 250 suất phở bò nóng hổi đã được gửi trao tận tay các em học sinh và phụ huynh địa phương.",
    body: [
      "Trong cái se lạnh và cơn mưa lất phất của núi rừng Langbiang, chương trình “Nấu ăn cho em” đã mang đến một khoảnh khắc thật ấm lòng.",
      "250 suất phở bò nóng hổi đã được gửi trao tận tay các em học sinh và phụ huynh địa phương. Mỗi tô phở là một hơi ấm, một lời sẻ chia giữa những ngày mưa cao nguyên.",
      "Xin cảm ơn các đơn vị đồng hành đã cùng chúng mình mang bữa ăn ấm áp đến với các em.",
    ],
    link: "https://www.facebook.com/share/p/1G8BCjszGM/",
  },
  {
    id: "cam-on-weset-english-center",
    img: "/tintuc/n2.png",
    tag: "Tài trợ",
    title: "Trân trọng cảm ơn Trung tâm Anh ngữ WESET English Center – Đơn vị tài trợ dự án \"Trăng Sáng Langbiang\"",
    excerpt:
      "Ban Tổ chức Dự án xin gửi lời cảm ơn chân thành đến Trung tâm Anh ngữ WESET English Center đã đồng hành và hỗ trợ cùng chương trình. Sự đóng góp quý báu từ WESET góp phần tạo nên những giá trị thiết thực cho các em nhỏ tại Langbiang.",
    link: "https://www.facebook.com/share/p/1LsaVWTybt/",
  },
  {
    id: "cam-on-sun-taxi",
    img: "/tintuc/n3.png",
    tag: "Tài trợ",
    title: "Trân trọng cảm ơn Sun Taxi – Đơn vị tài trợ dự án \"Trăng Sáng Langbiang\"",
    excerpt:
      "Ban Tổ Chức Dự án xin trân trọng gửi lời cảm ơn đến Sun Taxi đã đồng hành và tài trợ cùng chương trình. Sự đóng góp của Sun Taxi không chỉ hỗ trợ thiết thực cho các hoạt động của Dự án, mà còn tiếp thêm động lực để sẻ chia yêu thương.",
    link: "https://www.facebook.com/share/p/1EbgGr59es/",
  },
  {
    id: "cam-on-benh-vien-tam-phuc",
    img: "/tintuc/n4.png",
    tag: "Tài trợ",
    title: "Trân trọng cảm ơn Bệnh viện Đa khoa Tâm Phúc – Đơn vị đồng hành dự án \"Trăng Sáng Langbiang\"",
    excerpt:
      "Ban Tổ Chức Dự án xin gửi lời cảm ơn sâu sắc đến Bệnh viện Đa khoa Tâm Phúc đã đồng hành và hỗ trợ cùng chương trình. Sự quan tâm, sẻ chia từ Bệnh viện mang đến nguồn động viên to lớn cho các em nhỏ tại Langbiang.",
    link: "https://www.facebook.com/share/p/1FzJcDgigQ/",
  },
  {
    id: "cam-on-pho-huynh-tram",
    img: "/tintuc/n5.png",
    tag: "Tài trợ",
    title: "Trân trọng cảm ơn Phở Huỳnh Trâm - Đơn vị tài trợ dự án \"Trăng Sáng Langbiang\"",
    excerpt:
      "Ban Tổ Chức Dự án xin gửi lời tri ân sâu sắc đến Phở Huỳnh Trâm đã nhận lời đồng hành, tài trợ 250 suất phở trị giá 15.000.000 đồng cho nội dung “Nấu ăn cho em”. Sự chung tay của quý đơn vị góp phần mang đến những bữa ăn ấm áp, trọn vẹn yêu thương.",
    link: "https://www.facebook.com/share/p/1E6Lkw5MgS/",
  },
  {
    id: "tuyen-thanh-vien",
    img: "/tintuc/n9.png",
    tag: "Tuyển thành viên",
    title: "[THÔNG BÁO] Tuyển thành viên dự án \"Trăng Sáng Langbiang\"",
    excerpt:
      "Mỗi mùa trăng rằm tháng Tám về, lòng ta lại rộn vang tiếng trống múa lân, ánh sáng lung linh của những chiếc lồng đèn và niềm háo hức đón Tết Trung thu. Nhưng ở vùng núi cao phường Langbiang (Lâm Đồng), vẫn còn biết bao em nhỏ chưa một lần trọn vẹn niềm vui ấy…",
    link: "https://www.facebook.com/share/p/1cfAdnV86E/",
  },
  {
    id: "chung-tay-mua-trung-thu",
    img: "/tintuc/n7.png",
    tag: "Kêu gọi",
    title: "Chung tay góp một mùa Trung thu cho em",
    excerpt:
      "Chỉ còn ít ngày nữa là đến hành trình. Mỗi chiếc lồng đèn, mỗi quyển vở đều là món quà ý nghĩa. Cùng đồng hành với Trăng Sáng Langbiang bạn nhé!",
    link: "https://www.facebook.com/share/p/1Lk31g2wMD/",
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

export const board: { founders: Member[]; members: Member[] } = {
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
  // TODO: bổ sung danh sách thành viên sau
  members: [],
};
