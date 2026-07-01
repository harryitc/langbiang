import Reveal from "@/components/Reveal";
import { sponsorTiers } from "@/lib/site";

// tạo initials từ tên đơn vị cho logo placeholder
function initials(name: string) {
  return name
    .replace(/^(Công ty|Tập đoàn|CLB|Nhóm|Hội|Quán|Xưởng|Vận Tải)\s+/i, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function Sponsors() {
  return (
    <section id="sponsors" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-sun/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sunset">
            Nhà tài trợ & đồng hành
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Cảm ơn những{" "}
            <span className="text-gradient-sun">tấm lòng vàng</span>
          </h2>
          <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
            Sự đồng hành của các đơn vị đã giúp ánh trăng của chúng mình toả sáng
            hơn trong mùa 2025.
          </p>
        </Reveal>

        <div className="mt-14 space-y-12">
          {sponsorTiers.map((tier) => (
            <Reveal key={tier.tier}>
              <div className="mb-5 flex items-center gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-leaf-deep dark:text-leaf-bright">
                  {tier.tier}
                </h3>
                <div className="h-px flex-1 bg-gradient-to-r from-leaf/40 to-transparent" />
              </div>
              <div className="flex flex-wrap gap-5">
                {tier.sponsors.map((s) => (
                  <div
                    key={s.name}
                    title={s.name}
                    className="group flex min-w-[150px] flex-1 items-center gap-3 rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-leaf/10 transition hover:-translate-y-1 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10 sm:max-w-[220px]"
                  >
                    <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-leaf/20 to-sun/20 text-sm font-extrabold text-leaf-deep dark:text-leaf-bright">
                      {initials(s.name)}
                    </span>
                    <span className="text-sm font-semibold text-forest/85 dark:text-ink/85">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <div className="inline-flex flex-col items-center gap-3 rounded-3xl bg-leaf/5 px-8 py-7 ring-1 ring-leaf/15 dark:bg-white/[0.03] dark:ring-leaf-bright/10">
            <p className="text-lg font-semibold text-forest dark:text-ink">
              Trở thành nhà tài trợ mùa 2026?
            </p>
            <p className="max-w-md text-forest/70 dark:text-ink/70">
              Đồng hành cùng Trăng Sáng Langbiang để lan toả yêu thương đến nhiều
              em nhỏ hơn nữa.
            </p>
            <a
              href="#register"
              className="mt-1 rounded-full bg-gradient-to-r from-sunset to-sun px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Liên hệ tài trợ ✨
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
