import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import SubPageHeader from "@/components/SubPageHeader";
import Footer from "@/components/sections/Footer";
import NewsActions from "@/components/NewsActions";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content/store";
import { sanitizeHtml } from "@/lib/content/html";
import { absoluteUrl } from "@/lib/content/url";
import { site } from "@/lib/site";
import type { NewsPost } from "@/lib/content/schema";

type Params = { id: string };

/**
 * Ảnh bìa của bài: khung 16:9 nên cắt riêng, bài nào chưa đặt thì dùng lại
 * ảnh thumbnail (khung 16:10 — hụt nhẹ trên dưới nhưng vẫn dùng được).
 */
function anhBia(post: NewsPost): string {
  return post.coverImg?.trim() || post.img;
}

export async function generateStaticParams(): Promise<Params[]> {
  const { news } = await getContent();
  return news.map((post) => ({ id: post.id }));
}

/** Tìm bài viết theo slug trong content store. */
async function getPost(id: string) {
  const { news } = await getContent();
  return news.find((post) => post.id === id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Không tìm thấy tin tức" };

  // FR8-R1: SEO của bài tin tự sinh theo tiêu đề/tóm tắt/ảnh của bài.
  const { main } = await getContent();
  const url = `${site.url}/tin-tuc/${post.id}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/tin-tuc/${post.id}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: main.site.name,
      type: "article",
      locale: "vi_VN",
      images: [{ url: anhBia(post), alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [anhBia(post)],
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const content = await getContent();
  const { news, currentYear } = content;
  const post = news.find((p) => p.id === id);
  if (!post) notFound();

  // Nội dung dài lưu dạng HTML (CKEditor); chưa có thì dùng tóm tắt.
  const bodyHtml = sanitizeHtml(post.bodyHtml ?? `<p>${post.excerpt}</p>`);
  const related = news.filter((p) => p.id !== post.id).slice(0, 3);

  // JSON-LD cho bài viết
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    image: absoluteUrl(anhBia(post)),
    articleSection: post.tag,
    mainEntityOfPage: `${site.url}/tin-tuc/${post.id}`,
    datePublished: post.date,
    publisher: {
      "@type": "Organization",
      name: content.main.site.name,
    },
  };

  return (
    <>
      <SmoothScroll />
      {/* <Cursor /> */}
      <ThemeToggle />
      <BackToTop />
      <SubPageHeader
        nav={[{ href: "/tin-tuc", label: "Tất cả tin tức" }]}
        currentYear={currentYear}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-gradient-to-b from-sky-soft/60 via-cream to-cream dark:from-[#0a1626] dark:via-night dark:to-night">
        <article className="mx-auto max-w-3xl px-5 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-32">
          {/* Breadcrumb / quay lại */}
          <Link
            href="/tin-tuc"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-deep transition hover:gap-2.5 dark:text-leaf-bright"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            Tất cả tin tức
          </Link>

          {/* Tiêu đề */}
          <header className="mt-6">
            <span className="inline-block rounded-full bg-leaf/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wide text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
              {post.tag}
            </span>
            {/* Font thường (không dùng font-display) cho khớp tiêu đề trên thẻ tin. */}
            <h1 className="mt-4 text-3xl font-bold leading-tight text-forest sm:text-4xl md:text-5xl dark:text-ink">
              {post.title}
            </h1>
          </header>

          {/* Ảnh bìa */}
          <div className="mt-8 overflow-hidden rounded-3xl shadow-soft ring-1 ring-leaf/10 dark:ring-leaf-bright/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={anhBia(post)}
              alt={post.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          {/* Nội dung — HTML rich text đã sanitize */}
          <div
            className="tsl-prose mt-10 text-lg leading-relaxed text-forest/85 dark:text-ink/80"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />

          {/* Nút thích / sao chép link */}
          <div className="mt-10 border-t border-leaf/10 pt-8 dark:border-leaf-bright/10">
            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-forest/50 dark:text-ink/50">
              Bạn thấy bài viết ý nghĩa? Hãy lan toả nhé!
            </p>
            <NewsActions id={post.id} />
          </div>

          {/* Tin liên quan */}
          {related.length > 0 && (
            <Reveal className="mt-16">
              <h2 className="text-xl font-bold text-forest dark:text-ink">
                Tin khác
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/tin-tuc/${p.id}`}
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white/70 ring-1 ring-leaf/10 transition hover:-translate-y-1 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.img}
                        alt={p.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="p-4 text-sm font-bold leading-snug text-forest dark:text-ink">
                      {p.title}
                    </h3>
                  </Link>
                ))}
              </div>
            </Reveal>
          )}
        </article>
      </main>

      <Footer />
    </>
  );
}
