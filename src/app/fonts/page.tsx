"use client";

import { useState } from "react";
import { Dancing_Script, Pacifico, Lobster, Comfortaa } from "next/font/google";

// Tất cả phông dưới đây đều có subset "vietnamese" (dấu tiếng Việt đầy đủ).
const dancing = Dancing_Script({ subsets: ["vietnamese", "latin"], weight: ["500", "700"] });
const pacifico = Pacifico({ subsets: ["vietnamese", "latin"], weight: "400" });
const lobster = Lobster({ subsets: ["vietnamese", "latin"], weight: "400" });
const comfortaa = Comfortaa({ subsets: ["vietnamese", "latin"], weight: ["500", "700"] });

type FontDef = { name: string; className: string; note?: string };

const FONTS: FontDef[] = [
  { name: "Dancing Script", className: dancing.className, note: "Đang dùng hiện tại" },
  { name: "Pacifico", className: pacifico.className, note: "Viết tay" },
  { name: "Lobster", className: lobster.className, note: "Viết tay" },
  { name: "Comfortaa", className: comfortaa.className, note: "Bo tròn" },
];

// Chuỗi thử tất cả nguyên âm + dấu tiếng Việt để lộ chữ bị đứt.
const STRESS = "AĂÂ EÊ OÔƠ UƯ Đ · ắằẳẵặ ệ ọ ữ ỳ ị · Đà Lạt, Lâm Đồng";

export default function FontPlayground() {
  const [line1, setLine1] = useState("Trăng sáng Langbiang");
  const [line2, setLine2] = useState("Ban sáng lập & Tổ chức");
  const [size, setSize] = useState(56);
  const [dark, setDark] = useState(false);

  return (
    <div className={dark ? "dark" : ""}>
      <main className="min-h-screen bg-cream px-5 py-10 text-forest dark:bg-night dark:text-ink sm:px-8">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-2xl font-extrabold sm:text-3xl">Playground phông chữ</h1>
          <p className="mt-2 text-sm text-forest/70 dark:text-ink/70">
            Gõ thử nội dung, đổi cỡ chữ và so sánh. Tất cả phông đều có tiếng Việt —
            dòng nhỏ bên dưới mỗi mẫu là chuỗi thử dấu để soi chữ bị đứt.
          </p>

          {/* Bảng điều khiển */}
          <div className="mt-6 grid gap-4 rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-leaf/10 dark:bg-white/5 dark:ring-leaf-bright/10 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-leaf-deep dark:text-leaf-bright">
                Dòng 1
              </span>
              <input
                value={line1}
                onChange={(e) => setLine1(e.target.value)}
                className="w-full rounded-xl border border-leaf/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-leaf dark:border-white/10 dark:bg-white/10"
              />
            </label>
            <label>
              <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-leaf-deep dark:text-leaf-bright">
                Dòng 2
              </span>
              <input
                value={line2}
                onChange={(e) => setLine2(e.target.value)}
                className="w-full rounded-xl border border-leaf/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-leaf dark:border-white/10 dark:bg-white/10"
              />
            </label>
            <label className="sm:col-span-1">
              <span className="mb-1 block text-xs font-bold uppercase tracking-widest text-leaf-deep dark:text-leaf-bright">
                Cỡ chữ: {size}px
              </span>
              <input
                type="range"
                min={24}
                max={120}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-leaf"
              />
            </label>
            <div className="flex items-end">
              <button
                onClick={() => setDark((v) => !v)}
                className="rounded-xl bg-leaf/15 px-4 py-2.5 text-sm font-semibold text-leaf-deep transition hover:bg-leaf/25 dark:bg-leaf-bright/15 dark:text-leaf-bright"
              >
                {dark ? "☀️ Nền sáng" : "🌙 Nền tối"}
              </button>
            </div>
          </div>

          {/* Danh sách phông */}
          <div className="mt-8 space-y-4">
            {FONTS.map((f) => (
              <div
                key={f.name}
                className="rounded-2xl bg-white/70 p-5 shadow-sm ring-1 ring-leaf/10 dark:bg-white/5 dark:ring-leaf-bright/10 sm:p-6"
              >
                <div className="mb-3 flex items-center gap-3">
                  <span className="text-sm font-bold text-leaf-deep dark:text-leaf-bright">
                    {f.name}
                  </span>
                  {f.note && (
                    <span className="rounded-full bg-sun/20 px-2.5 py-0.5 text-[11px] font-semibold text-sunset">
                      {f.note}
                    </span>
                  )}
                </div>
                <p
                  className={`${f.className} leading-tight text-gradient-green`}
                  style={{ fontSize: `${size}px` }}
                >
                  {line1 || "Trăng sáng Langbiang"}
                </p>
                <p
                  className={`${f.className} mt-1 leading-tight text-forest dark:text-ink`}
                  style={{ fontSize: `${Math.round(size * 0.7)}px` }}
                >
                  {line2 || "Ban sáng lập & Tổ chức"}
                </p>
                <p className={`${f.className} mt-3 text-lg text-forest/70 dark:text-ink/70`}>
                  {STRESS}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center text-xs text-forest/50 dark:text-ink/50">
            Chọn được phông ưng ý? Báo mình tên phông, mình sẽ thay cho tiêu đề toàn site.
          </p>
        </div>
      </main>
    </div>
  );
}
