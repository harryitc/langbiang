import type { Metadata } from "next";
import SubPageShell from "@/components/SubPageShell";
import Fundraising from "@/components/sections/Fundraising";
import Sponsors from "@/components/sections/Sponsors";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/content/store";

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

      {/* Báo cáo chi (thay cho "Quỹ dùng để làm gì?") */}
      <section id="bao-cao-chi" className="bg-[#eef8ea] py-16 dark:bg-night-2 sm:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-6">
          <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
            <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
              Minh bạch
            </span>
            <h2 className="text-2xl font-extrabold text-forest sm:text-4xl dark:text-ink">
              Báo cáo chi
            </h2>
            <p className="mt-4 text-base text-forest/75 sm:text-lg dark:text-ink/75">
              Mọi đóng góp đều được sử dụng đúng mục đích và công khai sau mỗi mùa
              dự án.
            </p>
          </Reveal>

          <Reveal childrenStagger className="space-y-3">
            {spendingReport.items.map((it) => (
              <div
                key={it.item}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-2xl bg-white/85 px-5 py-4 shadow-sm ring-1 ring-leaf/10 dark:bg-white/[0.04] dark:ring-leaf-bright/10"
              >
                <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-leaf/15 to-sun/15 text-2xl">
                  {it.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-forest dark:text-ink">
                    {it.item}
                  </span>
                  {it.note && (
                    <span className="block text-xs text-forest/55 dark:text-ink/50">
                      {it.note}
                    </span>
                  )}
                </span>
                <span className="font-bold text-leaf-deep dark:text-leaf-bright">
                  {it.amount}
                </span>
              </div>
            ))}
          </Reveal>

          <Reveal className="mt-5">
            <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-leaf-deep to-leaf px-5 py-4 text-white shadow-soft">
              <span className="font-bold uppercase tracking-wide">Tổng chi</span>
              <span className="text-lg font-extrabold">{spendingReport.total}</span>
            </div>
            <p className="mt-4 text-center text-sm text-forest/60 dark:text-ink/60">
              {spendingReport.updatedNote}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Nhà tài trợ mùa hiện tại (main.sponsorTiers) — tự ẩn nếu chưa có đơn vị nào. */}
      <Sponsors tiers={sponsorTiers} currentYear={currentYear} />
    </SubPageShell>
  );
}
