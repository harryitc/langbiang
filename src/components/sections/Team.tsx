import Reveal from "@/components/Reveal";
import { Daisy } from "@/components/Decor";

export default function Team() {
  return (
    <section className="relative py-24 sm:py-32">
      <span id="team" aria-hidden className="block" />
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Đại gia đình
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Một tập thể,{" "}
            <span className="text-gradient-green">một trái tim</span>
          </h2>
          <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
            Những con người xa lạ, cùng chung một tấm lòng, đã trở thành gia đình
            dưới ánh trăng Langbiang.
          </p>
        </Reveal>

        <Reveal>
          <figure className="group relative overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-leaf/15 dark:ring-leaf-bright/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gallery/team.jpg"
              alt="Đại gia đình tình nguyện Trăng Sáng Langbiang chụp ảnh chung"
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] sm:aspect-[16/10] md:aspect-[2/1]"
            />
            {/* Lớp phủ gradient để chữ nổi */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Nội dung overlay */}
            <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <div className="flex flex-col items-start gap-2">
                <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  Trăng Sáng Langbiang · Mùa 2025
                </span>
                <p className="font-display text-3xl font-bold text-white drop-shadow sm:text-5xl">
                  Cảm ơn vì đã cùng nhau
                </p>
                <p className="max-w-xl text-sm text-white/85 sm:text-base">
                  Mỗi thành viên là một mảnh ghép làm nên hành trình yêu thương. Và
                  năm nay, chúng mình lại tiếp tục — cùng bạn.
                </p>
              </div>
            </figcaption>

            <Daisy className="absolute right-6 top-6 opacity-90 drop-shadow" size={40} />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
