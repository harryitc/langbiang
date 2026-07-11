import type { Metadata } from "next";
import Link from "next/link";
import SubPageShell from "@/components/SubPageShell";
import Founders from "@/components/sections/Founders";
import Members from "@/components/sections/Board";
import { board } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ban sáng lập",
  description:
    "Gặp gỡ ban sáng lập Trăng Sáng Langbiang — những người đứng sau hành trình mang Trung thu đến trẻ em vùng cao.",
  alternates: { canonical: "/ban-to-chuc" },
};

function FoundersHero() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-6 sm:gap-8">
      {board.founders.map((m) => {
        const parts = m.name.trim().split(/\s+/);
        const last = parts[parts.length - 1]?.[0] ?? "";
        const first = parts.length > 1 ? parts[parts.length - 2]?.[0] ?? "" : "";
        const ini = (first + last).toUpperCase();
        return (
          <div key={m.name} className="flex flex-col items-center gap-2">
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-leaf to-grass text-xl font-bold text-white ring-4 ring-white/50 shadow-soft dark:ring-white/20">
              {m.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.photo} alt={m.name} loading="eager" decoding="async" className="h-full w-full object-cover" />
              ) : ini}
            </span>
            <div className="text-center">
              <p className="text-sm font-bold text-forest dark:text-ink">{m.name}</p>
              <p className="text-xs text-leaf-deep dark:text-leaf-bright">{m.role}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function BanToChucPage() {
  return (
    <SubPageShell
      eyebrow="Đội ngũ"
      title="Ban sáng lập"
      subtitle="Những người thắp trăng — cùng nhau xây dựng và tổ chức từng mùa Trăng Sáng Langbiang bằng cả tấm lòng."
      hero={<FoundersHero />}
    >
      <Founders />
      <Members />

      <section className="py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-6">
          <p className="mb-6 text-base text-forest/70 dark:text-ink/70">
            Muốn trở thành một phần của đội ngũ mùa 2026?
          </p>
          <Link
            href="/#register"
            className="rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-8 py-3.5 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Đăng ký làm tình nguyện viên 🌙
          </Link>
        </div>
      </section>
    </SubPageShell>
  );
}
