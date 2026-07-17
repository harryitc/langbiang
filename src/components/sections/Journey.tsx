import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Photo from "@/components/Photo";
import type { Photo as PhotoItem, Stat } from "@/lib/content/schema";

export default function Journey({
  stats,
  year,
  photos = [],
}: {
  stats: Stat[];
  /** Số năm của mùa đang xem (nhóm A4 — không đổi theo năm hiện tại). */
  year: number;
  /** Vài ảnh minh hoạ dưới các con số; rỗng thì ẩn. */
  photos?: PhotoItem[];
}) {
  if (stats.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-leaf-deep to-forest py-24 text-white sm:py-32">
      <span id="journey" aria-hidden className="block" />
      {/* đốm sáng nền */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-[10%] top-[20%] h-40 w-40 rounded-full bg-sun blur-3xl" />
        <div className="absolute right-[12%] top-[50%] h-52 w-52 rounded-full bg-grass blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            Hành trình năm {year}
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
            Những con số{" "}
            <span className="text-gradient-sun">biết nói</span>
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Mùa {year}, chúng mình đã cùng nhau viết nên một câu chuyện đẹp giữa cao
            nguyên Langbiang.
          </p>
        </Reveal>

        <Reveal
          childrenStagger
          className="mt-14 grid grid-cols-2 gap-5 lg:grid-cols-4"
        >
          {stats.map((s) => (
            <div
              key={s.label}
              className="glass rounded-3xl p-6 text-center text-forest"
            >
              <div className="font-display text-4xl font-bold text-leaf-deep sm:text-5xl">
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-2 text-sm font-semibold text-forest/75">
                {s.label}
              </p>
            </div>
          ))}
        </Reveal>

        {photos.length > 0 && (
          <Reveal
            childrenStagger
            className="mt-12 grid gap-5 sm:grid-cols-3"
          >
            {photos.map((p) => (
              <Photo
                key={p.src}
                src={p.src}
                alt={p.caption ?? `Khoảnh khắc Langbiang ${year}`}
                ratio="aspect-[4/3]"
              />
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
