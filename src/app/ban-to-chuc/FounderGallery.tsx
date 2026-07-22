"use client";

import { useRef } from "react";
import Image from "next/image";
import LightGallery from "lightgallery/react";
import lgZoom from "lightgallery/plugins/zoom";
import lgFullscreen from "lightgallery/plugins/fullscreen";
import lgThumbnail from "lightgallery/plugins/thumbnail";

import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-fullscreen.css";
import "lightgallery/css/lg-thumbnail.css";

import type { Member } from "@/lib/content/schema";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1]?.[0] ?? "";
  const first = parts.length > 1 ? parts[parts.length - 2]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export default function FounderGallery({ founders }: { founders: Member[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lgRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInit = (detail: any) => {
    lgRef.current = detail.instance;
  };

  const withPhoto = (founders ?? []).filter((m) => m?.photo);

  const dynamicEl = withPhoto.map((m) => ({
    src: m.photo!,
    thumb: m.photo!,
    subHtml: `<div class="lg-sub"><strong>${m.name}</strong> ${m.role ? `— ${m.role}` : ""}</div>`,
  }));

  const openAt = (m: Member) => {
    const idx = withPhoto.findIndex((f) => f.name === m.name);
    if (idx >= 0) lgRef.current?.openGallery(idx);
  };

  return (
    <>
      <div className="relative mx-auto mt-12 max-w-3xl px-5 sm:px-6">
        <div className="flex flex-col gap-12 sm:gap-16">
          {founders.map((m, idx) => {
            const isLeader = m.isLeader || m.role?.toLowerCase().includes("trưởng ban");
            const hasPhoto = Boolean(m.photo);

            return (
              <div
                key={m.name + idx}
                className="group flex flex-col items-center rounded-3xl bg-white/70 p-6 text-center shadow-sm backdrop-blur ring-1 ring-leaf/10 transition duration-300 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10 sm:p-8"
              >
                {/* Khung ảnh chân dung lớn */}
                <div className="relative mb-6">
                  {/* Ngôi sao Trưởng ban góc trên bên trái ảnh (ngôi sao vẽ tay) */}
                  {isLeader && (
                    <div
                      title="Trưởng ban"
                      className="pointer-events-none absolute -left-4 -top-4 z-20 drop-shadow-md"
                    >
                      <svg width="48" height="48" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M22 4 C22 4 23.5 10 27 13 C31 16.5 38 16 38 16 C38 16 33 19.5 31.5 23.5 C30 27.5 32 34 32 34 C32 34 27 30 22 30 C17 30 12 34 12 34 C12 34 14 27.5 12.5 23.5 C11 19.5 6 16 6 16 C6 16 13 16.5 17 13 C20.5 10 22 4 22 4 Z"
                          fill="#f5a623"
                          stroke="#e8870a"
                          strokeWidth="1.2"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M22 7 C22.5 10.5 24.5 12.5 27.5 14.5"
                          stroke="#fff"
                          strokeWidth="1"
                          strokeLinecap="round"
                          opacity="0.5"
                        />
                      </svg>
                    </div>
                  )}


                  {/* Icon Facebook bên trong góc dưới bên phải ảnh */}
                  {m.facebook && (
                    <a
                      href={m.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Facebook của ${m.name}`}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-2 right-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] transition-all duration-200 hover:scale-110 hover:bg-[#1877F2] hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-[#1877F2]"
                    >
                      <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}

                  {/* Khung ảnh chân dung chữ nhật bo góc lớn (bấm mở ảnh rộng) */}
                  <div
                    onClick={() => hasPhoto && openAt(m)}
                    className={`relative aspect-[4/5] w-56 overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass shadow-md ring-4 ring-white/80 dark:ring-white/10 sm:w-64 ${
                      hasPhoto ? "cursor-pointer" : ""
                    }`}
                  >
                    {m.photo ? (
                      <Image
                        src={m.photo}
                        alt={m.name}
                        fill
                        unoptimized
                        loading="lazy"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-3xl font-bold text-white sm:text-4xl">
                        {initials(m.name)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Họ tên */}
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-forest dark:text-ink sm:text-3xl md:text-4xl">
                  {m.name}
                </h3>

                {/* Vai trò */}
                {m.role && (
                  <p className="mt-1.5 text-base font-semibold text-leaf-deep dark:text-leaf-bright sm:text-lg">
                    {m.role}
                  </p>
                )}

                {/* Nội dung / Giới thiệu */}
                {m.bio && (
                  <p className="mt-4 max-w-2xl text-base leading-relaxed text-forest/80 dark:text-ink/80 sm:text-lg">
                    {m.bio}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* LightGallery dynamic */}
      <LightGallery
        onInit={onInit}
        dynamic
        dynamicEl={dynamicEl}
        speed={450}
        plugins={[lgZoom, lgFullscreen, lgThumbnail]}
        licenseKey="0000-0000-0000-0000"
        download={false}
        mobileSettings={{ controls: true, showCloseIcon: true, download: false }}
      />
    </>
  );
}
