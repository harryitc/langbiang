"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { SLIDESHOW_LIMIT, type Photo } from "@/lib/content/schema";

/**
 * Slideshow đóng khung như một chiếc TV: thân máy xanh rừng, ăng-ten, loa lưới,
 * núm chỉnh và chân đế. Màn hình chính là carousel Embla (kéo/vuốt, loop, tự chạy).
 * Có lớp phản chiếu kính + scanline mờ cho ra chất TV.
 * Tôn trọng prefers-reduced-motion (tắt tự chạy).
 */
export default function BannerSlider({ photos }: { photos: Photo[] }) {
  // Chỉ chiếu SLIDESHOW_LIMIT ảnh đầu trên "màn hình TV" (editor hiển thị đúng
  // giới hạn này để người biên tập biết ảnh nào sẽ lên sóng).
  const slides = photos.slice(0, SLIDESHOW_LIMIT);

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

  // Thư viện rỗng -> ẩn cả khối.
  if (slides.length === 0) return null;

  return (
    <section
      aria-label="Khoảnh khắc chương trình"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-gradient-to-b from-cream to-[#e7ddc9] px-4 py-16 dark:from-[#0c1712] dark:to-[#0a120e] sm:px-6"
    >
      <div className="group relative w-full max-w-5xl">
        {/* Ăng-ten */}
        <div className="pointer-events-none absolute -top-16 left-1/2 z-0 h-16 w-40 -translate-x-1/2 sm:-top-24 sm:h-24 sm:w-56">
          <span className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-[#2d4531] shadow-inner" />
          <span className="absolute bottom-1 left-1/2 h-16 w-[3px] origin-bottom -rotate-[28deg] rounded-full bg-gradient-to-t from-[#2d4531] to-[#7fae7f] sm:h-24" />
          <span className="absolute bottom-1 left-1/2 h-16 w-[3px] origin-bottom rotate-[28deg] rounded-full bg-gradient-to-t from-[#2d4531] to-[#7fae7f] sm:h-24" />
        </div>

        {/* Thân TV */}
        <div className="relative z-10 rounded-[2rem] bg-gradient-to-b from-[#3a5a40] to-[#243a29] p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-black/20 sm:p-5">
          <div className="flex gap-3 sm:gap-4">
            {/* Khung màn hình */}
            <div className="min-w-0 flex-1 rounded-2xl bg-black p-2 shadow-inner ring-1 ring-white/5 sm:p-3">
              <div className="relative overflow-hidden rounded-xl bg-black">
                {/* Viewport Embla */}
                <div className="overflow-hidden" ref={emblaRef}>
                  <div className="flex touch-pan-y">
                    {slides.map((s, i) => (
                      <div
                        key={s.src}
                        className="relative aspect-[4/3] min-w-0 flex-[0_0_100%] sm:aspect-video"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={s.src}
                          alt={s.caption ?? ""}
                          loading={i === 0 ? "eager" : "lazy"}
                          decoding="async"
                          className="h-full w-full select-none object-cover"
                          draggable={false}
                        />
                        {/* Lớp tối + chữ mô tả */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/60 to-transparent px-4 pb-9 pt-10 sm:px-6 sm:pb-10">
                          <p className="text-base font-semibold leading-snug text-white drop-shadow sm:text-xl md:text-2xl">
                            {s.caption}
                          </p>
                          {s.desc && (
                            <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-white/85 drop-shadow sm:text-sm md:text-base">
                              {s.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ánh phản chiếu kính + scanline mờ */}
                <div className="pointer-events-none absolute inset-0 z-10 rounded-xl bg-[linear-gradient(115deg,rgba(255,255,255,0.14)_0%,transparent_28%,transparent_100%)]" />
                <div className="pointer-events-none absolute inset-0 z-10 rounded-xl opacity-[0.06] [background-image:repeating-linear-gradient(0deg,#fff_0_1px,transparent_1px_3px)]" />
                <div className="pointer-events-none absolute inset-0 z-10 rounded-xl shadow-[inset_0_0_60px_rgba(0,0,0,0.55)]" />

                {/* Prev / Next */}
                <button
                  onClick={scrollPrev}
                  aria-label="Ảnh trước"
                  className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition hover:bg-white/35 focus-visible:opacity-100 group-hover:opacity-100 sm:left-3 sm:h-10 sm:w-10"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
                <button
                  onClick={scrollNext}
                  aria-label="Ảnh sau"
                  className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white opacity-0 backdrop-blur transition hover:bg-white/35 focus-visible:opacity-100 group-hover:opacity-100 sm:right-3 sm:h-10 sm:w-10"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </button>

                {/* Dots */}
                <div className="absolute inset-x-0 bottom-2.5 z-20 flex items-center justify-center gap-2">
                  {snaps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollTo(i)}
                      aria-label={`Đến ảnh ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === selected ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bảng điều khiển bên phải (ẩn trên mobile) */}
            <div className="hidden w-24 flex-col items-center justify-between py-1 md:flex lg:w-28">
              <div className="text-center">
                <p className="font-display text-sm font-extrabold tracking-widest text-cream/90">
                  LANGBIANG
                </p>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-cream/50">
                  TV
                </p>
              </div>

              {/* Núm chỉnh */}
              <div className="flex flex-col items-center gap-4">
                {[0, 1].map((k) => (
                  <span
                    key={k}
                    className="relative h-10 w-10 rounded-full bg-gradient-to-br from-[#e8dcc0] to-[#b9a888] shadow-[inset_0_2px_3px_rgba(255,255,255,0.6),0_3px_6px_rgba(0,0,0,0.4)]"
                  >
                    <span
                      className="absolute left-1/2 top-1 h-3.5 w-[3px] -translate-x-1/2 rounded-full bg-[#6b5d43]"
                      style={{ transform: `translateX(-50%) rotate(${k ? 40 : -35}deg)`, transformOrigin: "center 140%" }}
                    />
                  </span>
                ))}
                {/* Đèn nguồn */}
                <span className="h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.7)]" />
              </div>

              {/* Loa lưới */}
              <div className="h-14 w-full rounded-md bg-[#1c2c20] opacity-90 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0_2px,transparent_2px_5px)]" />
            </div>
          </div>
        </div>

        {/* Chân đế TV */}
        <div className="relative z-0 mx-auto flex w-2/3 max-w-sm justify-between">
          <span className="h-6 w-3 origin-top -rotate-[18deg] rounded-b-lg bg-gradient-to-b from-[#243a29] to-[#182a1c] sm:h-8" />
          <span className="h-6 w-3 origin-top rotate-[18deg] rounded-b-lg bg-gradient-to-b from-[#243a29] to-[#182a1c] sm:h-8" />
        </div>
      </div>
    </section>
  );
}
