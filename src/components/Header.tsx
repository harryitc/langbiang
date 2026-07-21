"use client";

import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  /** Tên dự án (dùng cho alt của logo). */
  siteName: string;
  /** Logo từ admin; bỏ trống -> dùng logo mặc định. */
  logo?: string;
  /** Danh mục năm đã qua, đã sắp mới → cũ (FR4). Rỗng thì ẩn dropdown "Năm". */
  pastYears: number[];
};

const nav = [
  { href: "#about", label: "Về dự án" },
  { href: "/chuong-trinh", label: "Chương trình" },
  { href: "/gay-quy", label: "Đóng góp" },
  { href: "/ban-to-chuc", label: "Ban tổ chức" },
  { href: "/tin-tuc", label: "Tin tức" },
];

export default function Header({ siteName, logo, pastYears }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [yearsOpen, setYearsOpen] = useState(false);
  const yearsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đóng dropdown "Năm" khi bấm ra ngoài hoặc nhấn Esc.
  useEffect(() => {
    if (!yearsOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!yearsRef.current?.contains(e.target as Node)) setYearsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setYearsOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [yearsOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? "glass glass-adaptive shadow-soft py-2" : "bg-transparent py-4"
        }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <a href="#top" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <Logo siteName={siteName} logo={logo} />
          <span className="min-w-0 leading-tight">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-leaf-deep/70 sm:text-[11px] dark:text-leaf-bright/70">
              Dự án tình nguyện
            </span>
            <span className="block truncate font-display text-lg font-bold text-leaf-deep sm:text-xl dark:text-leaf-bright">
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

          {/* Dropdown "Năm" — danh mục năm đã qua (FR4); rỗng thì ẩn */}
          {pastYears.length > 0 && (
            <div ref={yearsRef} className="relative">
              <button
                type="button"
                onClick={() => setYearsOpen((v) => !v)}
                aria-expanded={yearsOpen}
                aria-haspopup="menu"
                className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-forest/80 transition hover:bg-leaf/15 hover:text-leaf-deep dark:text-ink/80 dark:hover:bg-leaf-bright/10 dark:hover:text-leaf-bright"
              >
                Ký ức
                <svg
                  viewBox="0 0 24 24"
                  className={`h-3.5 w-3.5 transition-transform ${yearsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>

              {yearsOpen && (
                <div
                  role="menu"
                  className="glass glass-adaptive absolute right-0 top-full mt-2 min-w-[160px] rounded-2xl p-2 shadow-soft"
                >
                  {pastYears.map((y) => (
                    <a
                      key={y}
                      role="menuitem"
                      href={`/${y}`}
                      onClick={() => setYearsOpen(false)}
                      className="block rounded-xl px-4 py-2.5 text-sm font-medium text-forest/85 transition hover:bg-leaf/15 hover:text-leaf-deep dark:text-ink/85 dark:hover:bg-leaf-bright/10 dark:hover:text-leaf-bright"
                    >
                      Mùa {y}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

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
              className={`block h-0.5 w-6 bg-current transition ${open ? "translate-y-2 rotate-45" : ""
                }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition ${open ? "opacity-0" : ""
                }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""
                }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${open ? "max-h-[32rem]" : "max-h-0"
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

          {/* Năm đã qua — trên mobile liệt kê thẳng, không cần dropdown */}
          {pastYears.length > 0 && (
            <>
              <span className="mt-2 px-4 pb-1 text-[11px] font-bold uppercase tracking-widest text-forest/45 dark:text-ink/45">
                Năm
              </span>
              {pastYears.map((y) => (
                <a
                  key={y}
                  href={`/${y}`}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-forest/85 transition hover:bg-leaf/15 dark:text-ink/85 dark:hover:bg-leaf-bright/10"
                >
                  Mùa {y}
                </a>
              ))}
            </>
          )}

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

function Logo({ siteName, logo }: { siteName: string; logo?: string }) {
  return (
    <span className="relative flex h-11 w-11 items-center justify-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logo?.trim() || "/logo-mark.png"}
        alt={siteName}
        width={44}
        height={44}
        className="object-cover"
      />
    </span>
  );
}
