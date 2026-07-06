import type { Metadata } from "next";
import Link from "next/link";
import SubPageShell from "@/components/SubPageShell";
import Board from "@/components/sections/Board";

export const metadata: Metadata = {
  title: "Ban sáng lập & Ban tổ chức",
  description:
    "Gặp gỡ ban sáng lập và ban tổ chức Trăng Sáng Langbiang — những người đứng sau hành trình mang Trung thu đến trẻ em vùng cao.",
  alternates: { canonical: "/ban-to-chuc" },
};

export default function BanToChucPage() {
  return (
    <SubPageShell
      eyebrow="Đội ngũ"
      title="Ban sáng lập & Tổ chức"
      subtitle="Những người thắp trăng — cùng nhau xây dựng và tổ chức từng mùa Trăng Sáng Langbiang bằng cả tấm lòng."
    >
      <Board showHeading={false} />

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
