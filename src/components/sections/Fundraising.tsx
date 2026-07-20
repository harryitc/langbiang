import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content/store";

export default async function Fundraising({
  showHeading = true,
  bg = true,
}: {
  showHeading?: boolean;
  bg?: boolean;
}) {
  const { main } = await getContent();
  const fundraising = main.fundraising;

  return (
    <section
      id="fundraising"
      className={`relative overflow-hidden py-16 sm:py-24 ${
        bg ? "bg-[#eef8ea] dark:bg-night-2" : ""
      }`}
    >
      {/* đốm sáng nền */}
      <div className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-25">
        <div className="absolute right-[8%] top-[15%] h-40 w-40 rounded-full bg-sun/40 blur-3xl" />
        <div className="absolute left-[10%] bottom-[10%] h-52 w-52 rounded-full bg-leaf/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6">
        {showHeading && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-sun/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-sunset">
              Chung tay gây quỹ
            </span>
            <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
              {fundraising.title}{" "}
              <span className="text-gradient-sun">Trăng Sáng</span>
            </h2>
            <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
              {fundraising.desc}
            </p>
          </Reveal>
        )}

        <Reveal
          childrenStagger
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {fundraising.channels.map((c) => (
            <div
              key={c.name}
              className={`flex flex-col rounded-3xl p-7 shadow-sm ring-1 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft ${
                c.highlight
                  ? "bg-gradient-to-br from-[#ee4d2d] to-[#ff7337] text-white ring-transparent"
                  : "bg-white/80 ring-leaf/10 dark:bg-white/[0.04] dark:ring-leaf-bright/10"
              }`}
            >
              <span className="text-4xl">{c.icon}</span>
              <h3
                className={`mt-4 text-xl font-bold ${
                  c.highlight ? "text-white" : "text-forest dark:text-ink"
                }`}
              >
                {c.name}
              </h3>
              <p
                className={`mt-2 flex-1 text-sm leading-relaxed ${
                  c.highlight ? "text-white/90" : "text-forest/75 dark:text-ink/70"
                }`}
              >
                {c.note}
              </p>
              <a
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                  c.highlight
                    ? "bg-white text-[#ee4d2d] hover:bg-white/90"
                    : "bg-gradient-to-r from-leaf-deep to-leaf text-white hover:brightness-110"
                }`}
              >
                {c.icon === "🛒" && (
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                    <path d="M7 4V2h10v2h3.5l-1 15.2A2.8 2.8 0 0 1 16.7 22H7.3a2.8 2.8 0 0 1-2.8-2.8L3.5 4H7Zm2 0h6V3H9v1Zm-1 5v8h2V9H8Zm5 0v8h2V9h-2Z" />
                  </svg>
                )}
                {c.cta}
              </a>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-10 text-center">
          <p className="text-sm text-forest/60 dark:text-ink/60">
            Mọi đóng góp đều được ghi nhận và công khai minh bạch trên Fanpage của dự án.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
