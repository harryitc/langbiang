import Reveal from "@/components/Reveal";
import Placeholder from "@/components/Placeholder";
import { Daisy } from "@/components/Decor";

export default function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Ảnh */}
        <Reveal className="relative">
          <div className="relative">
            <Placeholder
              label="Ảnh dự án Trăng sáng Langbiang"
              ratio="aspect-[4/5]"
              icon="🌕"
              className="shadow-soft"
            />
            <div className="glass glass-adaptive absolute -bottom-6 -right-4 max-w-[220px] rounded-2xl p-4 shadow-soft sm:-right-8">
              <p className="font-display text-3xl font-bold text-leaf-deep dark:text-leaf-bright">
                Mùa 2 · 2026
              </p>
              <p className="mt-1 text-sm text-forest/75 dark:text-ink/75">
                Trở lại Langbiang với thật nhiều yêu thương.
              </p>
            </div>
            <Daisy className="absolute -left-4 -top-4 animate-float" size={44} />
          </div>
        </Reveal>

        {/* Nội dung */}
        <Reveal childrenStagger>
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Về dự án
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Mang ánh trăng ấm áp{" "}
            <span className="text-gradient-green">đến với núi rừng</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-forest/80 dark:text-ink/80">
            <strong>Trăng sáng Langbiang</strong> là dự án tình nguyện phi lợi
            nhuận, mang một mùa Trung thu trọn vẹn đến các em nhỏ vùng cao tại
            phường Langbiang – Đà Lạt, tỉnh Lâm Đồng.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-forest/80 dark:text-ink/80">
            Năm trước, chúng mình đã cùng nhau thắp sáng những nụ cười trong đêm
            hội Trăng rằm. Năm nay, hành trình yêu thương ấy tiếp tục — với những
            phần quà, sân chơi và cả những ước mơ được chắp cánh.
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              ["🌙", "Đêm hội Trung thu trọn vẹn"],
              ["💚", "Sẻ chia yêu thương vùng cao"],
              ["🤝", "Kết nối những trái tim thiện nguyện"],
              ["🌿", "Gìn giữ thiên nhiên cao nguyên"],
            ].map(([icon, text]) => (
              <li
                key={text}
                className="flex items-center gap-3 rounded-2xl bg-white/60 p-3 shadow-sm ring-1 ring-leaf/10 dark:bg-white/5 dark:ring-leaf-bright/10"
              >
                <span className="text-2xl">{icon}</span>
                <span className="text-sm font-semibold text-forest/85 dark:text-ink/85">
                  {text}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
