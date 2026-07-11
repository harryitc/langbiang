import Reveal from "@/components/Reveal";
import { board, type Member } from "@/lib/site";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1]?.[0] ?? "";
  const first = parts.length > 1 ? parts[parts.length - 2]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

function MemberCard({ m, featured = false }: { m: Member; featured?: boolean }) {
  return (
    <div
      className={`flex h-full items-start gap-4 rounded-3xl p-5 shadow-sm ring-1 transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:gap-5 sm:p-6 ${
        featured
          ? "bg-gradient-to-br from-leaf/12 to-sun/12 ring-leaf/25 dark:from-leaf-bright/10 dark:to-sun/5 dark:ring-leaf-bright/20"
          : "bg-white/80 ring-leaf/10 dark:bg-white/[0.04] dark:ring-leaf-bright/10"
      }`}
    >
      <span
        className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-leaf to-grass font-bold text-white ring-2 ring-white/60 dark:ring-white/10 ${
          featured
            ? "h-20 w-20 text-xl sm:h-24 sm:w-24 sm:text-2xl"
            : "h-16 w-16 text-lg sm:h-20 sm:w-20 sm:text-xl"
        }`}
      >
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={m.photo}
            alt={m.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
          />
        ) : (
          initials(m.name)
        )}
      </span>
      <div className="min-w-0 flex-1">
        {featured && (
          <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-sun/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-sunset">
            ⭐ Trưởng ban
          </span>
        )}
        <h4
          className={`font-bold text-forest dark:text-ink ${
            featured ? "text-lg sm:text-xl" : "text-base sm:text-lg"
          }`}
        >
          {m.name}
        </h4>
        <p className="mt-0.5 text-sm font-semibold text-leaf-deep dark:text-leaf-bright">
          {m.role}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-forest/75 dark:text-ink/70">
          {m.bio}
        </p>
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div className="mx-auto my-5 h-8 w-px bg-gradient-to-b from-leaf/40 to-leaf/10 dark:from-leaf-bright/30 dark:to-leaf-bright/5 sm:my-6 sm:h-10" />
  );
}

export default function Founders() {
  const [lead, ...coFounders] = board.founders;

  return (
    <section id="founders" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Sáng lập
          </span>
          <h2 className="text-2xl font-extrabold text-forest sm:text-4xl dark:text-ink">
            Những người <span className="text-gradient-green">thắp sáng</span>
          </h2>
          <p className="mt-4 text-base text-forest/75 sm:text-lg dark:text-ink/75">
            Ban sáng lập dẫn dắt hành trình Trăng Sáng Langbiang từ những ngày đầu tiên.
          </p>
        </Reveal>

        {/* Trưởng ban sáng lập */}
        <div className="mt-12">
          {lead && (
            <Reveal className="mx-auto w-full max-w-md">
              <MemberCard m={lead} featured />
            </Reveal>
          )}

          {/* Đồng sáng lập */}
          {coFounders.length > 0 && (
            <>
              <Connector />
              <Reveal
                childrenStagger
                className="mx-auto flex max-w-3xl flex-wrap justify-center gap-5"
              >
                {coFounders.map((m) => (
                  <div
                    key={m.name}
                    className="w-full sm:w-[calc(50%-0.625rem)]"
                  >
                    <MemberCard m={m} />
                  </div>
                ))}
              </Reveal>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
