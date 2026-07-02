import type { ReactNode } from "react";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/sections/Footer";

type NavItem = { href: string; label: string };

/**
 * Khung dùng chung cho các trang phụ (/2025, /tin-tuc, /gay-quy):
 * top bar quay về trang chủ + tiêu đề + footer.
 */
export default function SubPageShell({
  eyebrow,
  title,
  subtitle,
  nav = [],
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  nav?: NavItem[];
  children: ReactNode;
}) {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <ThemeToggle />
      <BackToTop />

      <header className="glass glass-adaptive fixed inset-x-0 top-0 z-50 py-2 shadow-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-leaf-deep dark:text-leaf-bright"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            <span className="font-display text-lg font-bold">Trang chủ</span>
          </Link>

          {nav.length > 0 && (
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
          )}

          <Link
            href="/#register"
            className="rounded-full bg-gradient-to-r from-leaf to-grass px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-105"
          >
            Đăng ký 2026
          </Link>
        </div>
      </header>

      <main className="pt-20">
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft via-[#dff2e6] to-cream py-20 text-center dark:from-[#0a1626] dark:via-night-2 dark:to-night sm:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <span className="mb-3 inline-block rounded-full bg-white/50 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-leaf-deep backdrop-blur dark:bg-white/5 dark:text-leaf-bright">
              {eyebrow}
            </span>
            <h1 className="font-display pb-3 text-4xl font-bold leading-[1.18] text-gradient-green sm:pb-5 sm:text-6xl md:text-7xl">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-forest/80 dark:text-ink/80">
              {subtitle}
            </p>
          </div>
        </section>

        {children}
      </main>

      <Footer />
    </>
  );
}
