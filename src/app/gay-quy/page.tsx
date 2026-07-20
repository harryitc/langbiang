import type { Metadata } from "next";
import SubPageShell from "@/components/SubPageShell";
import Fundraising from "@/components/sections/Fundraising";
import Sponsors from "@/components/sections/Sponsors";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content/store";
import { fillYear } from "@/lib/content/year";

export const metadata: Metadata = {
  title: "Gây quỹ & Đồng hành",
  description:
    "Chung tay gây quỹ cùng Trăng Sáng Langbiang qua gian hàng Shopee, chuyển khoản hoặc ủng hộ hiện vật. Mỗi đóng góp là một mùa Trung thu cho em nhỏ vùng cao.",
  alternates: { canonical: "/gay-quy" },
};

export default async function FundraisingPage() {
  const { main, currentYear } = await getContent();
  const { fundraising, spendingReport, sponsorTiers } = main;

  return (
    <SubPageShell
      eyebrow="Chung tay gây quỹ"
      title={
        <>
          {fundraising.title} <span className="text-gradient-sun">Trăng Sáng</span>
        </>
      }
      subtitle={fundraising.desc}
    >
      <Fundraising showHeading={false} bg={false} />

      {/* Báo cáo chi — chỉ trỏ sang Google Sheet; tự ẩn nếu chưa có link.
          Dùng optional chaining phòng dữ liệu cũ (trước khi đổi sang link). */}
      {spendingReport?.url?.trim() ? (
        <section id="bao-cao-chi" className="bg-[#eef8ea] py-16 dark:bg-night-2 sm:py-24">
          <div className="mx-auto max-w-2xl px-5 text-center sm:px-6">
            <Reveal>
              <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
                Minh bạch
              </span>
              <h2 className="text-2xl font-extrabold text-forest sm:text-4xl dark:text-ink">
                Báo cáo thu – chi
              </h2>
              {spendingReport.note?.trim() ? (
                <p className="mt-4 text-base text-forest/75 sm:text-lg dark:text-ink/75">
                  {fillYear(spendingReport.note, currentYear)}
                </p>
              ) : null}
              <a
                href={spendingReport.url}
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
      ) : null}

      {/* Nhà tài trợ mùa hiện tại (main.sponsorTiers) — tự ẩn nếu chưa có đơn vị nào. */}
      <Sponsors tiers={sponsorTiers} currentYear={currentYear} />
    </SubPageShell>
  );
}
