import Reveal from "@/components/Reveal";
import PhotoLightbox from "@/components/PhotoLightbox";
import { Daisy } from "@/components/Decor";
import { getContent } from "@/lib/content/store";
import { fillYear } from "@/lib/content/year";

export default async function About() {
  const { main, currentYear } = await getContent();
  // Chữ của mục này do admin nhập (main.about).
  const about = main.about;

  return (
    <section className="relative pb-24 sm:pb-32 pt-12 sm:pt-16">
      <span id="about" aria-hidden className="block" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Ảnh */}
        <Reveal className="relative">
          <div className="relative">
            {/* Ảnh mục Giới thiệu — đổi trong admin (Ảnh trang chủ).
                Bấm vào để xem lớn. */}
            <PhotoLightbox
              src={main.aboutImage?.trim() || "/gallery/about.jpg"}
              alt="Tình nguyện viên Trăng Sáng Langbiang bên các em nhỏ vùng cao"
              caption={`${about.title} ${about.titleHighlight}`}
              ratio="aspect-[4/5]"
              priority
              className="shadow-soft"
            />
            {(about.badgeTitle?.trim() || about.badgeNote?.trim()) && (
              <div className="glass glass-adaptive absolute -bottom-6 -right-4 max-w-[220px] rounded-2xl p-4 shadow-soft sm:-right-8">
                {about.badgeTitle?.trim() && (
                  <p className="font-display text-3xl font-bold text-leaf-deep dark:text-leaf-bright">
                    {fillYear(about.badgeTitle, currentYear)}
                  </p>
                )}
                {about.badgeNote?.trim() && (
                  <p className="mt-1 text-sm text-forest/75 dark:text-ink/75">
                    {about.badgeNote}
                  </p>
                )}
              </div>
            )}
            <Daisy className="absolute -left-4 -top-4 animate-float" size={44} />
          </div>
        </Reveal>

        {/* Nội dung */}
        <Reveal childrenStagger>
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            {about.eyebrow}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-forest sm:text-4xl md:text-5xl dark:text-ink">
            {about.title}{" "}
            <span className="text-gradient-green">{about.titleHighlight}</span>
          </h2>
          {about.paragraphs.map((para, i) => (
            <p
              key={i}
              className={`${i === 0 ? "mt-5" : "mt-4"} text-lg leading-relaxed text-forest/80 dark:text-ink/80`}
            >
              {para}
            </p>
          ))}

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#register"
              className="rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-110"
            >
              {about.ctaPrimaryLabel}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
