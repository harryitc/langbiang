"use client";

import { useEffect, useRef } from "react";

/**
 * Ảnh "trôi nổi" đặt ở hai dải trống trái/phải trên màn hình lớn.
 * Vì nội dung chính căn giữa (max-w-7xl), hai bên còn khoảng trống — tận dụng
 * để thả vài tấm ảnh kỷ niệm, xoay nhẹ, float + parallax khi cuộn.
 * Không chắn thao tác (pointer-events-none), chỉ hiện từ màn hình rộng trở lên.
 */

type Float = {
  src: string;
  side: "left" | "right";
  top: string; // vị trí dọc theo chiều cao trang
  width: string;
  rotate: number;
  opacity: number;
  speed: number; // hệ số parallax (px trôi trên mỗi px cuộn)
  delay: string; // lệch pha animation float
};

const floats: Float[] = [
  { src: "/gallery/g2.jpg", side: "left", top: "6%", width: "clamp(96px,9vw,150px)", rotate: -6, opacity: 0.85, speed: -0.05, delay: "0s" },
  { src: "/gallery/g7.jpg", side: "left", top: "34%", width: "clamp(88px,8vw,138px)", rotate: 5, opacity: 0.7, speed: 0.06, delay: "1.2s" },
  { src: "/gallery/g10.jpg", side: "left", top: "62%", width: "clamp(96px,9vw,150px)", rotate: -4, opacity: 0.8, speed: -0.04, delay: "2.4s" },
  { src: "/gallery/g4.jpg", side: "right", top: "14%", width: "clamp(96px,9vw,150px)", rotate: 6, opacity: 0.82, speed: 0.05, delay: "0.6s" },
  { src: "/gallery/g6.jpg", side: "right", top: "44%", width: "clamp(88px,8vw,138px)", rotate: -5, opacity: 0.7, speed: -0.06, delay: "1.8s" },
  { src: "/gallery/g11.jpg", side: "right", top: "76%", width: "clamp(96px,9vw,150px)", rotate: 4, opacity: 0.82, speed: 0.04, delay: "3s" },
];

export default function SideFloats() {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const layer = layerRef.current;
    if (!layer) return;
    const items = Array.from(
      layer.querySelectorAll<HTMLElement>("[data-speed]")
    );
    let raf = 0;

    const update = () => {
      raf = 0;
      const y = window.scrollY;
      for (const el of items) {
        const speed = parseFloat(el.dataset.speed || "0");
        el.style.setProperty("--py", `${y * speed}px`);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 hidden overflow-hidden min-[1600px]:block"
    >
      {floats.map((f, i) => (
        <div
          key={i}
          data-speed={f.speed}
          className="absolute"
          style={{
            top: f.top,
            [f.side]: "clamp(8px, 2vw, 48px)",
            width: f.width,
            opacity: f.opacity,
            transform: "translateY(var(--py, 0px))",
          }}
        >
          {/* lớp float (tự nhấp nhô) tách khỏi lớp parallax để không ghi đè transform */}
          <div className="animate-float" style={{ animationDelay: f.delay }}>
            <div
              className="overflow-hidden rounded-2xl shadow-soft ring-1 ring-white/50 dark:ring-white/10"
              style={{ transform: `rotate(${f.rotate}deg)` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={f.src}
                alt=""
                loading="lazy"
                decoding="async"
                className="block aspect-[3/4] w-full object-cover"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
