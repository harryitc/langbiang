"use client";

// Ảnh bấm vào để xem lớn (phóng to, toàn màn hình) — dùng cho những chỗ chỉ có
// MỘT ảnh đứng riêng, không phải lưới ảnh như mục "Khoảnh khắc".
import { useRef } from "react";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgFullscreen from "lightgallery/plugins/fullscreen";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-fullscreen.css";

import Photo from "@/components/Photo";

export default function PhotoLightbox({
  src,
  alt,
  caption,
  ratio,
  priority,
  className = "",
}: {
  src: string;
  alt: string;
  /** Dòng chú thích hiện dưới ảnh khi xem lớn. */
  caption?: string;
  ratio?: string;
  priority?: boolean;
  className?: string;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lgRef = useRef<any>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => lgRef.current?.openGallery(0)}
        aria-label={`Xem ảnh lớn: ${alt}`}
        className="group/lb relative block w-full cursor-pointer rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-leaf/40"
      >
        <Photo src={src} alt={alt} ratio={ratio} priority={priority} className={className} />
        {/* Kính lúp hiện khi rê chuột — cho biết ảnh bấm được. */}
        <span className="pointer-events-none absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover/lb:opacity-100">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
          </svg>
        </span>
      </button>

      <LightGallery
        onInit={(detail) => {
          lgRef.current = detail.instance;
        }}
        dynamic
        dynamicEl={[
          {
            src,
            thumb: src,
            subHtml: caption ? `<div class="lg-sub">${caption}</div>` : "",
          },
        ]}
        speed={450}
        plugins={[lgZoom, lgFullscreen]}
        licenseKey="0000-0000-0000-0000"
        download={false}
        counter={false}
        mobileSettings={{ controls: false, showCloseIcon: true, download: false }}
      />
    </>
  );
}
