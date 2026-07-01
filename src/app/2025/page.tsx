import type { Metadata } from "next";
import Link from "next/link";
import SubPageShell from "@/components/SubPageShell";
import Gallery from "@/components/sections/Gallery";
import Team from "@/components/sections/Team";
import Volunteers from "@/components/sections/Volunteers";
import Sponsors from "@/components/sections/Sponsors";

export const metadata: Metadata = {
  title: "Nhìn lại mùa 2025",
  description:
    "Nhìn lại hành trình Trăng Sáng Langbiang mùa 2025: khoảnh khắc, đội ngũ tình nguyện viên và nhà tài trợ đã đồng hành.",
  alternates: { canonical: "/2025" },
};

const nav = [
  { href: "#gallery", label: "Khoảnh khắc" },
  { href: "#team", label: "Đại gia đình" },
  { href: "#volunteers", label: "Tình nguyện viên" },
  { href: "#sponsors", label: "Tài trợ" },
];

export default function Retro2025Page() {
  return (
    <SubPageShell
      eyebrow="Hồi ức"
      title="Nhìn lại mùa 2025"
      subtitle="Mùa Trăng Sáng Langbiang đầu tiên — nơi những tấm lòng gặp nhau và viết nên một câu chuyện thật đẹp giữa cao nguyên."
      nav={nav}
    >
      <Gallery />
      <Team />
      <Volunteers />
      <Sponsors />

      <section className="py-20 text-center sm:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl dark:text-ink">
            Sẵn sàng cho mùa <span className="text-gradient-green">2026</span>?
          </h2>
          <p className="mt-3 text-lg text-forest/75 dark:text-ink/75">
            Hành trình mới đang chờ bạn. Cùng chúng mình viết tiếp câu chuyện nhé!
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/#register"
              className="rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-8 py-3.5 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Đăng ký tham gia 🌙
            </Link>
            <Link
              href="/tin-tuc"
              className="rounded-full border-2 border-leaf-deep/30 bg-white/60 px-8 py-3.5 font-semibold text-leaf-deep transition hover:-translate-y-0.5 hover:bg-white dark:border-leaf-bright/25 dark:bg-white/5 dark:text-leaf-bright dark:hover:bg-white/10"
            >
              Xem tin tức
            </Link>
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
