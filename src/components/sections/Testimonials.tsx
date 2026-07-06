import Reveal from "@/components/Reveal";
import { testimonials } from "@/lib/site";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1]?.[0] ?? "";
  const first = parts.length > 1 ? parts[parts.length - 2]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export default function Testimonials({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="cam-nhan" className="relative bg-[#eef8ea] py-16 dark:bg-night-2 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        {showHeading && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
              Cảm nhận
            </span>
            <h2 className="text-2xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
              Tiếng lòng{" "}
              <span className="text-gradient-green">tình nguyện viên</span>
            </h2>
            <p className="mt-4 text-base text-forest/75 sm:text-lg dark:text-ink/75">
              Những chia sẻ chân thật từ các bạn đã cùng chúng mình đi qua mùa
              trăng.
            </p>
          </Reveal>
        )}

        <Reveal
          childrenStagger
          className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col rounded-3xl bg-white/80 p-6 shadow-sm ring-1 ring-leaf/10 dark:bg-white/[0.04] dark:ring-leaf-bright/10"
            >
              <span className="font-display text-5xl leading-none text-leaf/40 dark:text-leaf-bright/40">
                &ldquo;
              </span>
              <blockquote className="-mt-3 flex-1 text-sm leading-relaxed text-forest/85 dark:text-ink/85">
                {t.quote}
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-leaf to-grass text-sm font-bold text-white">
                  {t.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" />
                  ) : (
                    initials(t.name)
                  )}
                </span>
                <span>
                  <span className="block text-sm font-bold text-forest dark:text-ink">
                    {t.name}
                  </span>
                  <span className="block text-xs text-forest/60 dark:text-ink/60">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
