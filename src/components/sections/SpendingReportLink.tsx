import Reveal from "@/components/Reveal";
import { fillYear } from "@/lib/content/year";
import type { SpendingReport } from "@/lib/content/schema";

/**
 * Khối "Báo cáo thu – chi" — không dựng bảng số liệu trên web, chỉ trỏ sang
 * Google Sheet. Dùng chung cho trang Gây quỹ (mùa hiện tại) và trang "Nhìn lại"
 * của từng năm đã qua. Chưa có link thì ẩn hẳn.
 */
export default function SpendingReportLink({
  report,
  year,
}: {
  report?: SpendingReport;
  /** Năm dùng để thay ký hiệu {năm} trong ghi chú. */
  year: number;
}) {
  const url = report?.url?.trim();
  if (!url) return null;

  return (
    <section id="bao-cao-chi" className="bg-[#eef8ea] py-16 dark:bg-night-2 sm:py-24">
      <div className="mx-auto max-w-2xl px-5 text-center sm:px-6">
        <Reveal>
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Minh bạch
          </span>
          <h2 className="text-2xl font-extrabold text-forest sm:text-4xl dark:text-ink">
            Báo cáo thu – chi
          </h2>
          {report?.note?.trim() ? (
            <p className="mt-4 text-base text-forest/75 sm:text-lg dark:text-ink/75">
              {fillYear(report.note, year)}
            </p>
          ) : null}
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Xem báo cáo chi tiết
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
