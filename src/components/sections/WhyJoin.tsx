import Reveal from "@/components/Reveal";
import { whyJoin } from "@/lib/site";

export default function WhyJoin() {
  return (
    <section id="why" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Tại sao nên tham gia?
          </span>
          <p className="mt-4 text-base text-forest/75 sm:text-lg dark:text-ink/75">
            Đồng hành cùng Trăng Sáng Langbiang, bạn không chỉ cho đi mà còn nhận
            về thật nhiều yêu thương.
          </p>
        </Reveal>

        <Reveal
          childrenStagger
          className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4"
        >
          {whyJoin.map((r) => (
            <div
              key={r.title}
              className="flex flex-col rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-leaf/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf/15 to-sun/15 text-3xl">
                {r.icon}
              </span>
              <h3 className="mt-4 text-lg font-bold text-forest dark:text-ink">
                {r.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-forest/75 dark:text-ink/70">
                {r.desc}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
