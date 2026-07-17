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
import { site } from "@/lib/site";
import { getContent } from "@/lib/content/store";
import { isAdmin } from "@/lib/admin-auth";

type Params = { id: string };
type Search = { preview?: string };

// Đọc từ content store (Redis) nên render động; hỗ trợ xem trước bản nháp.
export const dynamic = "force-dynamic";

async function resolvePreview(searchParams: Promise<Search> | undefined) {
  const sp = searchParams ? await searchParams : {};
  return sp.preview === "1" && (await isAdmin());
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<Search>;
}): Promise<Metadata> {
  const { id } = await params;
  const preview = await resolvePreview(searchParams);
  const { news } = await getContent(preview);
  const post = news.find((p) => p.id === id);
  if (!post) return { title: "Không tìm thấy tin tức" };

  const url = `${site.url}/tin-tuc/${post.id}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/tin-tuc/${post.id}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      siteName: site.name,
      type: "article",
      locale: "vi_VN",
      images: [{ url: post.img, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.img],
    },
  };
}

export default async function NewsDetailPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams?: Promise<Search>;
}) {
  const { id } = await params;
  const preview = await resolvePreview(searchParams);
  const { news } = await getContent(preview);
  const post = news.find((p) => p.id === id);
  if (!post) notFound();

  const paragraphs = post.body ?? [post.excerpt];
  const related = news.filter((p) => p.id !== post.id).slice(0, 3);

  // JSON-LD cho bài viết
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    image: `${site.url}${post.img}`,
    articleSection: post.tag,
    mainEntityOfPage: `${site.url}/tin-tuc/${post.id}`,
    publisher: {
      "@type": "Organization",
      name: site.name,
    },
  };

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <ThemeToggle />
      <BackToTop />
      <SubPageHeader nav={[{ href: "/tin-tuc", label: "Tất cả tin tức" }]} />

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
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-forest sm:text-4xl md:text-5xl dark:text-ink">
              {post.title}
            </h1>
          </header>

          {/* Ảnh bìa */}
          <div className="mt-8 overflow-hidden rounded-3xl shadow-soft ring-1 ring-leaf/10 dark:ring-leaf-bright/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.img}
              alt={post.title}
              className="aspect-[16/9] w-full object-cover"
            />
          </div>

          {/* Nội dung */}
          <div className="mt-10 space-y-5 text-lg leading-relaxed text-forest/85 dark:text-ink/80">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

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
