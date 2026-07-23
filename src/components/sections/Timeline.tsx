import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content/store";
import { eventDateLabel, locationFor } from "@/lib/content/year";
import type { TimelineItem } from "@/lib/content/schema";

/* ─── SVG Pin icon — absolute top-right ──────────────────────────── */
function PinIcon({ pin }: { pin: "start" | "end" }) {
  const color = pin === "start" ? "#2e7d32" : "#f57f17";
  const glow =
    pin === "start"
      ? "drop-shadow(0 2px 8px rgba(46,125,50,0.6))"
      : "drop-shadow(0 2px 8px rgba(245,127,23,0.6))";
  return (
    <span
      className="absolute right-3 top-3 z-10"
      aria-hidden
      style={{ filter: glow }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill={color}
      >
        {/* Pushpin / thumbtack icon */}
        <path d="M17 4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1l1 1v4l-3 3h5v6l1 1 1-1v-6h5l-3-3V6l1-1V4z" />
      </svg>
    </span>
  );
}


/* ─── Dot indicator ──────────────────────────────────────────────── */
function TimelineDot({ pin }: { pin?: "start" | "end" }) {
  if (pin === "start") {
    return (
      <span className="absolute -left-[42px] top-2 flex h-5 w-5 items-center justify-center rounded-full bg-leaf-deep ring-4 ring-leaf/40 dark:ring-leaf-bright/35">
        {/* pulse ring */}
        <span className="absolute h-5 w-5 animate-ping rounded-full bg-leaf-deep/40" />
        <span className="h-2 w-2 rounded-full bg-white" />
      </span>
    );
  }
  if (pin === "end") {
    return (
      <span className="absolute -left-[42px] top-2 flex h-5 w-5 items-center justify-center rounded-full bg-sunset ring-4 ring-sun/40 dark:ring-sun/35">
        <span className="absolute h-5 w-5 animate-ping rounded-full bg-sunset/40" />
        <span className="h-2 w-2 rounded-full bg-white" />
      </span>
    );
  }
  // Mặc định
  return (
    <span className="absolute -left-[42px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white ring-4 ring-leaf/30 dark:bg-night-2 dark:ring-leaf-bright/25">
      <span className="h-2 w-2 rounded-full bg-leaf-deep dark:bg-leaf-bright" />
    </span>
  );
}

/* ─── Card ────────────────────────────────────────────────────────── */
function TimelineCard({ it }: { it: TimelineItem }) {
  const isStart = it.pin === "start";
  const isEnd = it.pin === "end";

  /* ── Pin start: nền xanh lá nhạt + border trái xanh đậm ── */
  if (isStart) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-l-4 border-leaf-deep bg-gradient-to-br from-leaf-deep/10 to-leaf/5 p-5 shadow-md ring-1 ring-leaf/20 transition hover:shadow-soft dark:from-leaf-bright/10 dark:to-leaf/5 dark:ring-leaf-bright/20">
        {/* Glow blob */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-leaf/20 blur-2xl" />

        <PinIcon pin="start" />

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-leaf-deep px-3 py-1 text-sm font-bold text-white">
            {it.time}
          </span>
          <h3 className="text-lg font-bold text-forest dark:text-ink">{it.title}</h3>
        </div>
        <p className="mt-2 text-forest/75 dark:text-ink/70">{it.desc}</p>
      </div>
    );
  }

  /* ── Pin end: nền cam nhạt + border trái cam ── */
  if (isEnd) {
    return (
      <div className="relative overflow-hidden rounded-2xl border-l-4 border-sunset bg-gradient-to-br from-sun/10 to-sunset/5 p-5 shadow-md ring-1 ring-sun/20 transition hover:shadow-soft dark:from-sun/10 dark:to-sunset/5 dark:ring-sun/20">
        {/* Glow blob */}
        <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sun/20 blur-2xl" />

        <PinIcon pin="end" />

        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-sunset px-3 py-1 text-sm font-bold text-white">
            {it.time}
          </span>
          <h3 className="text-lg font-bold text-forest dark:text-ink">{it.title}</h3>
        </div>
        <p className="mt-2 text-forest/75 dark:text-ink/70">{it.desc}</p>
      </div>
    );
  }

  /* ── Thường ── */
  return (
    <div className="rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-leaf/10 transition hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-sun/15 px-3 py-1 text-sm font-bold text-sunset dark:bg-sun/20 dark:text-sun">
          {it.time}
        </span>
        <h3 className="text-lg font-bold text-forest dark:text-ink">{it.title}</h3>
      </div>
      <p className="mt-2 text-forest/75 dark:text-ink/70">{it.desc}</p>
    </div>
  );
}

export default async function Timeline() {
  const { main, currentYear } = await getContent();
  const { timeline, event } = main;

  return (
    <section className="relative overflow-hidden bg-[#eef8ea] py-24 sm:py-32 dark:bg-night-2">
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
                    <TimelineDot pin={it.pin} />
                    <TimelineCard it={it} />
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
