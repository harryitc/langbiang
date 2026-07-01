"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/site";

const nav = [
  { href: "#about", label: "Về dự án" },
  { href: "#activities", label: "Hoạt động" },
  { href: "#timeline", label: "Lịch trình" },
  { href: "/2025", label: "Mùa 2025" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/gay-quy", label: "Gây quỹ" },
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
        scrolled ? "glass glass-adaptive shadow-soft py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo />
          <span className="leading-tight">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-leaf-deep/70 dark:text-leaf-bright/70">
              Dự án tình nguyện
            </span>
            <span className="font-display text-xl font-bold text-leaf-deep dark:text-leaf-bright">
              Trăng sáng Langbiang
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-forest/80 transition hover:bg-leaf/15 hover:text-leaf-deep dark:text-ink/80 dark:hover:bg-leaf-bright/10 dark:hover:text-leaf-bright"
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
          className="flex h-10 w-10 items-center justify-center rounded-full text-leaf-deep dark:text-leaf-bright lg:hidden"
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
        <nav className="glass glass-adaptive mx-4 mt-2 flex flex-col rounded-2xl p-3">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-sm font-medium text-forest/85 transition hover:bg-leaf/15 dark:text-ink/85 dark:hover:bg-leaf-bright/10"
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
    <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl shadow-sm ring-1 ring-white/50 dark:ring-white/10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mark.png"
        alt={site.name}
        width={44}
        height={44}
        className="h-11 w-11 object-cover"
      />
    </span>
  );
}
