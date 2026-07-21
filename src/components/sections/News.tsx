"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Reveal from "@/components/Reveal";
import type { NewsPost } from "@/lib/content/schema";

type NewsProps = {
  /** Dòng tin đọc từ content store (mới nhất trước). */
  posts: NewsPost[];
  /** Số năm hiện tại — dùng cho copy "mùa {năm}" (Phụ lục A, nhóm A1). */
  currentYear: number;
  /** Ẩn phần tiêu đề chung (dùng khi trang phụ đã có tiêu đề riêng). */
  showHeading?: boolean;
  /** Trang chủ: hiển thị dạng carousel ngang + nút "Xem tất cả", ẩn form đăng ký bản tin. */
  carousel?: boolean;
  /** Giới hạn số lượng tin hiển thị. */
  limit?: number;
};

function NewsCard({ post }: { post: NewsPost }) {
  return (
    <Link
      href={`/tin-tuc/${post.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white/70 shadow-sm ring-1 ring-leaf/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-deep dark:bg-white/[0.04] dark:ring-leaf-bright/10"
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
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="mt-2 text-lg font-bold leading-snug text-forest dark:text-ink">
          {post.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-forest/75 dark:text-ink/70">
          {post.excerpt}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-deep transition group-hover:gap-2.5 dark:text-leaf-bright">
          Đọc tiếp
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

export default function News({
  posts,
  currentYear,
  showHeading = true,
  carousel = false,
  limit,
}: NewsProps) {
  const maxPosts = limit ?? (carousel ? 5 : undefined);
  const displayedPosts = maxPosts ? posts.slice(0, maxPosts) : posts;
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Embla cho chế độ carousel (trang chủ)
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
    containScroll: "trimSnaps",
  });
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);
  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setSnaps(emblaApi.scrollSnapList());
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApi]);

  return (
    <section id="news" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        {showHeading && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
              Bản tin
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
            {/* Carousel Embla — mới nhất trước, kéo/vuốt mượt */}
            <div className="relative mt-10 sm:mt-14">
              <div className="overflow-hidden" ref={emblaRef}>
                <div className="-ml-5 flex touch-pan-y">
                  {displayedPosts.map((post) => (
                    <div
                      key={post.id}
                      className="min-w-0 flex-[0_0_86%] pl-5 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                    >
                      <NewsCard post={post} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Prev / Next — hiện trên màn lớn */}
              <button
                onClick={scrollPrev}
                aria-label="Tin trước"
                className="absolute -left-3 top-[38%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-leaf-deep shadow-soft ring-1 ring-leaf/15 transition hover:-translate-y-1/2 hover:scale-105 disabled:opacity-40 lg:flex dark:bg-night-2 dark:text-leaf-bright dark:ring-leaf-bright/15"
                disabled={selected === 0}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                aria-label="Tin sau"
                className="absolute -right-3 top-[38%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-leaf-deep shadow-soft ring-1 ring-leaf/15 transition hover:-translate-y-1/2 hover:scale-105 disabled:opacity-40 lg:flex dark:bg-night-2 dark:text-leaf-bright dark:ring-leaf-bright/15"
                disabled={selected >= snaps.length - 1}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>

            {/* Dots + Xem tất cả */}
            <div className="mt-6 flex flex-col items-center gap-5">
              {snaps.length > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {snaps.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => scrollTo(i)}
                      aria-label={`Đến nhóm tin ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${i === selected
                          ? "w-6 bg-leaf-deep dark:bg-leaf-bright"
                          : "w-2 bg-leaf/30 hover:bg-leaf/50 dark:bg-leaf-bright/30"
                        }`}
                    />
                  ))}
                </div>
              )}
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
            {displayedPosts.map((post) => (
              <NewsCard key={post.id} post={post} />
            ))}
          </Reveal>
        )}

        {/* Bản tin — đăng ký nhận tin (chỉ ở trang tin tức đầy đủ) */}
        {/* {!carousel && (
          <Reveal className="mt-14">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-leaf-deep to-leaf p-7 text-white shadow-soft sm:p-10">
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10" />
              <div className="relative flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="max-w-md text-center md:text-left">
                  <h3 className="font-display text-3xl font-bold">Đăng ký bản tin</h3>
                  <p className="mt-1 text-white/85">
                    Nhận thông tin mới nhất về hành trình mùa {currentYear} và cách bạn
                    có thể đồng hành.
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
        )} */}
      </div>
    </section>
  );
}
