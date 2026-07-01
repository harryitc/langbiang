import Reveal from "@/components/Reveal";
import { timeline } from "@/lib/site";

export default function Timeline() {
  return (
    <section
      id="timeline"
      className="relative overflow-hidden bg-[#eef8ea] py-24 sm:py-32"
    >
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep">
            Lịch trình
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl">
            Hành trình{" "}
            <span className="text-gradient-green">hai ngày một đêm</span>
          </h2>
          <p className="mt-4 text-lg text-forest/75">
            19 – 20 tháng 9 năm 2026 tại phường Langbiang, Đà Lạt.
          </p>
        </Reveal>

        <div className="mt-14 space-y-14">
          {timeline.map((day) => (
            <Reveal key={day.day}>
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-16 w-16 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-leaf-deep to-leaf text-white shadow-soft">
                  <span className="text-[10px] font-semibold uppercase">
                    {day.day}
                  </span>
                  <span className="text-xs font-bold">{day.date.slice(0, 5)}</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-leaf/40 to-transparent" />
              </div>

              <ol className="relative ml-8 space-y-6 border-l-2 border-dashed border-leaf/40 pl-8">
                {day.items.map((it) => (
                  <li key={it.time} className="relative">
                    <span className="absolute -left-[42px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-leaf/30">
                      <span className="h-2 w-2 rounded-full bg-leaf-deep" />
                    </span>
                    <div className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-leaf/10 transition hover:shadow-soft">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-sun/15 px-3 py-1 text-sm font-bold text-sunset">
                          {it.time}
                        </span>
                        <h3 className="text-lg font-bold text-forest">
                          {it.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-forest/75">{it.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
