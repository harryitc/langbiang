"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const nav = [
  { href: "#about", label: "Về dự án" },
  { href: "#journey", label: "Hành trình" },
  { href: "#activities", label: "Hoạt động" },
  { href: "#timeline", label: "Lịch trình" },
  { href: "#gallery", label: "Khoảnh khắc" },
  { href: "#faq", label: "Hỏi đáp" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass shadow-soft py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo />
          <span className="leading-tight">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-leaf-deep/70">
              Dự án tình nguyện
            </span>
            <span className="font-display text-xl font-bold text-leaf-deep">
              Trăng sáng Langbiang
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-forest/80 transition hover:bg-leaf/15 hover:text-leaf-deep"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#register"
            className="ml-2 rounded-full bg-gradient-to-r from-leaf to-grass px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-105"
          >
            Đăng ký
          </a>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-leaf-deep lg:hidden"
          aria-label="Mở menu"
          aria-expanded={open}
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-current transition ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="glass mx-4 mt-2 flex flex-col rounded-2xl p-3">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-forest/85 transition hover:bg-leaf/15"
            >
              {n.label}
            </a>
          ))}
          <a
            href="#register"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-xl bg-gradient-to-r from-leaf to-grass px-4 py-3 text-center text-sm font-semibold text-white"
          >
            Đăng ký tham gia
          </a>
        </nav>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <span className="relative flex h-11 w-11 items-center justify-center">
      <svg viewBox="0 0 48 48" className="h-11 w-11" aria-label={site.name}>
        <defs>
          <linearGradient id="lg-blue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6cc5e0" />
            <stop offset="1" stopColor="#2b7bbd" />
          </linearGradient>
          <linearGradient id="lg-green" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7cc34a" />
            <stop offset="1" stopColor="#2e7d32" />
          </linearGradient>
        </defs>
        <circle cx="30" cy="12" r="6" fill="#f5a623" />
        <path
          d="M8 40 C 8 20, 24 10, 40 10 C 40 30, 26 42, 8 40 Z"
          fill="url(#lg-green)"
        />
        <path
          d="M8 40 C 8 26, 18 18, 30 16 C 26 30, 20 38, 8 40 Z"
          fill="url(#lg-blue)"
          opacity="0.9"
        />
      </svg>
    </span>
  );
}
