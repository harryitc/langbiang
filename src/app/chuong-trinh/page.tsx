import type { Metadata } from "next";
import Link from "next/link";
import SubPageShell from "@/components/SubPageShell";
import Activities from "@/components/sections/Activities";
import Timeline from "@/components/sections/Timeline";

export const metadata: Metadata = {
  title: "Chương trình 2026",
  description:
    "Chương trình Trăng Sáng Langbiang 2026: các hoạt động chính và lịch trình chi tiết hai ngày một đêm (26–27/9) tại Langbiang, Đà Lạt.",
  alternates: { canonical: "/chuong-trinh" },
};

const nav = [
  { href: "#activities", label: "Hoạt động" },
  { href: "#timeline", label: "Lịch trình" },
];

export default function ChuongTrinhPage() {
  return (
    <SubPageShell
      eyebrow="Chương trình 2026"
      title="Hai ngày một đêm yêu thương"
      subtitle="Toàn bộ hoạt động và lịch trình mùa Trăng Sáng Langbiang 2026 — ngày 26–27 tháng 9 tại phường Langbiang, Đà Lạt."
      nav={nav}
    >
      <Activities />
      <Timeline />

      <section className="py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-6">
          <Link
            href="/#register"
            className="rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-8 py-3.5 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Đăng ký đồng hành 🌙
          </Link>
        </div>
      </section>
    </SubPageShell>
  );
}
