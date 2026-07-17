"use client";

import { useEffect, useRef, useState } from "react";
import { saveSiteDraftAction } from "@/lib/content/actions";
import type { SiteMeta } from "@/lib/content/schema";

type Status = "idle" | "saving" | "saved" | "error";

export default function SiteEditor({
  initial,
  siteUrl,
}: {
  initial: SiteMeta;
  siteUrl: string;
}) {
  const [meta, setMeta] = useState<SiteMeta>(initial);
  const [status, setStatus] = useState<Status>("idle");
  const skipFirst = useRef(true);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    setStatus("saving");
    const t = setTimeout(async () => {
      const res = await saveSiteDraftAction(meta);
      setStatus(res.ok ? "saved" : "error");
    }, 700);
    return () => clearTimeout(t);
  }, [meta]);

  const patch = (p: Partial<SiteMeta>) => setMeta((m) => ({ ...m, ...p }));
  const heroTitle = `${meta.name} — ${meta.tagline} 2026`;
  const prettyUrl = siteUrl.replace(/^https?:\/\//, "");

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* FORM */}
      <div>
        <div className="mb-4">
          <StatusPill status={status} />
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tên dự án">
              <input className={inputCls} value={meta.name} onChange={(e) => patch({ name: e.target.value })} />
            </Field>
            <Field label="Tên rút gọn">
              <input className={inputCls} value={meta.shortName} onChange={(e) => patch({ shortName: e.target.value })} />
            </Field>
          </div>
          <Field label="Tagline" hint="Ghép vào tiêu đề trang">
            <input className={inputCls} value={meta.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
          </Field>
          <Field label="Phụ đề">
            <input className={inputCls} value={meta.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nhãn ngày (hiển thị)">
              <input className={inputCls} value={meta.dateLabel} onChange={(e) => patch({ dateLabel: e.target.value })} />
            </Field>
            <Field label="Ngày (ISO)" hint="VD 2026-09-26">
              <input className={inputCls} value={meta.dateISO} onChange={(e) => patch({ dateISO: e.target.value })} />
            </Field>
          </div>
          <Field label="Địa điểm">
            <input className={inputCls} value={meta.location} onChange={(e) => patch({ location: e.target.value })} />
          </Field>
          <Field label="Mô tả (SEO / chia sẻ)" hint="~150–160 ký tự là đẹp">
            <textarea className={`${inputCls} h-24 resize-y`} value={meta.description} onChange={(e) => patch({ description: e.target.value })} />
          </Field>
          <Field label="Từ khoá" hint="Ngăn cách bằng dấu phẩy">
            <textarea
              className={`${inputCls} h-16 resize-y`}
              value={meta.keywords.join(", ")}
              onChange={(e) =>
                patch({ keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
              }
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook">
              <input className={inputCls} value={meta.facebook} onChange={(e) => patch({ facebook: e.target.value })} />
            </Field>
            <Field label="Email">
              <input className={inputCls} value={meta.email} onChange={(e) => patch({ email: e.target.value })} />
            </Field>
          </div>
          <Field label="Link gian hàng Shopee">
            <input className={inputCls} value={meta.shopee} onChange={(e) => patch({ shopee: e.target.value })} />
          </Field>
        </div>
      </div>

      {/* PREVIEW: Google + Facebook card */}
      <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
        <div>
          <p className="mb-2 text-sm text-slate-500">Kết quả tìm kiếm Google</p>
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="text-xs text-slate-500">{prettyUrl}</div>
            <div className="mt-0.5 text-lg text-[#1a0dab] dark:text-blue-400">
              {truncate(heroTitle, 60)}
            </div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {truncate(meta.description, 160)}
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm text-slate-500">Thẻ chia sẻ (Facebook / Zalo)</p>
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <div className="flex aspect-[1.91/1] items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-50 text-4xl dark:from-emerald-900/40 dark:to-slate-900">
              🌙
            </div>
            <div className="border-t border-slate-200 p-3 dark:border-slate-800">
              <div className="text-xs uppercase text-slate-400">{prettyUrl}</div>
              <div className="mt-0.5 font-semibold">{truncate(heroTitle, 70)}</div>
              <div className="mt-0.5 text-sm text-slate-500">{truncate(meta.description, 120)}</div>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Ảnh chia sẻ thật là <code>/public/og.jpg</code>. Thay đổi lưu vào bản
          nháp; bấm <b>Xuất bản</b> để áp dụng cho toàn site.
        </p>
      </div>
    </div>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/25 dark:border-slate-700 dark:bg-slate-800";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, { text: string; cls: string }> = {
    idle: { text: "Sẵn sàng", cls: "bg-slate-100 text-slate-500 dark:bg-slate-800" },
    saving: { text: "Đang lưu nháp…", cls: "bg-amber-100 text-amber-700" },
    saved: { text: "✓ Đã lưu nháp", cls: "bg-emerald-100 text-emerald-700" },
    error: { text: "Lưu lỗi", cls: "bg-rose-100 text-rose-700" },
  };
  const s = map[status];
  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${s.cls}`}>{s.text}</span>;
}
