"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import { sponsorTiers, type Sponsor } from "@/lib/site";

// tạo initials từ tên đơn vị cho logo placeholder
function initials(name: string) {
  return name
    .replace(/^(Công ty|Tập đoàn|CLB|Nhóm|Hội|Quán|Xưởng|Vận Tải)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function SponsorLogo({ s, onClick }: { s: Sponsor; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={s.name}
      className="group flex min-w-[150px] flex-1 items-center gap-3 rounded-2xl bg-white/70 p-4 text-left shadow-sm ring-1 ring-leaf/10 transition hover:-translate-y-1 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10 sm:max-w-[240px]"
    >
      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-leaf/20 to-sun/20 text-sm font-extrabold text-leaf-deep dark:text-leaf-bright">
        {s.logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.logo} alt={s.name} className="h-full w-full object-contain" />
        ) : (
          initials(s.name)
        )}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-forest/85 dark:text-ink/85">
          {s.name}
        </span>
        <span className="text-xs text-leaf-deep/70 dark:text-leaf-bright/70">
          Xem giới thiệu →
        </span>
      </span>
    </button>
  );
}

export default function Sponsors() {
  const [active, setActive] = useState<Sponsor | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <section id="sponsors" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-sun/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sunset">
            Đơn vị đồng hành
          </span>
          <h2 className="text-2xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Cảm ơn những{" "}
            <span className="text-gradient-sun">tấm lòng vàng</span>
          </h2>
          <p className="mt-4 text-base text-forest/75 sm:text-lg dark:text-ink/75">
            Bấm vào từng đơn vị để xem lời giới thiệu. Sự đồng hành của các đơn vị
            giúp ánh trăng của chúng mình toả sáng hơn.
          </p>
        </Reveal>

        <div className="mt-12 space-y-10 sm:mt-14 sm:space-y-12">
          {sponsorTiers.map((tier) => (
            <Reveal key={tier.tier}>
              <div className="mb-5 flex items-center gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-leaf-deep dark:text-leaf-bright">
                  {tier.tier}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-leaf/40 to-transparent" />
              </div>
              <div className="flex flex-wrap gap-4 sm:gap-5">
                {tier.sponsors.map((s) => (
                  <SponsorLogo key={s.name} s={s} onClick={() => setActive(s)} />
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <div className="inline-flex flex-col items-center gap-3 rounded-3xl bg-leaf/5 px-6 py-7 ring-1 ring-leaf/15 dark:bg-white/[0.03] dark:ring-leaf-bright/10 sm:px-8">
            <p className="text-lg font-semibold text-forest dark:text-ink">
              Trở thành đơn vị đồng hành mùa 2026?
            </p>
            <p className="max-w-md text-forest/70 dark:text-ink/70">
              Đồng hành cùng Trăng Sáng Langbiang để lan toả yêu thương đến nhiều
              em nhỏ hơn nữa.
            </p>
            <a
              href="/#register"
              className="mt-1 rounded-full bg-gradient-to-r from-sunset to-sun px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Liên hệ tài trợ ✨
            </a>
          </div>
        </Reveal>
      </div>

      {/* Modal giới thiệu đơn vị */}
      {active && (
        <div
          className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Giới thiệu ${active.name}`}
          onClick={() => setActive(null)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative w-full max-w-md rounded-3xl bg-cream p-7 shadow-soft dark:bg-night-2 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActive(null)}
              aria-label="Đóng"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-leaf/10 text-forest transition hover:bg-leaf/20 dark:bg-white/10 dark:text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <span className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-leaf/20 to-sun/20 text-xl font-extrabold text-leaf-deep dark:text-leaf-bright">
              {active.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={active.logo} alt={active.name} className="h-full w-full object-contain" />
              ) : (
                initials(active.name)
              )}
            </span>
            <h3 className="mt-4 text-xl font-bold text-forest dark:text-ink">
              {active.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-forest/80 dark:text-ink/80">
              {active.intro ?? "Đơn vị đồng hành cùng Trăng Sáng Langbiang."}
            </p>
            {active.url && active.url !== "#" && (
              <a
                href={active.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:brightness-110"
              >
                Ghé thăm
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
