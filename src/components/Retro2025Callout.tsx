import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function Retro2025Callout() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <Link
            href="/2025"
            className="group relative block overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-leaf/15 dark:ring-leaf-bright/15"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gallery/team.jpg"
              alt="Nhìn lại mùa Trăng Sáng Langbiang 2025"
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 sm:aspect-[16/9] lg:aspect-[21/9]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest/90 via-forest/55 to-forest/25 sm:bg-gradient-to-r sm:from-forest/85 sm:via-forest/55 sm:to-forest/20" />

            <div className="absolute inset-0 flex flex-col justify-end gap-3 p-6 sm:justify-center sm:p-12">
              <span className="w-fit rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                Nhìn lại mùa 2025
              </span>
              <h2 className="max-w-xl font-display text-3xl font-bold text-white drop-shadow sm:text-5xl">
                Cả một hành trình yêu thương
              </h2>
              <p className="max-w-md text-sm text-white/85 sm:text-base">
                Khoảnh khắc, đội ngũ tình nguyện viên, nhà tài trợ và những câu
                chuyện đẹp của mùa đầu tiên.
              </p>
              <span className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-forest transition group-hover:gap-3">
                Xem toàn bộ 2025
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
