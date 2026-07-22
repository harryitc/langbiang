import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content/store";
import { eventDateLabel, locationFor } from "@/lib/content/year";
import type { TimelinePhoto } from "@/lib/content/schema";

/* ─────────────────────────────────────────────────────────
   CSS injected as a <style> tag (valid in React 18 / Next.js)
───────────────────────────────────────────────────────── */
const TL_CSS = `
/* ── Paper texture ── */
.tl-section {
  background-color: #fbf9f5;
  background-image: url("data:image/svg+xml,%3Csvg width='200' height='200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
}

/* ── Center dashed line ── */
.tl-line {
  position: absolute; top: 0; bottom: 0;
  left: 50%; transform: translateX(-50%);
  width: 2px;
  background: repeating-linear-gradient(
    to bottom,
    #c2c6d4 0px, #c2c6d4 10px,
    transparent 10px, transparent 18px
  );
  z-index: 0;
  animation: tl-line-pulse 4s ease-in-out infinite;
}
@keyframes tl-line-pulse {
  0%,100% { opacity: 0.5; }
  50%      { opacity: 1; }
}

/* ── PIN marker (start) ── */
@keyframes tl-pin-wobble {
  0%,100% { transform: rotate(-4deg); }
  50%      { transform: rotate(4deg); }
}
.tl-pin { animation: tl-pin-wobble 2.8s ease-in-out infinite; transform-origin: 50% 0; }
.tl-pin-head {
  width: 28px; height: 28px;
  background: radial-gradient(circle at 35% 35%, #f97316, #b91c1c);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  box-shadow: 0 4px 14px rgba(185,28,28,.45);
  position: relative;
}
.tl-pin-head::after {
  content:''; position:absolute;
  top:6px; left:6px; width:8px; height:8px;
  background:rgba(255,255,255,.5); border-radius:50%;
}
@keyframes tl-ping {
  0%   { transform:scale(1); opacity:.8; }
  100% { transform:scale(2.6); opacity:0; }
}
.tl-ping {
  position:absolute; inset:0; border-radius:50%;
  border:2px solid rgba(185,28,28,.35);
  animation: tl-ping 2s cubic-bezier(0,0,0.2,1) infinite;
}

/* ── END dot ── */
@keyframes tl-end-glow {
  0%,100% { box-shadow: 0 0 0 4px rgba(0,63,135,.12), 0 0 0 8px rgba(0,63,135,.05); }
  50%      { box-shadow: 0 0 0 6px rgba(0,63,135,.2),  0 0 0 12px rgba(0,63,135,.08); }
}
.tl-end-dot {
  width:20px; height:20px; background:#003f87; border-radius:50%;
  animation: tl-end-glow 2.5s ease-in-out infinite;
  position:relative;
}
.tl-end-dot::after {
  content:''; position:absolute; inset:5px;
  background:#fff; border-radius:50%;
}

/* ── Wax seal ── */
@keyframes tl-seal-spin { to { transform:rotate(360deg); } }
.tl-seal-ring {
  position:absolute; inset:-6px; border-radius:50%;
  background:conic-gradient(
    rgba(0,63,135,.18) 0deg, transparent 20deg,
    rgba(0,63,135,.18) 40deg, transparent 60deg,
    rgba(0,63,135,.18) 80deg, transparent 100deg,
    rgba(0,63,135,.18) 120deg, transparent 140deg,
    rgba(0,63,135,.18) 160deg, transparent 180deg,
    rgba(0,63,135,.18) 200deg, transparent 220deg,
    rgba(0,63,135,.18) 240deg, transparent 260deg,
    rgba(0,63,135,.18) 280deg, transparent 300deg,
    rgba(0,63,135,.18) 320deg, transparent 340deg,
    rgba(0,63,135,.18) 360deg
  );
  animation: tl-seal-spin 20s linear infinite;
}
@keyframes tl-seal-in {
  from { transform:scale(0) rotate(-20deg); opacity:0; }
  to   { transform:scale(1) rotate(0deg);   opacity:1; }
}
.tl-seal { animation: tl-seal-in .7s cubic-bezier(.34,1.56,.64,1) both .3s; }

/* ── Tape strips ── */
.tl-tape {
  position:absolute; height:22px; border-radius:2px; z-index:20;
  overflow:hidden; pointer-events:none;
}
.tl-tape-white { background:rgba(255,255,255,.52); box-shadow:0 1px 3px rgba(0,0,0,.08); }
.tl-tape-yellow { background:rgba(254,203,0,.38); box-shadow:0 1px 3px rgba(0,0,0,.08); }
.tl-tape-blue   { background:rgba(172,199,255,.42); box-shadow:0 1px 3px rgba(0,0,0,.08); }
.tl-tape::before {
  content:''; position:absolute; inset:0;
  background:repeating-linear-gradient(90deg,
    transparent 0px, transparent 5px,
    rgba(255,255,255,.18) 5px, rgba(255,255,255,.18) 6px);
  animation: tl-tape-shimmer 5s linear infinite;
}
@keyframes tl-tape-shimmer {
  0%   { background-position: 0 0; }
  100% { background-position: 80px 0; }
}

/* ── Polaroid ── */
.tl-photo {
  background:#fff;
  padding:10px 10px 36px 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 10px 24px -4px rgba(0,0,0,.1), 0 22px 44px -12px rgba(0,0,0,.07);
  position:absolute;
  transition: transform .38s cubic-bezier(.22,.68,0,1.2), box-shadow .3s ease, z-index 0s;
  cursor:pointer;
  will-change: transform;
}
.tl-photo:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,.14), 0 30px 60px -10px rgba(0,0,0,.12) !important;
}
.tl-photo img {
  display:block; width:100%; object-fit:cover;
  filter: contrast(1.06) saturate(1.08) sepia(.07);
  transition: filter .3s;
}
.tl-photo:hover img { filter: contrast(1.1) saturate(1.12) sepia(.03); }
.tl-photo .tl-caption {
  position:absolute; bottom:8px; left:0; right:0;
  text-align:center; font-size:11px; font-weight:500;
  color:#424752; padding:0 8px; line-height:1.3;
  font-family:'Be Vietnam Pro',sans-serif;
}

/* ── Photo cluster: hover fan-out ── */
.tl-cluster { position:relative; }
/* 1 photo */
.tl-cluster[data-n="1"] .tl-photo:nth-child(1):hover {
  transform: rotate(0deg) scale(1.06) !important; z-index:30;
}
/* 2 photos fan */
.tl-cluster[data-n="2"]:hover .tl-photo:nth-child(1) { transform: rotate(-13deg) translate(-18px,-6px) scale(1.04) !important; z-index:22; }
.tl-cluster[data-n="2"]:hover .tl-photo:nth-child(2) { transform: rotate(13deg)  translate(18px,-6px) scale(1.04)  !important; z-index:25; }
/* 3 photos fan */
.tl-cluster[data-n="3"]:hover .tl-photo:nth-child(1) { transform: rotate(-16deg) translate(-22px,-4px) scale(1.03) !important; z-index:20; }
.tl-cluster[data-n="3"]:hover .tl-photo:nth-child(2) { transform: rotate(0deg)   translateY(-10px)    scale(1.05) !important; z-index:28; }
.tl-cluster[data-n="3"]:hover .tl-photo:nth-child(3) { transform: rotate(16deg)  translate(22px,-4px) scale(1.03) !important; z-index:20; }

/* ── Content card lift ── */
.tl-card { transition: transform .3s ease, box-shadow .3s ease; }
.tl-card:hover { transform: translateY(-5px) !important; box-shadow: 0 24px 48px -10px rgba(0,0,0,.13) !important; }

/* ── Description line ── */
.tl-desc-line {
  display:flex; align-items:flex-start; gap:8px;
  padding:6px 6px; border-radius:6px;
  border-bottom:1px dashed rgba(66,71,82,.1);
  transition: background .2s;
}
.tl-desc-line:last-child { border-bottom:none; }
.tl-desc-line:hover { background:rgba(0,0,0,.025); }
.tl-time-badge {
  display:inline-block; flex-shrink:0; margin-top:2px;
  background:rgba(254,203,0,.3); color:#6e5700;
  font-size:10px; font-weight:700; letter-spacing:.01em;
  padding:1px 7px; border-radius:99px;
}
`;

