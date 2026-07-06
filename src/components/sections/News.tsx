"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { news, site } from "@/lib/site";

type NewsProps = {
  /** Ẩn phần tiêu đề chung (dùng khi trang phụ đã có tiêu đề riêng). */
  showHeading?: boolean;
  /** Trang chủ: hiển thị dạng carousel ngang + nút "Xem tất cả", ẩn form đăng ký bản tin. */
  carousel?: boolean;
};

function NewsCard({ post }: { post: (typeof news)[number] }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white/70 shadow-sm ring-1 ring-leaf/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10">
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
      <div className="flex flex-1 flex-col p-5 sm:p-6">
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
  );
}

export default function News({ showHeading = true, carousel = false }: NewsProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <section id="news" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        {showHeading && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
              Tin tức & Bản tin
            </span>
            <h2 className="text-2xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
              Câu chuyện từ{" "}
              <span className="text-gradient-green">hành trình</span>
            </h2>
            <p className="mt-4 text-base text-forest/75 sm:text-lg dark:text-ink/75">
              Những dòng nhật ký, hình ảnh và tin tức mới nhất về Trăng Sáng Langbiang.
            </p>
          </Reveal>
        )}

        {carousel ? (
          <>
            {/* Carousel ngang — mới nhất trước, vuốt trên mobile */}
            <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6 sm:mt-14 [&::-webkit-scrollbar]:hidden">
              {news.map((post) => (
                <div
                  key={post.title}
                  className="w-[82%] flex-shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
                >
                  <NewsCard post={post} />
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/tin-tuc"
                className="inline-flex items-center gap-2 rounded-full border-2 border-leaf-deep/25 bg-white/60 px-7 py-3 text-sm font-semibold text-leaf-deep transition hover:-translate-y-0.5 hover:bg-white dark:border-leaf-bright/25 dark:bg-white/5 dark:text-leaf-bright dark:hover:bg-white/10"
              >
                Xem tất cả tin tức
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <Reveal childrenStagger className="mt-10 grid gap-6 sm:mt-14 md:grid-cols-3">
            {news.map((post) => (
              <NewsCard key={post.title} post={post} />
            ))}
          </Reveal>
        )}

        {/* Bản tin — đăng ký nhận tin (chỉ ở trang tin tức đầy đủ) */}
        {!carousel && (
          <Reveal className="mt-14">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-leaf-deep to-leaf p-7 text-white shadow-soft sm:p-10">
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
        )}
      </div>
    </section>
  );
}
