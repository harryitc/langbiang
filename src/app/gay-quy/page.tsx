import type { Metadata } from "next";
import SubPageShell from "@/components/SubPageShell";
import Fundraising from "@/components/sections/Fundraising";
import Sponsors from "@/components/sections/Sponsors";
import SpendingReportLink from "@/components/sections/SpendingReportLink";
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
          {fundraising.title}
          {/* <span className="text-gradient-sun">Trăng Sáng</span> */}
        </>
      }
      subtitle={fundraising.desc}
    >
      <Fundraising showHeading={false} bg={false} />

      <SpendingReportLink report={spendingReport} year={currentYear} />

      {/* Nhà tài trợ mùa hiện tại (main.sponsorTiers) — tự ẩn nếu chưa có đơn vị nào. */}
      <Sponsors tiers={sponsorTiers} currentYear={currentYear} header={main.sponsorsHeader} />
    </SubPageShell>
  );
}
