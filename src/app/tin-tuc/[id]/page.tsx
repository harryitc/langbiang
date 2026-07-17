import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubPageShell from "@/components/SubPageShell";
import NewsActions from "@/components/NewsActions";
import Reveal from "@/components/Reveal";
import { getNewsById, news, site } from "@/lib/site";

type Params = { id: string };

export function generateStaticParams(): Params[] {
  return news.map((post) => ({ id: post.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = getNewsById(id);
  if (!post) return { title: "Không tìm thấy tin tức" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/tin-tuc/${post.id}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${site.url}/tin-tuc/${post.id}`,
      images: [{ url: post.img }],
      type: "article",
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const post = getNewsById(id);
  if (!post) notFound();

  const paragraphs = post.body ?? [post.excerpt];
  const related = news.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <SubPageShell
      eyebrow={post.tag}
      title={post.title}
      subtitle={post.excerpt}
      bgImage={post.img}
      nav={[{ href: "/tin-tuc", label: "← Tất cả tin tức" }]}
    >
      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-6 sm:py-20">
        {/* Ảnh bìa */}
        <Reveal>
          <div className="overflow-hidden rounded-3xl shadow-soft ring-1 ring-leaf/10 dark:ring-leaf-bright/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.img}
              alt={post.title}
              className="aspect-[16/10] w-full object-cover"
            />
          </div>
        </Reveal>

        {/* Nội dung */}
        <Reveal className="mt-10 space-y-5 text-lg leading-relaxed text-forest/85 dark:text-ink/80">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </Reveal>

        {/* Nút thích / chia sẻ */}
        <Reveal className="mt-10 border-t border-leaf/10 pt-8 dark:border-leaf-bright/10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-forest/50 dark:text-ink/50">
            Bạn thấy bài viết ý nghĩa? Hãy lan toả nhé!
          </p>
          <NewsActions id={post.id} title={post.title} fbLink={post.link} />
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-leaf-deep transition hover:gap-2.5 dark:text-leaf-bright"
          >
            Xem bài gốc trên Fanpage
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </Reveal>

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
    </SubPageShell>
  );
}
