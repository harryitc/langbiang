import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import Placeholder from "@/components/Placeholder";
import { stats } from "@/lib/site";

export default function Journey() {
  return (
    <section
      id="journey"
      className="relative overflow-hidden bg-gradient-to-b from-leaf-deep to-forest py-24 text-white sm:py-32"
    >
      {/* đốm sáng nền */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute left-[10%] top-[20%] h-40 w-40 rounded-full bg-sun blur-3xl" />
        <div className="absolute right-[12%] top-[50%] h-52 w-52 rounded-full bg-grass blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            Hành trình năm trước
          </span>
          <h2 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
            Những con số{" "}
            <span className="text-gradient-sun">biết nói</span>
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Mùa đầu tiên 2025, chúng mình đã cùng nhau viết nên một câu chuyện đẹp
            giữa cao nguyên Langbiang.
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

        <Reveal
          childrenStagger
          className="mt-12 grid gap-5 sm:grid-cols-3"
        >
          <Placeholder label="Khoảnh khắc 2025" icon="📸" ratio="aspect-[4/3]" />
          <Placeholder label="Trao quà Trung thu" icon="🎁" ratio="aspect-[4/3]" />
          <Placeholder label="Đêm hội Trăng rằm" icon="🌕" ratio="aspect-[4/3]" />
        </Reveal>
      </div>
    </section>
  );
}
