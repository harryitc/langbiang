"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type NavItem = { href: string; label: string };

/**
 * Header trang phụ: trong suốt lúc đầu (nằm trên nền hero), khi cuộn xuống
 * >30px mới chuyển sang nền kính mờ + đổ bóng — giống hành vi Header trang chủ.
 */
export default function SubPageHeader({ nav = [] }: { nav?: NavItem[] }) {
  const [scrolled, setScrolled] = useState(false);

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
        <Link
          href="/"
          className="flex items-center gap-2 text-leaf-deep dark:text-leaf-bright"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          <span className="font-display text-lg font-bold">Trang chủ</span>
        </Link>

        {nav.length > 0 && (
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="rounded-full px-3.5 py-2 text-sm font-medium text-forest/80 transition hover:bg-leaf/15 hover:text-leaf-deep dark:text-ink/80 dark:hover:bg-leaf-bright/10 dark:hover:text-leaf-bright"
              >
                {n.label}
              </a>
            ))}
          </nav>
        )}

        <Link
          href="/#register"
          className="rounded-full bg-gradient-to-r from-leaf to-grass px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-105"
        >
          Đăng ký 2026
        </Link>
      </div>
    </header>
  );
}
