"use client";

import { useEffect, useState } from "react";

const TARGET = new Date("2026-09-19T05:30:00+07:00").getTime();

function diff() {
  const d = Math.max(0, TARGET - Date.now());
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d / 3600000) % 24),
    mins: Math.floor((d / 60000) % 60),
    secs: Math.floor((d / 1000) % 60),
  };
}

export default function Countdown() {
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff());
    const id = setInterval(() => setT(diff()), 1000);
    return () => clearInterval(id);
  }, []);

  const cells = [
    { v: t?.days, l: "Ngày" },
    { v: t?.hours, l: "Giờ" },
    { v: t?.mins, l: "Phút" },
    { v: t?.secs, l: "Giây" },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-3.5">
      {cells.map((c, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="glass glass-adaptive flex h-[54px] w-[54px] items-center justify-center rounded-xl text-xl font-bold tabular-nums text-leaf-deep shadow-soft sm:h-[68px] sm:w-[68px] sm:rounded-2xl sm:text-3xl dark:text-leaf-bright">
            {t ? String(c.v).padStart(2, "0") : "--"}
          </div>
          <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-forest/70 sm:text-[11px] dark:text-ink/70">
            {c.l}
          </span>
        </div>
      ))}
    </div>
  );
}
