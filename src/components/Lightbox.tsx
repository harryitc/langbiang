"use client";

import { useCallback, useEffect, useState } from "react";

export type LightboxItem = { src: string; caption: string };

export default function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const open = index !== null;
  const [show, setShow] = useState(false);

  const go = useCallback(
    (dir: number) => {
      if (index === null) return;
      onNavigate((index + dir + items.length) % items.length);
    },
    [index, items.length, onNavigate]
  );

  // hiệu ứng mở + khóa cuộn nền + phím tắt
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => setShow(true));
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(id);
      setShow(false);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, go, onClose]);

  if (!open || index === null) return null;
  const item = items[index];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      onClick={onClose}
      className={`fixed inset-0 z-[10000] flex items-center justify-center p-4 transition-opacity duration-300 sm:p-8 ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background: "rgba(6, 15, 11, 0.86)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Đóng */}
      <button
        onClick={onClose}
        aria-label="Đóng"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* Đếm */}
      <span className="absolute left-4 top-6 text-sm font-semibold text-white/70 sm:left-8">
        {index + 1} / {items.length}
      </span>

      {/* Trước */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        aria-label="Ảnh trước"
        className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-5"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {/* Sau */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        aria-label="Ảnh sau"
        className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-5"
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Ảnh */}
      <figure
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-full max-w-5xl flex-col items-center transition-all duration-300 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={item.src}
          src={item.src}
          alt={item.caption}
          className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
        />
        <figcaption className="mt-4 text-center text-sm font-medium text-white/85 sm:text-base">
          {item.caption}
        </figcaption>
      </figure>
    </div>
  );
}
