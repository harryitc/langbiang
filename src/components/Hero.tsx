"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeroCanvas from "./HeroCanvas";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

import Countdown from "./Countdown";
import { LeafBranch, Daisy } from "./Decor";
import { site } from "@/lib/site";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
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

      // parallax on scroll
      gsap.to(".hero-content", {
        y: 120,
        opacity: 0.2,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
    >
      {/* Bầu trời gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-soft via-[#c9ecf2] to-cream" />
      <HeroCanvas />

      {/* Cành lá góc trên */}
      <LeafBranch className="pointer-events-none absolute -left-6 -top-6 z-10 h-56 w-72 animate-sway opacity-90 md:h-72 md:w-96" />
      <LeafBranch
        flip
        className="pointer-events-none absolute -right-6 -top-6 z-10 h-56 w-72 animate-sway opacity-90 md:h-72 md:w-96"
      />

      {/* Hoa cúc lơ lửng */}
      <Daisy className="animate-float absolute left-[12%] top-[40%] z-10 opacity-90" size={30} />
      <Daisy className="animate-float absolute right-[14%] top-[55%] z-10 opacity-80" size={40} />
      <Daisy className="animate-float absolute right-[28%] top-[28%] z-10 opacity-70" size={22} />

      {/* Nội dung */}
      <div className="hero-content relative z-20 mx-auto max-w-4xl px-6 pt-24 text-center">
        <p className="hero-eyebrow mb-3 inline-block rounded-full border border-leaf/40 bg-white/50 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-leaf-deep backdrop-blur">
          Dự án tình nguyện
        </p>

        <h1 className="hero-title">
          <span className="sr-only">Trăng sáng Langbiang</span>
          <span
            aria-hidden
            className="hero-script font-display block pb-4 text-6xl font-bold leading-[1.15] text-gradient-green drop-shadow-sm sm:text-7xl md:text-8xl"
          >
            Trăng sáng
            <br />
            Langbiang
          </span>
        </h1>

        <p className="hero-sub mx-auto mt-6 max-w-xl text-base font-semibold uppercase tracking-wide text-sunset sm:text-lg">
          {site.subtitle}
        </p>

        <p className="hero-date mt-2 font-display text-2xl font-semibold text-leaf-deep sm:text-3xl">
          {site.dateLabel}
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
            className="rounded-full border-2 border-leaf-deep/30 bg-white/60 px-8 py-3.5 text-base font-semibold text-leaf-deep backdrop-blur transition hover:-translate-y-0.5 hover:bg-white"
          >
            Tìm hiểu dự án
          </a>
        </div>

        <div className="hero-count mt-10 flex flex-col items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-forest/60">
            Đếm ngược đến ngày lên đường
          </span>
          <Countdown />
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 text-center text-forest/60"
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
