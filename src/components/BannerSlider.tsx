"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { gallery } from "@/lib/site";

const slides = gallery.slice(0, 6);

/**
 * Banner slider ảnh chương trình — dùng Embla Carousel (thư viện chuẩn):
 * kéo/vuốt mượt trên chuột lẫn cảm ứng, loop, tự chạy, dừng khi hover.
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

    // Tắt tự chạy nếu người dùng yêu cầu giảm chuyển động
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoplay.current.stop();
    }
  }, [emblaApi]);

  return (
    <section
      aria-label="Khoảnh khắc chương trình"
      className="group relative h-[100svh] overflow-hidden bg-leaf/10"
    >
      {/* Viewport Embla — chiếm trọn chiều cao màn hình theo mọi tỉ lệ */}
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
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent p-6 pb-14 sm:p-10 sm:pb-16">
                <p className="mx-auto max-w-6xl text-base font-semibold text-white drop-shadow sm:text-lg">
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
        className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-forest opacity-0 backdrop-blur transition hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 sm:left-5 sm:h-12 sm:w-12"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        aria-label="Ảnh sau"
        className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-forest opacity-0 backdrop-blur transition hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 sm:right-5 sm:h-12 sm:w-12"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute inset-x-0 bottom-5 z-10 flex items-center justify-center gap-2">
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
