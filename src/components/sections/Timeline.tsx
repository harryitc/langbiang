import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content/store";
import { fillYear, eventDateLabel, locationFor } from "@/lib/content/year";

export default async function Timeline() {
  const { main, currentYear } = await getContent();
  const { timeline, event } = main;

  return (
    <section className="relative overflow-hidden bg-[#eef8ea] py-24 sm:py-32 dark:bg-night-2">
      {/* mốc neo đặt ngay đầu nội dung để anchor canh tiêu đề dưới header (bỏ padding thừa) */}
      <span id="timeline" aria-hidden className="block" />
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Lịch trình
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Hành trình{" "}
            <span className="text-gradient-green">hai ngày một đêm</span>
          </h2>
          <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
            {eventDateLabel(event.dateLabel, currentYear)} tại {locationFor(event, "timeline")}.
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

              <ol className="relative ml-3 space-y-6 border-l-2 border-dashed border-leaf/40 pl-7 sm:ml-8 sm:pl-8 dark:border-leaf-bright/25">
                {day.items.map((it) => (
                  <li key={it.time} className="relative">
                    <span className="absolute -left-[42px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-leaf/30 dark:bg-night-2 dark:ring-leaf-bright/25">
                      <span className="h-2 w-2 rounded-full bg-leaf-deep dark:bg-leaf-bright" />
                    </span>
                    <div className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-leaf/10 transition hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-sun/15 px-3 py-1 text-sm font-bold text-sunset dark:bg-sun/20 dark:text-sun">
                          {it.time}
                        </span>
                        <h3 className="text-lg font-bold text-forest dark:text-ink">
                          {it.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-forest/75 dark:text-ink/70">{it.desc}</p>
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
