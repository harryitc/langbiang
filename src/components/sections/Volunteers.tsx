import Reveal from "@/components/Reveal";
import type { Team } from "@/lib/content/schema";

export default function Volunteers({
  teams,
  count,
  year,
  id = "volunteers",
}: {
  teams: Team[];
  /** Tổng số tình nguyện viên hiển thị ở tiêu đề. */
  count: number;
  /** Số năm của mùa đang xem (nhóm A4). */
  year: number;
  id?: string;
}) {
  if (teams.length === 0) return null;

  return (
    <section
      id={id}
      className="relative overflow-hidden bg-[#eef8ea] py-24 sm:py-32 dark:bg-night-2"
    >
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Đại gia đình {year}
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            <span className="text-gradient-green">{count}+</span> trái tim
            tình nguyện
          </h2>
          <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
            Những con người đã cùng nhau làm nên mùa Trăng Sáng Langbiang {year}. Xin
            gửi lời cảm ơn đến từng thành viên.
          </p>
        </Reveal>

        <Reveal
          childrenStagger
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {teams.map((team) => (
            <div
              key={team.name}
              className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-leaf/10 dark:bg-white/[0.04] dark:ring-leaf-bright/10"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-leaf to-grass text-lg text-white shadow-sm">
                  🌿
                </span>
                <h3 className="text-lg font-bold text-forest dark:text-ink">
                  {team.name}
                </h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {team.members.map((m) => (
                  <li
                    key={m}
                    className="rounded-full bg-leaf/10 px-3 py-1.5 text-sm font-medium text-forest/85 dark:bg-leaf-bright/10 dark:text-ink/85"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Reveal>

        <Reveal className="mt-10 text-center">
          <p className="text-forest/70 dark:text-ink/70">
            ...và rất nhiều tình nguyện viên thầm lặng khác 💚
          </p>
        </Reveal>
      </div>
    </section>
  );
}
