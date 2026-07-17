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

import { board as defaultBoard } from "@/lib/site";
import type { Board } from "@/lib/content/schema";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1]?.[0] ?? "";
  const first = parts.length > 1 ? parts[parts.length - 2]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export default function FounderGallery({ board = defaultBoard }: { board?: Board }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lgRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onInit = (detail: any) => { lgRef.current = detail.instance; };

  const [lead, ...coFounders] = board.founders;

  // Chỉ đưa vào gallery những ảnh có thật
  const withPhoto = [lead, ...coFounders].filter((m) => m?.photo);

  const dynamicEl = withPhoto.map((m) => ({
    src: m.photo!,
    thumb: m.photo!,
    subHtml: `<div class="lg-sub"><strong>${m.name}</strong> — ${m.role}</div>`,
  }));

  // Tìm index trong gallery (chỉ tính ảnh có photo)
  const galleryIndex = (m: typeof lead) => withPhoto.findIndex((f) => f.name === m?.name);
  const openAt = (m: typeof lead) => {
    const idx = galleryIndex(m);
    if (idx >= 0) lgRef.current?.openGallery(idx);
  };

  return (
    <>
      {/* Trưởng ban */}
      {lead && (
        <div
          className="absolute top-1/2 hidden -translate-y-1/2 cursor-pointer lg:block"
          style={{ rotate: "-3deg", right: "28%", width: "clamp(200px, 18vw, 320px)", isolation: "isolate" }}
          onClick={() => openAt(lead)}
        >
          <div
            className="relative rounded-3xl bg-gradient-to-br from-[#c8e6c0] to-[#a5d6a7] shadow-[0_12px_48px_rgba(0,0,0,0.18)] ring-1 ring-leaf/30 transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
            style={{ padding: "clamp(10px, 0.8vw, 16px)" }}
          >
            {/* Ngôi sao vẽ tay góc trái */}
            <div className="absolute -top-5 -left-5 pointer-events-none">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 4 C22 4 23.5 10 27 13 C31 16.5 38 16 38 16 C38 16 33 19.5 31.5 23.5 C30 27.5 32 34 32 34 C32 34 27 30 22 30 C17 30 12 34 12 34 C12 34 14 27.5 12.5 23.5 C11 19.5 6 16 6 16 C6 16 13 16.5 17 13 C20.5 10 22 4 22 4 Z"
                  fill="#f5a623" stroke="#e8870a" strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M22 7 C22.5 10.5 24.5 12.5 27.5 14.5" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
              </svg>
            </div>
            <div
              className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass font-bold text-white"
              style={{ height: "clamp(240px, 22vw, 420px)", fontSize: "clamp(1.2rem, 2vw, 2rem)" }}
            >
              {lead.photo ? (
                <Image src={lead.photo} alt={lead.name} fill className="object-cover" />
              ) : <span className="flex h-full w-full items-center justify-center">{initials(lead.name)}</span>}
            </div>
            <div className="pb-1 text-center" style={{ paddingTop: "clamp(8px, 0.6vw, 14px)" }}>
              <span className="mb-0.5 inline-flex items-center rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-3 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">Trưởng ban</span>
              <p className="font-display font-bold text-forest" style={{ fontSize: "clamp(1.1rem, 1.4vw, 1.5rem)" }}>{lead.name}</p>
              <p className="text-forest/60" style={{ fontSize: "clamp(0.8rem, 0.9vw, 1rem)" }}>{lead.role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Đồng sáng lập 1 */}
      {coFounders[0] && (
        <div
          className="absolute hidden cursor-pointer lg:block"
          style={{ rotate: "4deg", top: "6%", right: "7%", width: "clamp(150px, 13vw, 240px)", isolation: "isolate" }}
          onClick={() => openAt(coFounders[0])}
        >
          <div
            className="rounded-3xl bg-gradient-to-br from-[#e8f5e3] to-[#d4edda] shadow-[0_10px_36px_rgba(0,0,0,0.14)] ring-1 ring-leaf/20 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(0,0,0,0.18)]"
            style={{ padding: "clamp(8px, 0.6vw, 14px)" }}
          >
            <div
              className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass font-bold text-white"
              style={{ height: "clamp(180px, 16vw, 300px)", fontSize: "clamp(1rem, 1.5vw, 1.5rem)" }}
            >
              {coFounders[0].photo ? (
                <Image src={coFounders[0].photo} alt={coFounders[0].name} fill className="object-cover" />
              ) : <span className="flex h-full w-full items-center justify-center">{initials(coFounders[0].name)}</span>}
            </div>
            <div className="pb-1 text-center" style={{ paddingTop: "clamp(6px, 0.5vw, 10px)" }}>
              <p className="font-display font-bold text-forest" style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.25rem)" }}>{coFounders[0].name}</p>
              <p className="text-forest/60" style={{ fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)" }}>{coFounders[0].role}</p>
            </div>
          </div>
        </div>
      )}

      {/* Đồng sáng lập 2 */}
      {coFounders[1] && (
        <div
          className="absolute hidden cursor-pointer lg:block"
          style={{ rotate: "-2deg", bottom: "5%", right: "8%", width: "clamp(150px, 13vw, 240px)", isolation: "isolate" }}
          onClick={() => openAt(coFounders[1])}
        >
          <div
            className="rounded-3xl bg-gradient-to-br from-[#e8f5e3] to-[#d4edda] shadow-[0_10px_36px_rgba(0,0,0,0.14)] ring-1 ring-leaf/20 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(0,0,0,0.18)]"
            style={{ padding: "clamp(8px, 0.6vw, 14px)" }}
          >
            <div
              className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass font-bold text-white"
              style={{ height: "clamp(180px, 16vw, 300px)", fontSize: "clamp(1rem, 1.5vw, 1.5rem)" }}
            >
              {coFounders[1].photo ? (
                <Image src={coFounders[1].photo} alt={coFounders[1].name} fill className="object-cover" />
              ) : <span className="flex h-full w-full items-center justify-center">{initials(coFounders[1].name)}</span>}
            </div>
            <div className="pb-1 text-center" style={{ paddingTop: "clamp(6px, 0.5vw, 10px)" }}>
              <p className="font-display font-bold text-forest" style={{ fontSize: "clamp(0.95rem, 1.2vw, 1.25rem)" }}>{coFounders[1].name}</p>
              <p className="text-forest/60" style={{ fontSize: "clamp(0.75rem, 0.85vw, 0.9rem)" }}>{coFounders[1].role}</p>
            </div>
          </div>
        </div>
      )}

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
