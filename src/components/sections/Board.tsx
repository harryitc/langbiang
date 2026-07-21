import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content/store";
import type { Member } from "@/lib/content/schema";

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1]?.[0] ?? "";
  const first = parts.length > 1 ? parts[parts.length - 2]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

function MemberCard({ m }: { m: Member }) {
  return (
    <div className="group flex h-full items-start gap-4 rounded-3xl bg-white/80 p-5 shadow-sm ring-1 ring-leaf/10 transition duration-300 hover:-translate-y-1 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10 sm:gap-5 sm:p-6">
      {/* Ảnh bên trái */}
      <span className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-leaf to-grass text-lg font-bold text-white ring-2 ring-white/60 dark:ring-white/10 sm:h-20 sm:w-20 sm:text-xl">
        {m.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={m.photo} alt={m.name} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          initials(m.name)
        )}
      </span>

      {/* Họ tên và nội dung bên phải */}
      <div className="min-w-0 flex-1">
        <h4 className="text-base font-bold text-forest dark:text-ink sm:text-lg">{m.name}</h4>
        {m.role && (
          <p className="mt-0.5 text-sm font-semibold text-leaf-deep dark:text-leaf-bright">{m.role}</p>
        )}
        {m.bio && (
          <p className="mt-2 text-sm leading-relaxed text-forest/75 dark:text-ink/70">{m.bio}</p>
        )}
      </div>
    </div>
  );
}

export default async function Members() {
  const { main } = await getContent();
  const { board } = main;
  if (!board?.members || board.members.length === 0) return null;

  return (
    <section id="members" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Đội ngũ
          </span>
          <h2 className="font-display text-3xl font-extrabold text-forest sm:text-5xl dark:text-ink">
            Ban <span className="text-gradient-green">tổ chức</span>
          </h2>
        </Reveal>

        <div className="mt-12">
          <Reveal childrenStagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
            {board.members.map((m, idx) => (
              <MemberCard key={m.name + idx} m={m} />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
