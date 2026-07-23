"use client";

import { Fragment, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeroCanvas from "./HeroCanvas";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

import Countdown from "./Countdown";
import { LeafBranch, Daisy } from "./Decor";

type HeroProps = {
  /** Nhãn ngày sự kiện (đã thay {năm} theo số năm hiện tại). */
  dateLabel: string;
  /** Ngày bắt đầu sự kiện — nguồn cho đồng hồ đếm ngược (A3). */
  dateISO: string;
  /** Dòng chữ nhỏ trên đồng hồ đếm ngược (main.event.countdownLabel). */
  countdownLabel: string;
  /** Dòng chữ trên tiêu đề (site.tagline). */
  tagline: string;
  /** Tiêu đề chính lớn - Dòng 1 (chữ nghệ thuật) ở đầu trang chủ. */
  heroTitle1: string;
  /** Tiêu đề chính lớn - Dòng 2 (chữ nghệ thuật) ở đầu trang chủ. */
  heroTitle2: string;
  /** Dòng địa điểm dưới tiêu đề (site.subtitle). */
  subtitle: string;
  /** 4 ảnh nổi quanh Hero (main.heroPhotos); thiếu thì dùng ảnh mặc định. */
  photos?: string[];
};

/** Ảnh kỷ niệm "trôi nổi" ở hai dải trống trái/phải của Hero (chỉ màn hình lớn). */
type HeroFloat = {
  src: string;
  alt: string;
  side: "left" | "right";
  top: string;
  offset: string; // khoảng cách từ mép màn hình
  width: string;
  rotate: number;
  depth: number; // hệ số parallax khi cuộn
  delay: string;
};

const heroFloats: HeroFloat[] = [
  { src: "/gallery/g8.jpg", alt: "Đêm hội Trăng rằm", side: "left", top: "calc(850px - 85%)", offset: "1.5vw", width: "clamp(96px,11vw,210px)", rotate: -7, depth: -70, delay: "0s" },
  { src: "/gallery/g4.jpg", alt: "Rước đèn dưới trăng", side: "left", top: "calc(450px)", offset: "5vw", width: "clamp(80px,9vw,168px)", rotate: 5, depth: -110, delay: "1.4s" },
  { src: "/gallery/g2.jpg", alt: "Nụ cười em thơ", side: "right", top: "calc(850px - 85%)", offset: "1.5vw", width: "clamp(96px,11vw,210px)", rotate: 7, depth: -80, delay: "0.7s" },
  { src: "/gallery/g6.jpg", alt: "Tình nguyện viên", side: "right", top: "calc(450px)", offset: "4.5vw", width: "clamp(80px,9vw,168px)", rotate: -5, depth: -120, delay: "2.1s" },
];

export default function Hero({
  dateLabel,
  dateISO,
  countdownLabel,
  tagline,
  heroTitle1,
  heroTitle2,
  subtitle,
  photos = [],
}: HeroProps) {
  // Bố cục (vị trí/nghiêng/kích thước) giữ trong code; admin chỉ đổi ảnh.
  const floats = heroFloats.map((f, i) => ({ ...f, src: photos[i]?.trim() || f.src }));
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const SEL = [
        ".hero-eyebrow",
        ".hero-title",
        ".hero-script",
        ".hero-sub",
        ".hero-date",
        ".hero-cta > *",
        ".hero-count",
      ];
      // Đảm bảo mọi phần tử luôn hiện lại sau khi animate (không kẹt opacity:0)
      const reveal = () => gsap.set(SEL, { clearProps: "all", opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        onComplete: reveal,
        onInterrupt: reveal,
      });
      tl.from(".hero-eyebrow", { y: 30, opacity: 0, duration: 0.7 })
        .from(".hero-title", { y: 50, opacity: 0, duration: 1 }, "-=0.3")
        .from(".hero-script", { scale: 0.8, opacity: 0, duration: 1 }, "-=0.6")
        .from(".hero-sub", { y: 24, opacity: 0, duration: 0.7 }, "-=0.5")
        .from(".hero-date", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          ".hero-cta > *",
          { y: 24, opacity: 0, duration: 0.6, stagger: 0.12 },
          "-=0.3"
        )
        .from(".hero-count", { y: 24, opacity: 0, duration: 0.6 }, "-=0.2");

      // Lưới an toàn: dù có gì xảy ra, sau 4s tất cả phải hiện
      gsap.delayedCall(4, reveal);

      // parallax on scroll
      gsap.to(".hero-content", {
        y: 120,
        // opacity: 0.2,
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Ảnh trôi nổi hai bên: parallax nhẹ, mỗi ảnh một độ sâu khác nhau
      gsap.utils.toArray<HTMLElement>(".hero-float").forEach((el) => {
        const depth = Number(el.dataset.depth || 0);
        gsap.to(el, {
          y: depth,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative min-h-[850px] items-center justify-center overflow-hidden"
    >
      {/* Bầu trời gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-soft via-[#c9ecf2] to-cream dark:from-[#0a1626] dark:via-[#0c1712] dark:to-[#0c1712]" />
      <HeroCanvas />

      {/* Cành lá góc trên */}
      <LeafBranch className="pointer-events-none absolute -left-6 -top-6 z-10 h-56 w-72 animate-sway opacity-90 md:h-72 md:w-96" />
      <LeafBranch
        flip
        className="pointer-events-none absolute -right-6 -top-6 z-10 h-56 w-72 animate-sway opacity-90 md:h-72 md:w-96"
      />

      {/* Hoa cúc lơ lửng */}
      <Daisy className="animate-float absolute left-[13%] top-[46%] z-10 opacity-90" size={30} />
      <Daisy className="animate-float absolute right-[14%] top-[52%] z-10 opacity-80" size={40} />
      <Daisy className="animate-float absolute right-[28%] top-[24%] z-10 opacity-70" size={22} />

      {/* Ảnh kỷ niệm trôi nổi hai bên (chỉ hiện trên màn hình lớn) */}
      {floats.map((f, i) => (
        <div
          key={i}
          aria-hidden
          data-depth={f.depth}
          className="hero-float pointer-events-none absolute z-10 hidden lg:block"
          style={{ top: f.top, [f.side]: f.offset, width: f.width }}
        >
          <div className="animate-float" style={{ animationDelay: f.delay }}>
            <div
              className="rounded-2xl bg-white/85 p-2 shadow-soft ring-1 ring-black/5 backdrop-blur-sm dark:bg-white/10 dark:ring-white/10"
              style={{ transform: `rotate(${f.rotate}deg)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.src}
                alt={f.alt}
                loading="eager"
                decoding="async"
                className="block aspect-[4/5] w-full rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      ))}

      {/* Nội dung */}
      <div className="hero-content relative z-20 mx-auto max-w-4xl px-5 pb-6 pt-20 text-center sm:px-6 sm:pb-0 sm:pt-24">
        <p className="hero-eyebrow mb-3 inline-block rounded-full border border-leaf/40 bg-white/50 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-leaf-deep backdrop-blur dark:border-leaf-bright/30 dark:bg-white/5 dark:text-leaf-bright">
          {tagline}
        </p>

        <h1 className="hero-title">
          <span className="sr-only">
            {(heroTitle2 ?? "").trim() ? `${heroTitle1} ${heroTitle2}` : heroTitle1}
          </span>
          <span
            aria-hidden
            className="hero-script font-display block pb-4 text-[3.25rem] font-bold leading-[1.12] text-gradient-green drop-shadow-sm sm:text-7xl md:text-8xl"
          >
            {heroTitle1}
            {(heroTitle2 ?? "").trim() && (
              <>
                <br />
                {heroTitle2}
              </>
            )}
          </span>
        </h1>

        <p className="hero-sub mx-auto mt-6 max-w-md text-base font-semibold uppercase leading-snug tracking-wide text-sunset sm:max-w-xl sm:text-lg">
          {subtitle}
        </p>

        {/* first-letter:uppercase chứ không phải capitalize: chỉ hoa chữ cái
            đầu câu, còn "ngày", "tháng", "năm" giữ nguyên chữ thường. */}
        <p className="hero-date mt-2 text-sm font-semibold tracking-wide text-leaf-deep first-letter:uppercase sm:text-base dark:text-leaf-bright">
          {dateLabel}
        </p>

        <div className="hero-cta mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#register"
            className="rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-8 py-3.5 text-base font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Đăng ký đồng hành 🌙
          </a>
          <a
            href="#about"
            className="rounded-full border-2 border-leaf-deep/30 bg-white/60 px-8 py-3.5 text-base font-semibold text-leaf-deep backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-leaf-bright/25 dark:bg-white/5 dark:text-leaf-bright dark:hover:bg-white/10"
          >
            Tìm hiểu dự án
          </a>
        </div>

        <div className="hero-count mt-10 flex flex-col items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-forest/60 dark:text-ink/60">
            {countdownLabel}
          </span>
          <Countdown dateISO={dateISO} />
        </div>

        {/* Cuộn xuống — bản mobile nằm trong luồng để không đè lên đếm ngược */}
        <a
          href="#about"
          className="mt-9 inline-flex flex-col items-center text-forest/55 sm:hidden dark:text-ink/50"
          aria-label="Cuộn xuống"
        >
          <span className="mb-1 text-[10px] font-semibold uppercase tracking-widest">
            Cuộn xuống
          </span>
          <span className="animate-bounce-down block h-6 w-6">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </a>
      </div>

      {/* Scroll indicator — bản desktop cố định ở đáy khung */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 text-center text-forest/60 sm:block dark:text-ink/55"
        aria-label="Cuộn xuống"
      >
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest">
          Cuộn xuống
        </span>
        <span className="animate-bounce-down mx-auto block h-6 w-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </a>
    </section>
  );
}
