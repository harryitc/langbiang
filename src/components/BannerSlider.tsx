"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gallery } from "@/lib/site";

const slides = gallery.slice(0, 6);

/**
 * Banner slider ảnh chung của chương trình (anh Vũ: "banner liệt chạy hình ảnh").
 * - Tự chạy, tạm dừng khi hover / khi tab ẩn.
 * - Vuốt được trên mobile, nút prev/next + chấm điều hướng.
 * - Responsive: cao hơn trên mobile (aspect 4/3), rộng dần lên desktop (21/9).
 */
export default function BannerSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const t = setInterval(() => go(1), 4500);
    return () => clearInterval(t);
  }, [paused, go]);

  return (
    <section aria-label="Khoảnh khắc chương trình" className="relative py-4 sm:py-8">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div
          className="group relative overflow-hidden rounded-[1.75rem] bg-leaf/10 shadow-soft ring-1 ring-leaf/10 dark:ring-leaf-bright/10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={(e) => {
            setPaused(true);
            touchX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            if (touchX.current !== null) {
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            }
            touchX.current = null;
            setPaused(false);
          }}
        >
          {/* Track */}
          <div
            className="flex aspect-[4/3] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:aspect-[16/9] lg:aspect-[21/9]"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {slides.map((s, i) => (
              <div key={s.src} className="relative h-full w-full flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={s.src}
                  alt={s.caption}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="h-full w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4 sm:p-6">
                  <p className="text-sm font-semibold text-white drop-shadow sm:text-base">
                    {s.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next */}
          <button
            onClick={() => go(-1)}
            aria-label="Ảnh trước"
            className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-forest opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-white sm:left-3 sm:h-10 sm:w-10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Ảnh sau"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-forest opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-white sm:right-3 sm:h-10 sm:w-10"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.src}
                onClick={() => setIndex(i)}
                aria-label={`Đến ảnh ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
