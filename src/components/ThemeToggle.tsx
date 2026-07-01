"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<HTMLDivElement>(null);
  const moonRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const applyTheme = (next: boolean) => {
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  const toggle = () => {
    const next = !dark;
    setDark(next);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const overlay = overlayRef.current;
    if (reduce || !overlay || animating.current) {
      applyTheme(next);
      return;
    }
    animating.current = true;

    const btn = btnRef.current!;
    const rect = btn.getBoundingClientRect();
    const ox = rect.left + rect.width / 2;
    const oy = rect.top + rect.height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const wash = washRef.current!;
    const body = (next ? moonRef : sunRef).current!;
    const other = (next ? sunRef : moonRef).current!;
    const stars = starsRef.current!;

    // màu "màn trời" theo hướng chuyển
    wash.style.background = next
      ? `radial-gradient(circle at ${ox}px ${oy}px, #12213a 0%, #0a1626 45%, #0c1712 100%)`
      : `radial-gradient(circle at ${ox}px ${oy}px, #d9f2ff 0%, #a8e0f0 45%, #fdfcf5 100%)`;

    overlay.style.display = "block";
    other.style.opacity = "0";
    gsap.set(wash, { clipPath: `circle(0px at ${ox}px ${oy}px)`, opacity: 1 });
    gsap.set(body, { opacity: 0 });
    gsap.set(stars.children, { opacity: 0, scale: 0 });

    const maxR = Math.hypot(vw, vh) * 1.1;

    // điểm bắt đầu & kết thúc của vòng cung thiên thể
    const startX = ox;
    const startY = oy;
    const peakX = vw * 0.5;
    const peakY = vh * 0.22;
    const endX = vw * 0.14;
    const endY = vh * 0.42;

    const tl = gsap.timeline({
      onComplete: () => {
        overlay.style.display = "none";
        animating.current = false;
      },
    });

    // 1) màn trời loang ra từ nút
    tl.to(wash, {
      clipPath: `circle(${maxR}px at ${ox}px ${oy}px)`,
      duration: 0.9,
      ease: "power2.inOut",
    });

    // 2) đổi theme khi màn trời đã che gần kín
    tl.add(() => applyTheme(next), 0.42);

    // 3) thiên thể mọc lên & vẽ vòng cung
    tl.set(body, { xPercent: -50, yPercent: -50, x: startX, y: startY, scale: 0.3, opacity: 0 }, 0.05);
    tl.to(
      body,
      {
        keyframes: {
          x: [startX, peakX, endX],
          y: [startY, peakY, endY],
          scale: [0.35, 1, 0.9],
          easeEach: "sine.inOut",
        },
        opacity: 1,
        duration: 1.15,
        ease: "none",
      },
      0.1
    );
    tl.to(body, { rotate: next ? -25 : 40, duration: 1.15, ease: "sine.out" }, 0.1);

    // 4) sao lấp lánh khi vào đêm
    if (next) {
      tl.to(
        stars.children,
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: { each: 0.04, from: "random" },
          ease: "back.out(2)",
        },
        0.5
      );
    }

    // 5) cả overlay tan dần
    tl.to(
      [wash, body, stars],
      { opacity: 0, duration: 0.55, ease: "power2.in" },
      "-=0.25"
    );
  };

  return (
    <>
      {/* Overlay hiệu ứng chuyển cảnh */}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[9996] hidden overflow-hidden"
      >
        <div ref={washRef} className="absolute inset-0" />

        {/* Sao (cho chế độ tối) */}
        <div ref={starsRef} className="absolute inset-0">
          {STARS.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: s.s,
                height: s.s,
                boxShadow: "0 0 6px 1px rgba(255,255,255,0.8)",
              }}
            />
          ))}
        </div>

        {/* Mặt trăng */}
        <div
          ref={moonRef}
          className="absolute left-0 top-0 h-32 w-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 38% 34%, #fffdf2, #fff4cf 55%, #f3e2a6)",
            boxShadow:
              "0 0 60px 24px rgba(255,244,207,0.55), inset -14px -10px 24px rgba(180,160,90,0.35)",
          }}
        >
          <span className="absolute left-[26%] top-[30%] h-4 w-4 rounded-full bg-black/10" />
          <span className="absolute left-[58%] top-[52%] h-6 w-6 rounded-full bg-black/10" />
          <span className="absolute left-[40%] top-[66%] h-3 w-3 rounded-full bg-black/10" />
        </div>

        {/* Mặt trời */}
        <div
          ref={sunRef}
          className="absolute left-0 top-0 h-32 w-32"
        >
          <div
            className="absolute inset-[18%] rounded-full"
            style={{
              background:
                "radial-gradient(circle at 40% 38%, #fff2c0, #ffd166 55%, #f5a623)",
              boxShadow: "0 0 70px 28px rgba(245,166,35,0.55)",
            }}
          />
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 h-[18%] w-[3px] -translate-x-1/2 origin-bottom rounded-full bg-sun"
              style={{
                transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-165%)`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Nút chuyển */}
      <button
        ref={btnRef}
        onClick={toggle}
        aria-label={dark ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
        aria-pressed={dark}
        title={dark ? "Chế độ sáng" : "Chế độ tối"}
        className="glass glass-adaptive group fixed bottom-6 right-6 z-[9997] flex items-center justify-center overflow-hidden rounded-full text-leaf-deep shadow-soft transition hover:scale-110 hover:text-sunset dark:text-leaf-bright dark:hover:text-sun"
        style={{ height: 52, width: 52 }}
      >
        <span className="relative block h-6 w-6" aria-hidden>
          {/* Sun */}
          <svg
            viewBox="0 0 24 24"
            className={`absolute inset-0 h-6 w-6 transition-all duration-500 ${
              dark ? "scale-0 -rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
          {/* Moon */}
          <svg
            viewBox="0 0 24 24"
            className={`absolute inset-0 h-6 w-6 transition-all duration-500 ${
              dark ? "scale-100 rotate-0 opacity-100" : "scale-0 rotate-90 opacity-0"
            }`}
            fill="currentColor"
          >
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        </span>
      </button>
    </>
  );
}

const STARS = [
  { x: 12, y: 18, s: 3 },
  { x: 22, y: 40, s: 2 },
  { x: 30, y: 12, s: 4 },
  { x: 44, y: 28, s: 2 },
  { x: 56, y: 16, s: 3 },
  { x: 63, y: 38, s: 2 },
  { x: 72, y: 20, s: 4 },
  { x: 80, y: 44, s: 2 },
  { x: 88, y: 24, s: 3 },
  { x: 18, y: 62, s: 2 },
  { x: 36, y: 70, s: 3 },
  { x: 52, y: 60, s: 2 },
  { x: 68, y: 68, s: 3 },
  { x: 84, y: 64, s: 2 },
  { x: 92, y: 52, s: 3 },
];
