"use client";

import { useEffect, useState } from "react";

/**
 * Nút cuộn lên đầu trang — đặt ngay phía trên nút chuyển theme (góc phải dưới).
 * Chỉ hiện khi người dùng đã cuộn xuống một đoạn.
 */
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      onClick={toTop}
      aria-label="Lên đầu trang"
      title="Lên đầu trang"
      tabIndex={show ? 0 : -1}
      className={`glass glass-adaptive fixed right-6 bottom-[5.5rem] z-[9997] flex h-[52px] w-[52px] items-center justify-center rounded-full text-leaf-deep shadow-soft transition-all duration-300 hover:scale-110 hover:text-sunset dark:text-leaf-bright dark:hover:text-sun ${
        show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 19V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
