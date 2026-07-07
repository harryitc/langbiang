"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { gallery } from "@/lib/site";

const slides = gallery.slice(0, 6);

/**
 * Banner như một thước phim — full màn hình theo mọi tỉ lệ, ảnh rộng object-cover.
 * Chữ mô tả của mỗi ảnh hiện phía dưới trên một lớp tối để dễ đọc.
 * Dùng Embla Carousel (kéo/vuốt, loop, tự chạy, dừng khi hover).
 * Tôn trọng prefers-reduced-motion (tắt tự chạy).
 */
export default function BannerSlider() {
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

  return (
    <section
      aria-label="Khoảnh khắc chương trình"
      className="group relative h-[100svh] overflow-hidden bg-black"
    >
      {/* Viewport Embla — chiếm trọn màn hình theo mọi tỉ lệ */}
      <div className="h-full overflow-hidden" ref={emblaRef}>
        <div className="flex h-full touch-pan-y">
          {slides.map((s, i) => (
            <div key={s.src} className="relative h-full min-w-0 flex-[0_0_100%]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.src}
                alt={s.caption}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full select-none object-cover"
                draggable={false}
              />
              {/* Lớp tối phía dưới để hiển thị chữ mô tả */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black via-black/70 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-16 sm:px-10 sm:pb-20">
                <p className="mx-auto max-w-5xl text-lg font-semibold leading-snug text-white drop-shadow-lg sm:text-2xl md:text-3xl">
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
        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition hover:bg-white/35 focus-visible:opacity-100 group-hover:opacity-100 sm:left-6 sm:h-12 sm:w-12"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        aria-label="Ảnh sau"
        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition hover:bg-white/35 focus-visible:opacity-100 group-hover:opacity-100 sm:right-6 sm:h-12 sm:w-12"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex items-center justify-center gap-2">
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
    </section>
  );
}