/* ─────────────────────────────────────────────────────────
   TAPE STRIP COMPONENT
───────────────────────────────────────────────────────── */
type TapeVariant = "white" | "yellow" | "blue";
function Tape({
  variant = "white",
  style,
}: {
  variant?: TapeVariant;
  style?: React.CSSProperties;
}) {
  const cls = {
    white: "tl-tape-white",
    yellow: "tl-tape-yellow",
    blue: "tl-tape-blue",
  }[variant];
  return (
    <div
      aria-hidden
      className={`tl-tape ${cls}`}
      style={{ width: 70, ...style }}
    />
  );
}

/* ─────────────────────────────────────────────────────────
   PHOTO CLUSTER — 0/1/2/3 polaroids stacked
───────────────────────────────────────────────────────── */
type TapeConfig = {
  variant: TapeVariant;
  top: number;
  left?: string | number;
  right?: number;
  transform: string;
};
type PhotoConfig = {
  w: number;
  h: number;
  rotate: number;
  z: number;
  tape: TapeConfig;
  top?: number;
  right?: number;
  bottom?: number;
  left?: number | string;
};

const PHOTO_CONFIGS: PhotoConfig[][] = [
  // 1 photo
  [{ w: 240, h: 170, rotate: -3, z: 5, tape: { variant: "white", top: -11, left: "50%", transform: "translateX(-50%) rotate(2deg)" } }],
  // 2 photos
  [
    { w: 210, h: 155, rotate: 6,  z: 2, top: 0,    right: 0, tape: { variant: "yellow", top: -10, right: 14, transform: "rotate(-7deg)" } },
    { w: 225, h: 155, rotate: -5, z: 3, bottom: 0, left: 0,  tape: { variant: "blue",   top: -11, left: 20,  transform: "rotate(9deg)"  } },
  ],
  // 3 photos
  [
    { w: 190, h: 140, rotate: -8, z: 1, top: 0,    left: 12, tape: { variant: "white",  top: -10, left: "50%", transform: "translateX(-50%) rotate(4deg)" } },
    { w: 205, h: 140, rotate: 5,  z: 2, top: 30,   right: 0, tape: { variant: "yellow", top: -10, right: 10,  transform: "rotate(-6deg)"                  } },
    { w: 215, h: 140, rotate: -2, z: 3, bottom: 0, left: 20, tape: { variant: "blue",   top: -11, left: 24,   transform: "rotate(8deg)"                   } },
  ],
];

