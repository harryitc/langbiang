import Reveal from "@/components/Reveal";
import { board, type Member } from "@/lib/site";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1]?.[0] ?? "";
  const first = parts.length > 1 ? parts[parts.length - 2]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

function MemberCard({ m }: { m: Member }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-white/80 shadow-sm ring-1 ring-leaf/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-leaf/15 to-sun/15">
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
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-6xl font-bold text-leaf-deep/70 dark:text-leaf-bright/70">
              {initials(m.name)}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h4 className="text-lg font-bold text-forest dark:text-ink">{m.name}</h4>
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

export default function Board({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="board" className="relative py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        {showHeading && (
          <Reveal className="mx-auto max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
              Đội ngũ
            </span>
            <h2 className="text-2xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
              Những người{" "}
              <span className="text-gradient-green">thắp trăng</span>
            </h2>
            <p className="mt-4 text-base text-forest/75 sm:text-lg dark:text-ink/75">
              Ban sáng lập và ban tổ chức đứng sau hành trình Trăng Sáng Langbiang.
            </p>
          </Reveal>
        )}

        {/* Ban sáng lập */}
        <div className="mt-12 sm:mt-16">
          <div className="mb-5 flex items-center gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-leaf-deep dark:text-leaf-bright">
              Ban sáng lập
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-leaf/40 to-transparent" />
          </div>
          <Reveal
            childrenStagger
            className="flex flex-wrap justify-center gap-5"
          >
            {board.founders.map((m) => (
              <div
                key={m.name}
                className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)]"
              >
                <MemberCard m={m} />
              </div>
            ))}
          </Reveal>
        </div>

        {/* Ban tổ chức */}
        <div className="mt-12 sm:mt-16">
          <div className="mb-5 flex items-center gap-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-leaf-deep dark:text-leaf-bright">
              Ban tổ chức
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-leaf/40 to-transparent" />
          </div>
          <Reveal
            childrenStagger
            className="flex flex-wrap justify-center gap-5"
          >
            {board.organizers.map((m) => (
              <div
                key={m.name}
                className="w-full sm:w-[calc(50%-0.625rem)] lg:w-[calc(25%-0.9375rem)]"
              >
                <MemberCard m={m} />
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
