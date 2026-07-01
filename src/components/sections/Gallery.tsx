import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import { gallery } from "@/lib/site";

const icons = ["🌕", "😊", "🎁", "🏮", "🎏", "🤝", "⛰️", "👋"];

export default function Gallery() {
  return (
    <section id="gallery" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep">
            Khoảnh khắc
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl">
            Lưu giữ những{" "}
            <span className="text-gradient-green">nụ cười</span>
          </h2>
          <p className="mt-4 text-lg text-forest/75">
            Album hình ảnh sẽ được cập nhật liên tục trước và trong hành trình.
          </p>
        </Reveal>

        <Reveal
          childrenStagger
          stagger={0.08}
          className="mt-14 columns-2 gap-5 sm:columns-3 lg:columns-4 [&>*]:mb-5"
        >
          {gallery.map((g, i) => (
            <div key={g.caption} className="break-inside-avoid">
              <Placeholder
                label={g.caption}
                icon={icons[i % icons.length]}
                ratio={g.tall ? "aspect-[3/4]" : "aspect-square"}
              />
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