function PhotoCluster({
  photos,
}: {
  photos: TimelinePhoto[];
}) {
  const count = Math.min(photos.length, 3);
  if (count === 0) {
    return (
      <div className="flex h-52 w-64 items-center justify-center rounded border-2 border-dashed border-outline-variant/40 bg-white/60">
        <div className="text-center">
          <span className="block text-4xl opacity-40">📷</span>
          <span className="mt-2 block text-xs text-on-surface-variant/50">Chưa có ảnh</span>
        </div>
      </div>
    );
  }

  const configs = PHOTO_CONFIGS[count - 1];
  // Cluster bounding box
  const clusterH = count === 1 ? 210 : count === 2 ? 290 : 310;
  const clusterW = count === 1 ? 260 : 305;

  return (
    <div
      className="tl-cluster"
      data-n={count}
      style={{ width: clusterW, height: clusterH, position: "relative" }}
    >
      {configs.map((cfg, i) => {
        const photo = photos[i];
        const src = photo?.url ?? "";
        const caption = photo?.note ?? "";
        const { w, h, rotate, z, tape, ...pos } = cfg;
        return (
          <div
            key={i}
            className="tl-photo"
            style={{ width: w, zIndex: z, transform: `rotate(${rotate}deg)`, ...pos }}
          >
            <Tape
              variant={tape.variant}
              style={{
                top: tape.top,
                left: tape.left,
                right: tape.right,
                transform: tape.transform,
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={caption} style={{ height: h }} />
            <span className="tl-caption">{caption}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PIN MARKER — for the first item
───────────────────────────────────────────────────────── */
function PinMarker() {
  return (
    <div className="hidden md:flex justify-center" style={{ marginBottom: -4, zIndex: 20, position: "relative" }}>
      <div className="tl-pin flex flex-col items-center" style={{ filter: "drop-shadow(0 4px 12px rgba(185,28,28,0.3))" }}>
        <div className="relative" style={{ width: 28, height: 28 }}>
          <div className="tl-ping" />
          <div className="tl-pin-head" />
        </div>
        <div style={{ width: 2, height: 32, background: "linear-gradient(to bottom,#9ca3af,#6b7280)", borderRadius: "0 0 2px 2px" }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   WAX SEAL — overlaid on the last item's photo
───────────────────────────────────────────────────────── */
function WaxSeal() {
  return (
    <div className="tl-seal" style={{ position: "absolute", bottom: -20, right: -20, zIndex: 30, width: 76, height: 76 }}>
      <div className="tl-seal-ring" />
      <div
        style={{
          width: 76, height: 76, borderRadius: "50%",
          background: "radial-gradient(circle at 38% 38%, #0056b3, #003f87)",
          boxShadow: "0 6px 20px rgba(0,63,135,.35), inset 0 2px 4px rgba(255,255,255,.15), inset 0 -3px 6px rgba(0,0,0,.18)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}
      >
        {/* inner dashed ring */}
        <div style={{ position: "absolute", inset: 5, borderRadius: "50%", border: "1.5px dashed rgba(255,255,255,.28)" }} />
        <span style={{ fontSize: 14, position: "relative", zIndex: 1 }}>✦</span>
        <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#fff", textAlign: "center", lineHeight: 1.35, position: "relative", zIndex: 1 }}>
          KẾT<br />THÚC
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   DESCRIPTION LINE — one time-slot row
───────────────────────────────────────────────────────── */
function DescLine({ time, title, desc }: { time: string; title: string; desc?: string }) {
  return (
    <div className="tl-desc-line">
      {time && <span className="tl-time-badge">{time}</span>}
      <div style={{ flex: 1 }}>
        <p className="text-sm font-bold text-on-surface leading-snug">{title}</p>
        {desc && (
          <p className="mt-0.5 text-xs leading-relaxed text-on-surface-variant/80">{desc}</p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   CARD CONFIGS by position
───────────────────────────────────────────────────────── */
const CARD_STYLES = {
  start: {
    bg: "linear-gradient(135deg,#ffe08b50 0%,#ffe08b28 100%)",
    border: "1px solid #ffe08b88",
    borderAccent: "4px solid #b45309",
    borderAccentSide: "left",
    rotate: "rotate-1",
    badge: "📌 Khởi hành",
    badgeColor: "#92400e",
    dotColor: "#b91c1c",
    borderRadius: "4px",
  },
  end: {
    bg: "linear-gradient(135deg,#d7e2ff38 0%,#acc7ff1a 100%)",
    border: "1px solid #acc7ff50",
    borderAccent: "3px solid #003f87",
    borderAccentSide: "top",
    rotate: "-rotate-1",
    badge: "🏁 Kết thúc",
    badgeColor: "#003f87",
    dotColor: "#003f87",
    borderRadius: "4px",
  },
  even: {
    bg: "#ffffff",
    border: "1px solid #c2c6d430",
    borderAccent: "4px solid #006722",
    borderAccentSide: "left",
    rotate: "-rotate-1",
    badge: null,
    badgeColor: "",
    dotColor: "#006722",
    borderRadius: "0 24px 4px 4px",
  },
  odd: {
    bg: "linear-gradient(135deg,#eae8e4 0%,#f5f3ef 100%)",
    border: "1px solid #c2c6d438",
    borderAccent: "4px solid #003f87",
    borderAccentSide: "right",
    rotate: "rotate-1",
    badge: null,
    badgeColor: "",
    dotColor: "#003f87",
    borderRadius: "24px 4px 4px 24px",
  },
} as const;

type CardType = keyof typeof CARD_STYLES;

/* ─────────────────────────────────────────────────────────
   MAIN TIMELINE COMPONENT
───────────────────────────────────────────────────────── */
export default async function Timeline() {
  const { main, currentYear } = await getContent();
  const { timeline, event } = main;

  return (
    <section className="tl-section relative overflow-hidden py-24 sm:py-32 dark:bg-night-2">
      {/* Injected styles */}
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style dangerouslySetInnerHTML={{ __html: TL_CSS }} />

      {/* Anchor */}
      <span id="timeline" aria-hidden className="block" />

      <div className="mx-auto max-w-5xl px-6">

        {/* ── Header ── */}
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Lịch trình
          </span>
          <div className="relative inline-block">
            <h2 className="inline-block -rotate-1 rounded-sm bg-amber-100/55 px-5 py-1.5 text-3xl font-extrabold text-forest shadow-sm sm:text-4xl md:text-5xl dark:bg-amber-900/20 dark:text-ink">
              Hành trình{" "}
              <span className="text-gradient-green">hai ngày một đêm</span>
            </h2>
            <svg
              aria-hidden
              className="absolute -right-8 -top-6 h-11 w-11 animate-pulse text-amber-400/65"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          <p className="mt-5 rotate-1 text-lg italic text-forest/60 dark:text-ink/60">
            &ldquo;{eventDateLabel(event.dateLabel, currentYear)} tại{" "}
            {locationFor(event, "timeline")}&rdquo;
          </p>
        </Reveal>

        {/* ── Timeline rows ── */}
        <div className="relative mt-20 pb-16">

          {/* Center dashed line (desktop only) */}
          <div aria-hidden className="tl-line hidden md:block" />

          {timeline.map((day, idx) => {
            const isFirst = idx === 0;
            const isLast  = idx === timeline.length - 1;
            const isEven  = idx % 2 === 0; // even = photos LEFT side

            let cardType: CardType;
            if (isFirst) cardType = "start";
            else if (isLast) cardType = "end";
            else cardType = isEven ? "even" : "odd";

            const cs = CARD_STYLES[cardType];
            const photos = day.images ?? [];

            return (
              <Reveal key={day.day} className={`relative mb-28 last:mb-0`}>

                {/* PIN marker (first item only, centered above) */}
                {isFirst && <PinMarker />}

                {/* Connector dot on center line */}
                {!isFirst && (
                  <div
                    aria-hidden
                    className="hidden md:block"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translate(-50%, -8px)",
                      width: 14, height: 14,
                      background: "#fff",
                      border: `3px solid ${isLast ? "#003f87" : "#006722"}`,
                      borderRadius: "50%",
                      zIndex: 10,
                      boxShadow: `0 0 0 4px ${isLast ? "rgba(0,63,135,.12)" : "rgba(0,103,34,.1)"}`,
                    }}
                  />
                )}

                {/* Row: photos | card, alternating sides */}
                <div
                  className={`flex flex-col items-start gap-10 md:gap-0 md:flex-row ${
                    isEven ? "" : "md:flex-row-reverse"
                  }`}
                >
                  {/* ── Photo side ── */}
                  <div
                    className={`w-full md:w-1/2 flex justify-center pt-6 ${
                      isEven
                        ? "md:justify-end md:pr-14"
                        : "md:justify-start md:pl-14"
                    }`}
                  >
                    <div className="relative">
                      <PhotoCluster photos={photos} />
                      {isLast && photos.length > 0 && <WaxSeal />}
                    </div>
                  </div>

                  {/* ── Content card ── */}
                  <div
                    className={`w-full md:w-1/2 ${
                      isEven ? "md:pl-14" : "md:pr-14"
                    }`}
                  >
                    <div
                      className={`tl-card relative max-w-md overflow-hidden p-6 shadow-sm ${cs.rotate} dark:bg-white/[0.04]`}
                      style={{
                        background: cs.bg,
                        border: cs.border,
                        borderRadius: cs.borderRadius,
                        ...(cs.borderAccentSide === "left"
                          ? { borderLeft: cs.borderAccent }
                          : cs.borderAccentSide === "right"
                          ? { borderRight: cs.borderAccent }
                          : { borderTop: cs.borderAccent }),
                      }}
                    >
                      {/* Corner dot */}
                      <div
                        aria-hidden
                        className={`absolute top-3 ${isEven ? "right-3" : "left-3"} h-3 w-3 rounded-full`}
                        style={{ background: cs.dotColor, opacity: 0.45, boxShadow: `0 0 6px ${cs.dotColor}` }}
                      />

                      {/* Badge + title */}
                      {cs.badge && (
                        <span
                          className="mb-1 block text-xs font-bold uppercase tracking-widest"
                          style={{ color: cs.badgeColor }}
                        >
                          {cs.badge}
                        </span>
                      )}
                      <div className="mb-1 flex items-baseline gap-2">
                        <h3 className="text-xl font-extrabold text-forest dark:text-ink">
                          {day.day}
                        </h3>
                        <span className="text-sm font-normal text-on-surface-variant/70">
                          {day.date}
                        </span>
                      </div>

                      {/* Description lines — one per time item */}
                      <div className="mt-3 space-y-0">
                        {day.items.map((it) => (
                          <DescLine
                            key={it.time}
                            time={it.time}
                            title={it.title}
                            desc={it.desc}
                          />
                        ))}
                        {day.items.length === 0 && (
                          <p className="text-xs text-on-surface-variant/50 italic">
                            Chưa có mốc thời gian nào.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}

          {/* End dot below the last item */}
          {timeline.length > 0 && (
            <div className="hidden md:flex justify-center mt-4">
              <div className="tl-end-dot" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
