import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import { gallery } from "@/lib/site";

export default function Gallery() {
  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Khoảnh khắc
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Lưu giữ những{" "}
            <span className="text-gradient-green">nụ cười</span>
          </h2>
          <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
            Những hình ảnh có thật từ hành trình Trăng Sáng Langbiang mùa đầu tiên.
          </p>
        </Reveal>

        <Reveal
          childrenStagger
          stagger={0.08}
          className="mt-14 columns-2 gap-5 sm:columns-3 lg:columns-4 [&>*]:mb-5"
        >
          {gallery.map((g) => (
            <figure key={g.src} className="group relative break-inside-avoid">
              <Photo
                src={g.src}
                alt={g.caption}
                ratio={g.tall ? "aspect-[3/4]" : "aspect-square"}
              />
              <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 p-4 text-sm font-semibold text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {g.caption}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
