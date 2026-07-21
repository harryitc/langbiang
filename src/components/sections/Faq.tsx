"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import type { Faq as FaqItem } from "@/lib/content/schema";

export default function Faq({ faqs }: { faqs: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative pb-24 sm:pb-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal className="text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Hỏi đáp
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Câu hỏi <span className="text-gradient-green">thường gặp</span>
          </h2>
        </Reveal>

        <Reveal childrenStagger className="mt-12 space-y-4">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className="overflow-hidden rounded-2xl bg-white/70 ring-1 ring-leaf/10 dark:bg-white/[0.04] dark:ring-leaf-bright/10"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                aria-expanded={open === i}
              >
                <span className="text-lg font-bold text-forest dark:text-ink">{f.q}</span>
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-leaf/15 text-leaf-deep transition dark:bg-leaf-bright/15 dark:text-leaf-bright ${open === i ? "rotate-45" : ""
                    }`}
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              <div
                className={`grid transition-all duration-300 ${open === i ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-5 leading-relaxed text-forest/75 dark:text-ink/70">
                    {f.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
