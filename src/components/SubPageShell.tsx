import type { ReactNode } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import SubPageHeader from "@/components/SubPageHeader";
import Footer from "@/components/sections/Footer";

type NavItem = { href: string; label: string };

export default function SubPageShell({
  eyebrow,
  title,
  subtitle,
  nav = [],
  hero,
  bgImage,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  nav?: NavItem[];
  /** Nội dung extra hiển thị ngay trong hero section, bên dưới subtitle */
  hero?: ReactNode;
  bgImage?: string;
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
        <section className="relative flex min-h-[100svh] items-center overflow-hidden px-6 py-24 text-center sm:py-32">
          {/* Nền gradient */}
          <div className="absolute inset-0 -z-20 bg-gradient-to-b from-sky-soft via-[#dff2e6] to-cream dark:from-[#0a1626] dark:via-night-2 dark:to-night" />

          {/* Nền ảnh mờ */}
          {bgImage && (
            <div className="absolute inset-0 -z-10 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={bgImage}
                alt=""
                className="h-full w-full object-cover opacity-65 transition-all duration-500 dark:opacity-40 dark:brightness-[0.8]"
              />
              {/* Lớp phủ chuyển màu mượt với nền */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#dff2e6]/30 to-cream dark:via-night-2/30 dark:to-night" />
            </div>
          )}

          <div className="relative z-10 mx-auto w-full max-w-3xl">
            <span className="mb-3 inline-block rounded-full bg-white/50 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-leaf-deep backdrop-blur dark:bg-white/5 dark:text-leaf-bright">
              {eyebrow}
            </span>
            <h1 className="font-display pb-3 text-4xl font-bold leading-[1.18] text-gradient-green sm:pb-5 sm:text-6xl md:text-7xl">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-forest/80 dark:text-ink/80">
              {subtitle}
            </p>
            {hero && <div className="mt-12">{hero}</div>}
          </div>
        </section>

        {children}
      </main>

      <Footer />
    </>
  );
}
