import type { Metadata } from "next";
import SubPageShell from "@/components/SubPageShell";
import Fundraising from "@/components/sections/Fundraising";
import Reveal from "@/components/Reveal";
import { fundraising } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gây quỹ & Đồng hành",
  description:
    "Chung tay gây quỹ cùng Trăng Sáng Langbiang qua gian hàng Shopee, chuyển khoản hoặc ủng hộ hiện vật. Mỗi đóng góp là một mùa Trung thu cho em nhỏ vùng cao.",
  alternates: { canonical: "/gay-quy" },
};

const usage = [
  { icon: "🎁", pct: "45%", label: "Quà & nhu yếu phẩm cho các em" },
  { icon: "🏮", pct: "25%", label: "Đêm hội & sân chơi Trung thu" },
  { icon: "📚", pct: "20%", label: "Sách vở, học bổng, dụng cụ học tập" },
  { icon: "🚌", pct: "10%", label: "Hậu cần & di chuyển đoàn" },
];

export default function FundraisingPage() {
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

      {/* Quỹ được sử dụng như thế nào */}
      <section className="bg-[#eef8ea] py-20 dark:bg-night-2 sm:py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
              Minh bạch
            </span>
            <h2 className="text-3xl font-extrabold text-forest sm:text-4xl dark:text-ink">
              Quỹ được dùng vào việc gì?
            </h2>
            <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
              Mọi đóng góp đều được sử dụng đúng mục đích và công khai trên Fanpage
              sau mỗi mùa dự án.
            </p>
          </Reveal>

          <Reveal childrenStagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {usage.map((u) => (
              <div
                key={u.label}
                className="rounded-3xl bg-white/80 p-6 text-center shadow-sm ring-1 ring-leaf/10 dark:bg-white/[0.04] dark:ring-leaf-bright/10"
              >
                <span className="text-4xl">{u.icon}</span>
                <p className="mt-3 font-display text-3xl font-bold text-leaf-deep dark:text-leaf-bright">
                  {u.pct}
                </p>
                <p className="mt-1 text-sm text-forest/75 dark:text-ink/70">
                  {u.label}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>
    </SubPageShell>
  );
}
