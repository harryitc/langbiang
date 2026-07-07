"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { gallery } from "@/lib/site";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const slides = gallery.slice(0, 6);

/**
 * "Rạp chiếu phim" Trăng sáng Langbiang.
 * Section full màn hình: nền rạp tối, màn chiếu phát sáng ở giữa (Embla Carousel).
 * Hai tấm rèm nhung đỏ khép kín lúc đầu; khi người xem KÉO XUỐNG, rèm cuốn mở
 * theo tiến trình cuộn (GSAP ScrollTrigger) để lộ màn chiếu — cảm giác vào rạp.
 * Tôn trọng prefers-reduced-motion (rèm mở sẵn, tắt tự chạy).
 */
export default function BannerSlider() {
  const root = useRef<HTMLDivElement>(null);

  const autoplay = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", skipSnaps: false },
    [autoplay.current]
  );

  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoplay.current.stop();
    }
  }, [emblaApi]);

  // Rèm cuốn mở theo cuộn + màn chiếu sáng dần lên
  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const st = {
        trigger: root.current,
        start: "top 85%",
        end: "top 20%",
        scrub: true,
      } as const;

      // Rèm khép (x:0) -> mở bung ra hai bên
      gsap.fromTo(".cinema-curtain-l", { xPercent: 0 }, { xPercent: -104, ease: "none", scrollTrigger: st });
      gsap.fromTo(".cinema-curtain-r", { xPercent: 0 }, { xPercent: 104, ease: "none", scrollTrigger: st });
      // Vòm rèm trên cuốn lên nhẹ
      gsap.fromTo(".cinema-valance", { yPercent: 0 }, { yPercent: -60, ease: "none", scrollTrigger: st });
      // Màn chiếu: từ mờ tối -> sáng rõ
      gsap.fromTo(
        ".cinema-screen",
        { opacity: 0.35, scale: 0.94, filter: "brightness(0.4)" },
        { opacity: 1, scale: 1, filter: "brightness(1)", ease: "none", scrollTrigger: st }
      );
    },
    { scope: root }
  );

  return (
    <section
      ref={root}
      aria-label="Rạp chiếu Khoảnh khắc chương trình"
      className="group relative flex h-[100svh] items-center justify-center overflow-hidden bg-[#0a0d0b]"
    >
      {/* Ánh sáng rọi từ máy chiếu phía sau màn hình */}
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_45%,rgba(122,180,120,0.22),transparent_70%)]" />
      {/* Sàn rạp mờ tối phía dưới */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />

      {/* Bảng "ĐANG CHIẾU" với dãy bóng đèn */}
      <div className="absolute top-[6svh] z-30 flex flex-col items-center gap-2">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <span
              key={i}
              className="animate-pulse h-1.5 w-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_2px_rgba(252,211,77,0.7)]"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
        <p className="font-display text-sm font-bold uppercase tracking-[0.35em] text-amber-200/90">
          ★ Đang chiếu ★
        </p>
      </div>

      {/* Màn chiếu (Embla) */}
      <div className="cinema-screen relative z-10 mx-auto w-[92%] max-w-6xl">
        <div className="relative overflow-hidden rounded-lg bg-black shadow-[0_0_80px_-10px_rgba(122,180,120,0.5)] ring-1 ring-white/20">
          {/* Viewport Embla */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {slides.map((s, i) => (
                <div
                  key={s.src}
                  className="relative aspect-[16/9] min-w-0 flex-[0_0_100%] md:aspect-[21/9]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.src}
                    alt={s.caption}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full select-none object-cover"
                    draggable={false}
                  />
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-5 sm:p-8">
                    <p className="text-sm font-semibold text-white drop-shadow sm:text-lg">
                      {s.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prev / Next */}
          <button
            onClick={scrollPrev}
            aria-label="Ảnh trước"
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-forest opacity-0 backdrop-blur transition hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 sm:left-3 sm:h-11 sm:w-11"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={scrollNext}
            aria-label="Ảnh sau"
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-forest opacity-0 backdrop-blur transition hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 sm:right-3 sm:h-11 sm:w-11"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-2">
            {snaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Đến ảnh ${i + 1}`}
                className={`h-2 rounded-full transition-all ${
                  i === selected ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ===== Rèm nhung đỏ ===== */}
      {/* Vòm rèm trên */}
      <div
        className="cinema-valance pointer-events-none absolute inset-x-0 top-0 z-20 h-[16svh]"
        style={{
          background:
            "linear-gradient(180deg,#5b0f10,#7a1417 55%,#4a0c0e)," +
            "repeating-linear-gradient(90deg,rgba(0,0,0,0.28) 0 3%,rgba(255,255,255,0.06) 3% 6%)",
          boxShadow: "inset 0 -14px 24px rgba(0,0,0,0.55)",
          clipPath:
            "polygon(0 0,100% 0,100% 62%,92% 100%,84% 62%,75% 100%,67% 62%,58% 100%,50% 62%,42% 100%,33% 62%,25% 100%,16% 62%,8% 100%,0 62%)",
        }}
      />
      {/* Tấm rèm trái */}
      <div
        className="cinema-curtain-l pointer-events-none absolute inset-y-0 left-0 z-20 w-[52%]"
        style={{
          background:
            "linear-gradient(90deg,#4a0c0e,#7a1417 45%,#5b0f10 70%,#3d090b)," +
            "repeating-linear-gradient(90deg,rgba(0,0,0,0.35) 0 4%,rgba(255,255,255,0.05) 4% 9%)",
          boxShadow: "inset -30px 0 50px rgba(0,0,0,0.6)",
        }}
      />
      {/* Tấm rèm phải */}
      <div
        className="cinema-curtain-r pointer-events-none absolute inset-y-0 right-0 z-20 w-[52%]"
        style={{
          background:
            "linear-gradient(270deg,#4a0c0e,#7a1417 45%,#5b0f10 70%,#3d090b)," +
            "repeating-linear-gradient(90deg,rgba(0,0,0,0.35) 0 4%,rgba(255,255,255,0.05) 4% 9%)",
          boxShadow: "inset 30px 0 50px rgba(0,0,0,0.6)",
        }}
      />

      {/* Gợi ý kéo xuống — vào rạp */}
      <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 text-center text-amber-100/80">
        <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.3em]">
          Kéo xuống để vào rạp
        </span>
        <span className="animate-bounce-down mx-auto block h-6 w-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </section>
  );
}
