"use client";

import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgFullscreen from "lightgallery/plugins/fullscreen";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-fullscreen.css";

import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import { gallery2025 as gallery } from "@/lib/gallery2025";

export default function Gallery() {
  return (
    <section id="gallery" className="relative py-24 sm:py-32">
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
            Những hình ảnh có thật từ hành trình Trăng Sáng Langbiang mùa đầu tiên.
            <span className="hidden sm:inline"> Bấm vào ảnh để xem lớn hơn.</span>
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <LightGallery
            speed={450}
            plugins={[lgZoom, lgThumbnail, lgFullscreen]}
            licenseKey="0000-0000-0000-0000"
            download={false}
            mobileSettings={{ controls: true, showCloseIcon: true, download: false }}
            elementClassNames="columns-2 gap-5 sm:columns-3 lg:columns-4 [&>*]:mb-5"
          >
            {gallery.map((g) => (
              <a
                key={g.src}
                href={g.src}
                data-sub-html={`<div class="lg-sub">${g.caption}</div>`}
                aria-label={`Xem ảnh: ${g.caption}`}
                className="group relative block break-inside-avoid cursor-pointer rounded-3xl outline-none focus-visible:ring-4 focus-visible:ring-leaf/40"
              >
                <Photo
                  src={g.src}
                  alt={g.caption}
                  ratio={g.tall ? "aspect-[3/4]" : "aspect-square"}
                />
                {/* icon phóng to khi hover */}
                <span className="pointer-events-none absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
                  </svg>
                </span>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 text-sm font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {g.caption}
                </span>
              </a>
            ))}
          </LightGallery>
        </Reveal>
      </div>
    </section>
  );
}
