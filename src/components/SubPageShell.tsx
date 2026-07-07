import type { ReactNode } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import SubPageHeader from "@/components/SubPageHeader";
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

      <SubPageHeader nav={nav} />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft via-[#dff2e6] to-cream pb-16 pt-24 text-center dark:from-[#0a1626] dark:via-night-2 dark:to-night sm:pb-24 sm:pt-32">
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
