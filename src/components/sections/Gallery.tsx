"use client";

import { useRef } from "react";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgAutoplay from "lightgallery/plugins/autoplay";
import lgRotate from "lightgallery/plugins/rotate";
import lgShare from "lightgallery/plugins/share";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-autoplay.css";
import "lightgallery/css/lg-rotate.css";
import "lightgallery/css/lg-share.css";

import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import type { Photo as PhotoItem } from "@/lib/content/schema";

// Hiện 30 ảnh ở lưới đều (ô vuông) cho cân bằng; phần còn lại xem qua lightbox.
// 30 chia hết cho số cột 2 / 3 / 5 nên hàng luôn đầy, không trống ô.
const VISIBLE = 30;

export default function Gallery({
  photos,
  year,
}: {
  photos: PhotoItem[];
  /** Số năm của mùa đang xem (thuộc "năm đã qua" — không đổi theo năm hiện tại). */
  year: number;
}) {
  const gallery = photos;
  // Instance LightGallery (chế độ dynamic) để mở lightbox theo yêu cầu.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lgRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInit = (detail: any) => {
    lgRef.current = detail.instance;
  };
  const openAt = (i: number) => lgRef.current?.openGallery(i);

  const dynamicEl = gallery.map((g) => ({
    src: g.src,
    thumb: g.src,
    subHtml: `<div class="lg-sub">${g.caption ?? ""}</div>`,
  }));

  const shown = gallery.slice(0, VISIBLE);

  // Phần rỗng thì ẩn (FR4).
  if (gallery.length === 0) return null;

  return (
    <section className="relative py-24 sm:py-32">
      <span id="gallery" aria-hidden className="block" />
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Khoảnh khắc
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Lưu giữ những{" "}
            <span className="text-gradient-green">nụ cười</span>
          </h2>
          <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
            Những hình ảnh có thật từ hành trình Trăng Sáng Langbiang mùa {year}.
            <span className="hidden sm:inline"> Bấm vào ảnh để xem lớn hơn.</span>
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
            {shown.map((g, i) => (
              <button
                key={g.src}
                type="button"
                onClick={() => openAt(i)}
                aria-label={`Xem ảnh: ${g.caption ?? "khoảnh khắc"}`}
                className="group relative block cursor-pointer rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-leaf/40"
              >
                <Photo src={g.src} alt={g.caption ?? ""} ratio="aspect-square" />
                {/* icon phóng to khi hover */}
                <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
                  </svg>
                </span>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 text-left text-sm font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.caption}
                </span>
              </button>
            ))}
          </div>

          {gallery.length > VISIBLE && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => openAt(VISIBLE)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-7 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Xem tất cả {gallery.length} ảnh
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          )}
        </Reveal>
      </div>

      {/* LightGallery ở chế độ dynamic: chứa toàn bộ ảnh của mùa đang xem */}
      <LightGallery
        onInit={onInit}
        dynamic
        dynamicEl={dynamicEl}
        speed={450}
        plugins={[lgZoom, lgThumbnail, lgFullscreen, lgAutoplay, lgRotate, lgShare]}
        licenseKey="0000-0000-0000-0000"
        download={false}
        autoplayFirstVideo={false}
        slideShowAutoplay={false}
        slideShowInterval={3500}
        mobileSettings={{ controls: true, showCloseIcon: true, download: false }}
      />
    </section>
  );
}
