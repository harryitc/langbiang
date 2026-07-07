import Reveal from "@/components/Reveal";
import { activities } from "@/lib/site";

export default function Activities() {
  return (
    <section className="relative py-24 sm:py-32">
      <span id="activities" aria-hidden className="block" />
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Hoạt động chính
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Chúng mình sẽ{" "}
            <span className="text-gradient-green">cùng nhau làm gì?</span>
          </h2>
          <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
            Hai ngày rực rỡ với thật nhiều hoạt động ý nghĩa dành cho các em nhỏ
            và bà con vùng cao Langbiang.
          </p>
        </Reveal>

        <Reveal
          childrenStagger
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {activities.map((a) => (
            <article
              key={a.title}
              className="group relative overflow-hidden rounded-3xl bg-white/70 p-7 shadow-sm ring-1 ring-leaf/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-leaf/10 transition group-hover:scale-150 dark:bg-leaf-bright/10" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf/20 to-grass/20 text-3xl dark:from-leaf-bright/15 dark:to-grass/15">
                {a.icon}
              </div>
              <h3 className="relative mt-5 text-xl font-bold text-forest dark:text-ink">
                {a.title}
              </h3>
              <p className="relative mt-2 leading-relaxed text-forest/75 dark:text-ink/70">
                {a.desc}
              </p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
