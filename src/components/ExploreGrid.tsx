import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content/store";

export default async function ExploreGrid() {
  const { currentYear, pastYears } = await getContent();
  // Năm gần nhất trong danh mục năm đã qua (mới → cũ).
  const latestPastYear = [...pastYears].sort((a, b) => b.year - a.year)[0];

  const items = [
    {
      href: "/gay-quy",
      icon: "🛒",
      title: "Gian hàng gây quỹ",
      desc: "Ủng hộ qua Shopee, chuyển khoản hoặc hiện vật.",
    },
    {
      href: "/ban-to-chuc",
      icon: "👥",
      title: "Ban sáng lập & Tổ chức",
      desc: "Những người đứng sau hành trình Trăng Sáng Langbiang.",
    },
    {
      href: "/chuong-trinh",
      icon: "🗓️",
      title: `Chương trình ${currentYear}`,
      desc: "Các hoạt động và lịch trình hai ngày một đêm.",
    },
    // Thẻ "Nhìn lại" chỉ hiện khi có năm đã qua (FR4).
    ...(latestPastYear
      ? [
          {
            href: `/${latestPastYear.year}`,
            icon: "📸",
            title: `Nhìn lại mùa ${latestPastYear.year}`,
            desc: "Khoảnh khắc, đội ngũ và những con số của mùa đã qua.",
          },
        ]
      : []),
    {
      href: "/tin-tuc",
      icon: "📰",
      title: "Tin tức & Bản tin",
      desc: "Nhật ký và tin mới nhất về dự án.",
    },
    {
      href: "/gay-quy#bao-cao-chi",
      icon: "📊",
      title: "Báo cáo chi",
      desc: "Minh bạch các khoản chi sau mỗi mùa dự án.",
    },
  ];

  return (
    <section id="explore" className="relative bg-[#eef8ea] py-16 dark:bg-night-2 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Khám phá thêm
          </span>
          <h2 className="text-2xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Tìm hiểu sâu hơn về{" "}
            <span className="text-gradient-green">dự án</span>
          </h2>
          <p className="mt-4 text-base text-forest/75 sm:text-lg dark:text-ink/75">
            Chọn mục bạn quan tâm để xem chi tiết.
          </p>
        </Reveal>

        <Reveal
          childrenStagger
          className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3"
        >
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="group flex items-start gap-4 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-leaf/10 transition duration-300 hover:-translate-y-1 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10 sm:p-6"
            >
              <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf/15 to-sun/15 text-2xl">
                {it.icon}
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1.5 text-base font-bold text-forest dark:text-ink">
                  {it.title}
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 flex-shrink-0 text-leaf-deep transition-transform group-hover:translate-x-1 dark:text-leaf-bright"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-forest/70 dark:text-ink/70">
                  {it.desc}
                </span>
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
