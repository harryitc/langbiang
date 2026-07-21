import Link from "next/link";
import Reveal from "@/components/Reveal";

const cards = [
  {
    href: "/gay-quy",
    icon: "🛒",
    eyebrow: "Chung tay đóng góp",
    title: "Đồng hành & Gây quỹ",
    desc: "Ủng hộ qua gian hàng Shopee, chuyển khoản hoặc hiện vật.",
    cta: "Cùng gây quỹ",
    theme: "sun",
  },
  {
    href: "/tin-tuc",
    icon: "📰",
    eyebrow: "Tin tức & Bản tin",
    title: "Câu chuyện hành trình",
    desc: "Nhật ký, hình ảnh và tin mới nhất về dự án. Đăng ký bản tin nhé!",
    cta: "Đọc tin tức",
    theme: "leaf",
  },
] as const;

export default function MorePages() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal childrenStagger className="grid gap-6 md:grid-cols-2">
          {cards.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`group relative overflow-hidden rounded-[2rem] p-8 shadow-soft ring-1 transition duration-300 hover:-translate-y-1.5 sm:p-10 ${
                c.theme === "sun"
                  ? "bg-gradient-to-br from-sunset to-sun text-white ring-transparent"
                  : "bg-gradient-to-br from-leaf-deep to-leaf text-white ring-transparent"
              }`}
            >
              <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 transition group-hover:scale-150" />
              <span className="relative text-5xl">{c.icon}</span>
              <p className="relative mt-4 text-xs font-bold uppercase tracking-widest text-white/80">
                {c.eyebrow}
              </p>
              <h3 className="relative mt-1 font-display text-3xl font-bold sm:text-4xl">
                {c.title}
              </h3>
              <p className="relative mt-2 max-w-sm text-white/85">{c.desc}</p>
              <span className="relative mt-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-6 py-2.5 text-sm font-semibold text-forest transition group-hover:gap-3">
                {c.cta}
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
