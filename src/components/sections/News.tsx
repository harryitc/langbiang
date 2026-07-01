"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { news, site } from "@/lib/site";

export default function News() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section id="news" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Tin tức & Bản tin
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Câu chuyện từ{" "}
            <span className="text-gradient-green">hành trình</span>
          </h2>
          <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
            Những dòng nhật ký, hình ảnh và tin tức mới nhất về Trăng Sáng Langbiang.
          </p>
        </Reveal>

        <Reveal
          childrenStagger
          className="mt-14 grid gap-7 md:grid-cols-3"
        >
          {news.map((post) => (
            <article
              key={post.title}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white/70 shadow-sm ring-1 ring-leaf/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.img}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-leaf-deep/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  {post.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <time className="text-xs font-semibold uppercase tracking-wide text-forest/50 dark:text-ink/50">
                  {post.date}
                </time>
                <h3 className="mt-2 text-lg font-bold leading-snug text-forest dark:text-ink">
                  {post.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-forest/75 dark:text-ink/70">
                  {post.excerpt}
                </p>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-deep transition hover:gap-2.5 dark:text-leaf-bright"
                >
                  Đọc trên Fanpage
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </Reveal>

        {/* Bản tin — đăng ký nhận tin */}
        <Reveal className="mt-14">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-leaf-deep to-leaf p-8 text-white shadow-soft sm:p-10">
            <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
            <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="max-w-md text-center md:text-left">
                <h3 className="font-display text-3xl font-bold">Đăng ký bản tin</h3>
                <p className="mt-1 text-white/85">
                  Nhận thông tin mới nhất về hành trình mùa 2026 và cách bạn có thể
                  đồng hành.
                </p>
              </div>
              {subscribed ? (
                <p className="flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 font-semibold">
                  💚 Cảm ơn bạn đã đăng ký!
                </p>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubscribed(true);
                  }}
                  className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email của bạn"
                    className="w-full rounded-full border-0 bg-white/90 px-5 py-3 text-forest outline-none ring-2 ring-transparent transition placeholder:text-forest/40 focus:ring-white"
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 rounded-full bg-white px-6 py-3 font-semibold text-leaf-deep transition hover:bg-cream"
                  >
                    Đăng ký
                  </button>
                </form>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
