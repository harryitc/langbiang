import Reveal from "@/components/Reveal";
import { Daisy } from "@/components/Decor";
import { sanitizeHtml } from "@/lib/content/html";

/**
 * Tổng kết một mùa đã qua — nội dung rich text (CKEditor) lưu ở
 * pastYears[].summaryHtml. HTML được sanitize trước khi nhúng.
 * Phần rỗng thì ẩn (FR4).
 */
export default function RetroSummary({
  html,
  title,
  year,
}: {
  html: string;
  title: string;
  year: number;
}) {
  const safeHtml = sanitizeHtml(html);
  if (!safeHtml.trim()) return null;

  return (
    <section className="relative py-24 sm:py-32">
      <span id="summary" aria-hidden className="block" />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto mb-16 max-w-3xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Tổng kết hành trình
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Trăng Sáng Langbiang {year}
            <span className="mt-2 block font-display text-2xl font-bold text-gradient-green sm:text-3xl">
              {title}
            </span>
          </h2>
        </Reveal>

        <Reveal className="relative mx-auto max-w-4xl">
          <div className="relative rounded-3xl bg-leaf/5 p-6 ring-1 ring-leaf/10 dark:bg-white/[0.02] dark:ring-leaf-bright/10 sm:p-10">
            <div
              className="tsl-prose text-base leading-relaxed text-forest/85 dark:text-ink/80 sm:text-lg"
              dangerouslySetInnerHTML={{ __html: safeHtml }}
            />
            <Daisy className="absolute -bottom-4 right-6 animate-float" size={32} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
