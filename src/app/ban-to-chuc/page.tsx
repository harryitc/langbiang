import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import SubPageHeader from "@/components/SubPageHeader";
import Members from "@/components/sections/Board";
import Footer from "@/components/sections/Footer";
import { board } from "@/lib/site";
import FounderGallery from "./FounderGallery";

export const metadata: Metadata = {
  title: "Ban sáng lập",
  description:
    "Gặp gỡ ban sáng lập Trăng Sáng Langbiang — những người đứng sau hành trình mang Trung thu đến trẻ em vùng cao.",
  alternates: { canonical: "/ban-to-chuc" },
};

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const last = parts[parts.length - 1]?.[0] ?? "";
  const first = parts.length > 1 ? parts[parts.length - 2]?.[0] ?? "" : "";
  return (first + last).toUpperCase();
}

export default function BanToChucPage() {
  const [lead, ...coFounders] = board.founders;

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <ThemeToggle />
      <BackToTop />
      <SubPageHeader />

      <main>
        <section className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-sky-soft via-[#dff2e6] to-cream dark:from-[#0a1626] dark:via-night-2 dark:to-night">

          {/* Ảnh nền mờ */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/BRO01542.JPG"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply dark:opacity-90 dark:mix-blend-soft-light"
          />

          {/* Nội dung tiêu đề — trái, căn giữa dọc */}
          <div className="flex min-h-[100svh] items-center px-8 sm:px-16 lg:px-24">
            <div className="max-w-lg">
              <span className="mb-4 inline-block rounded-full bg-white/50 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-leaf-deep backdrop-blur dark:bg-white/5 dark:text-leaf-bright">
                Đội ngũ
              </span>
              <h1 className="font-display pb-4 text-5xl font-bold leading-[1.12] text-gradient-green sm:text-6xl md:text-7xl">
                Ban sáng lập
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-forest/75 dark:text-ink/75">
                Những người thắp trăng — cùng nhau xây dựng và tổ chức từng mùa Trăng Sáng Langbiang bằng cả tấm lòng.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/#register"
                  className="rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-110"
                >
                  Đăng ký đồng hành 🌙
                </Link>
                <Link
                  href="/"
                  className="rounded-full border-2 border-leaf-deep/30 bg-white/60 px-7 py-3 text-sm font-semibold text-leaf-deep backdrop-blur transition hover:-translate-y-0.5 hover:bg-white dark:border-leaf-bright/25 dark:bg-white/5 dark:text-leaf-bright dark:hover:bg-white/10"
                >
                  Về trang chủ
                </Link>
              </div>
            </div>
          </div>

          {/* Polaroid cards + lightgallery (client component) */}
          <FounderGallery />

          {/* Mobile — cards xếp dưới tiêu đề */}
          <div className="flex flex-col gap-4 px-6 pb-16 lg:hidden">
            {lead && (
              <div className="rounded-3xl bg-gradient-to-br from-leaf/12 to-sun/12 p-5 ring-1 ring-leaf/25 dark:from-leaf-bright/10 dark:to-sun/5 dark:ring-leaf-bright/20">
                <div className="flex items-start gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass ring-2 ring-white/60 dark:ring-white/10">
                    {lead.photo ? (
                      <Image src={lead.photo} alt={lead.name} fill sizes="96px" className="object-cover" />
                    ) : <span className="flex h-full w-full items-center justify-center text-xl font-bold text-white">{initials(lead.name)}</span>}
                  </div>
                  <div>
                    <span className="mb-1 inline-flex items-center rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                      Trưởng ban
                    </span>
                    <p className="text-lg font-bold text-forest dark:text-ink">{lead.name}</p>
                    <p className="text-sm font-semibold text-leaf-deep dark:text-leaf-bright">{lead.role}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-forest/70 dark:text-ink/70">{lead.bio}</p>
                  </div>
                </div>
              </div>
            )}
            {coFounders.map((m) => (
              <div key={m.name} className="flex items-start gap-4 rounded-3xl bg-white/80 p-5 ring-1 ring-leaf/10 dark:bg-white/[0.04] dark:ring-leaf-bright/10">
                <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass ring-2 ring-white/60 dark:ring-white/10">
                  {m.photo ? (
                    <Image src={m.photo} alt={m.name} fill sizes="80px" className="object-cover" />
                  ) : <span className="flex h-full w-full items-center justify-center text-lg font-bold text-white">{initials(m.name)}</span>}
                </div>
                <div>
                  <p className="font-bold text-forest dark:text-ink">{m.name}</p>
                  <p className="text-sm font-semibold text-leaf-deep dark:text-leaf-bright">{m.role}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-forest/70 dark:text-ink/70">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Thành viên (hiển thị khi có dữ liệu) */}
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
      </main>

      <Footer />
    </>
  );
}

