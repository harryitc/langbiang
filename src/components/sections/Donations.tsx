import Reveal from "@/components/Reveal";
import { donations } from "@/lib/site";

export default function Donations({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="danh-sach" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-6">
        {showHeading && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-sun/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sunset">
              Tri ân
            </span>
            <h2 className="text-2xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
              Danh sách{" "}
              <span className="text-gradient-sun">đóng góp</span>
            </h2>
            <p className="mt-4 text-base text-forest/75 sm:text-lg dark:text-ink/75">
              Xin trân trọng cảm ơn những tấm lòng đã đồng hành cùng Trăng Sáng
              Langbiang.
            </p>
          </Reveal>
        )}

        <Reveal childrenStagger className="mt-10 space-y-3 sm:mt-14">
          {donations.map((d, i) => (
            <div
              key={`${d.name}-${i}`}
              className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl bg-white/80 px-5 py-4 shadow-sm ring-1 ring-leaf/10 dark:bg-white/[0.04] dark:ring-leaf-bright/10"
            >
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-leaf/20 to-sun/20 text-base">
                💚
              </span>
              <span className="min-w-0 flex-1 font-semibold text-forest dark:text-ink">
                {d.name}
              </span>
              <span className="font-bold text-leaf-deep dark:text-leaf-bright">
                {d.amount ?? d.gift}
              </span>
              <span className="w-full text-xs text-forest/55 dark:text-ink/50 sm:w-auto sm:text-right">
                {d.date}
              </span>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-8 text-center">
          <p className="text-sm text-forest/60 dark:text-ink/60">
            Danh sách mang tính minh hoạ — sẽ cập nhật đầy đủ trong mùa 2026. 💚
          </p>
        </Reveal>
      </div>
    </section>
  );
}
