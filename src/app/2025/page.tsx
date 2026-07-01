import type { Metadata } from "next";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import Gallery from "@/components/sections/Gallery";
import Team from "@/components/sections/Team";
import Volunteers from "@/components/sections/Volunteers";
import Sponsors from "@/components/sections/Sponsors";
import News from "@/components/sections/News";
import Footer from "@/components/sections/Footer";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nhìn lại mùa 2025",
  description:
    "Nhìn lại hành trình Trăng Sáng Langbiang mùa 2025: khoảnh khắc, đội ngũ tình nguyện viên, nhà tài trợ và những câu chuyện đẹp.",
  alternates: { canonical: "/2025" },
};

const nav = [
  { href: "#gallery", label: "Khoảnh khắc" },
  { href: "#team", label: "Đại gia đình" },
  { href: "#volunteers", label: "Tình nguyện viên" },
  { href: "#sponsors", label: "Tài trợ" },
  { href: "#news", label: "Tin tức" },
];

export default function Retro2025Page() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <ThemeToggle />

      {/* Top bar riêng cho trang 2025 */}
      <header className="glass glass-adaptive fixed inset-x-0 top-0 z-50 py-2 shadow-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 text-leaf-deep dark:text-leaf-bright">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            <span className="font-display text-lg font-bold">Trang chủ</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-forest/80 transition hover:bg-leaf/15 hover:text-leaf-deep dark:text-ink/80 dark:hover:bg-leaf-bright/10 dark:hover:text-leaf-bright"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <Link
            href="/#register"
            className="rounded-full bg-gradient-to-r from-leaf to-grass px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-105"
          >
            Đăng ký 2026
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Tiêu đề trang */}
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft via-[#dff2e6] to-cream py-20 text-center dark:from-[#0a1626] dark:via-night-2 dark:to-night sm:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <span className="mb-3 inline-block rounded-full bg-white/50 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-leaf-deep backdrop-blur dark:bg-white/5 dark:text-leaf-bright">
              Hồi ức
            </span>
            <h1 className="font-display text-5xl font-bold text-gradient-green sm:text-7xl">
              Nhìn lại mùa 2025
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-forest/80 dark:text-ink/80">
              Mùa Trăng Sáng Langbiang đầu tiên — nơi những tấm lòng gặp nhau và
              viết nên một câu chuyện thật đẹp giữa cao nguyên.
            </p>
          </div>
        </section>

        <Gallery />
        <Team />
        <Volunteers />
        <Sponsors />
        <News />

        {/* CTA quay lại 2026 */}
        <section className="py-20 text-center sm:py-24">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="text-3xl font-extrabold text-forest sm:text-4xl dark:text-ink">
              Sẵn sàng cho mùa <span className="text-gradient-green">2026</span>?
            </h2>
            <p className="mt-3 text-lg text-forest/75 dark:text-ink/75">
              Hành trình mới đang chờ bạn. Cùng chúng mình viết tiếp câu chuyện nhé!
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-4">
              <Link
                href="/#register"
                className="rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-8 py-3.5 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Đăng ký tham gia 🌙
              </Link>
              <Link
                href="/"
                className="rounded-full border-2 border-leaf-deep/30 bg-white/60 px-8 py-3.5 font-semibold text-leaf-deep transition hover:-translate-y-0.5 hover:bg-white dark:border-leaf-bright/25 dark:bg-white/5 dark:text-leaf-bright dark:hover:bg-white/10"
              >
                Về trang chủ
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
