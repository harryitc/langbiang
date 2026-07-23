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

function isLeaderMember(m: Member) {
  return m.isLeader || m.role?.toLowerCase().includes("trưởng ban");
}

/**
 * Hiển thị trưởng ban tổ chức theo dạng gallery căn giữa.
 * Kích thước nhỏ hơn FounderGallery (md = w-48 sm:w-56 → dùng w-36 sm:w-44).
 * Chỉ render nếu có ít nhất 1 leader trong danh sách members.
 */
export default function OrgLeadGallery({ members }: { members: Member[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lgRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInit = (detail: any) => {
    lgRef.current = detail.instance;
  };

  // Lọc ra các trưởng ban
  const leaders = (members ?? []).filter(isLeaderMember);

  // Không render nếu không có ai
  if (leaders.length === 0) return null;

  // Chỉ mở gallery ảnh khi có ảnh
  const withPhoto = leaders.filter((m) => m?.photo);
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
      <div className="mx-auto mb-12 mt-10 max-w-4xl px-5 sm:px-6">
        {/* Flex row căn giữa — nếu có nhiều trưởng ban thì xếp ngang */}
        <div className="flex flex-wrap content-start items-start justify-center gap-10 sm:gap-14">
          {leaders.map((m, idx) => {
            const hasPhoto = Boolean(m.photo);
            const wClass = "w-36 sm:w-44";

            return (
              <div
                key={m.name + idx}
                className="flex w-44 flex-col items-center self-start text-center sm:w-52"
              >
                {/* Khung ảnh + badges */}
                <div className="relative">
                  {/* Icon Facebook */}
                  {m.facebook && (
                    <a
                      href={m.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Facebook của ${m.name}`}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-2 right-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-[#1877F2]/10 text-[#1877F2] transition-all duration-200 hover:scale-110 hover:bg-[#1877F2] hover:text-white dark:bg-white/10 dark:text-white dark:hover:bg-[#1877F2]"
                    >
                      <svg className="h-3 w-3 fill-current" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  )}

                  {/* Ảnh chân dung */}
                  <div
                    onClick={() => hasPhoto && openAt(m)}
                    className={`group relative aspect-[4/5] ${wClass} overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass shadow-lg ring-4 ring-white/70 dark:ring-white/10 ${
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
                      <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-white sm:text-3xl">
                        {initials(m.name)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Thông tin */}
                <h3 className="font-display mt-4 text-2xl font-extrabold tracking-tight text-forest dark:text-ink sm:text-3xl">
                  {m.name}
                </h3>
                {m.role && (
                  <p className="mt-1 text-sm font-semibold text-leaf-deep dark:text-leaf-bright sm:text-base">
                    {m.role}
                  </p>
                )}
                {m.bio && (
                  <p className="mt-2 w-full text-sm leading-relaxed text-forest/70 dark:text-ink/75 sm:text-base">
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
