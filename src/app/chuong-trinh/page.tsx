import type { Metadata } from "next";
import Link from "next/link";
import SubPageShell from "@/components/SubPageShell";
import Activities from "@/components/sections/Activities";
import Timeline from "@/components/sections/Timeline";
import { getContent } from "@/lib/content/store";
import { fillYear, eventDateLabel } from "@/lib/content/year";

export async function generateMetadata(): Promise<Metadata> {
  const { main, currentYear } = await getContent();
  return {
    title: `Chương trình ${currentYear}`,
    description: `Chương trình Trăng Sáng Langbiang ${currentYear}: các hoạt động chính và lịch trình chi tiết hai ngày một đêm — ${eventDateLabel(
      main.event.dateLabel,
      currentYear
    )} tại ${main.event.location}.`,
    alternates: { canonical: "/chuong-trinh" },
  };
}

const nav = [
  { href: "#activities", label: "Hoạt động" },
  { href: "#timeline", label: "Lịch trình" },
];

export default async function ChuongTrinhPage() {
  const { main, currentYear } = await getContent();
  const { event } = main;

  return (
    <SubPageShell
      eyebrow={`Chương trình ${currentYear}`}
      title="Hai ngày một đêm yêu thương"
      subtitle={`Toàn bộ hoạt động và lịch trình mùa Trăng Sáng Langbiang ${currentYear} — ${eventDateLabel(
        event.dateLabel,
        currentYear
      )} tại ${event.location}.`}
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
