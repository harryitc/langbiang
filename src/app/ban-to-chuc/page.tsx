import type { Metadata } from "next";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import SubPageHeader from "@/components/SubPageHeader";
import Members from "@/components/sections/Board";
import Footer from "@/components/sections/Footer";
import { getContent } from "@/lib/content/store";
import FounderGallery from "./FounderGallery";

export const metadata: Metadata = {
  title: "Ban sáng lập",
  description:
    "Gặp gỡ ban sáng lập Trăng Sáng Langbiang — những người đứng sau hành trình mang Trung thu đến trẻ em vùng cao.",
  alternates: { canonical: "/ban-to-chuc" },
};

export default async function BanToChucPage() {
  const { main, currentYear } = await getContent();
  const { board } = main;

  return (
    <>
      <SmoothScroll />
      <ThemeToggle />
      <BackToTop />
      <SubPageHeader currentYear={currentYear} />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft via-[#dff2e6] to-cream pb-16 pt-20 dark:from-[#0a1626] dark:via-night-2 dark:to-night sm:pb-24 sm:pt-24">
          {/* Ảnh nền mờ */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/team/bg-hero.jpg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-multiply dark:opacity-90 dark:mix-blend-soft-light"
          />

          {/* Tiêu đề phần Ban sáng lập */}
          <div className="relative mx-auto max-w-4xl px-5 text-center sm:px-6">
            <span className="mb-3 inline-block rounded-full bg-white/60 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-leaf-deep backdrop-blur dark:bg-white/5 dark:text-leaf-bright">
              Đội ngũ
            </span>
            <h1 className="font-display pb-4 text-4xl font-extrabold text-gradient-green sm:text-6xl">
              Ban sáng lập
            </h1>
          </div>

          {/* Danh sách Ban sáng lập — Mỗi người 1 hàng, căn giữa + click mở LightGallery */}
          <FounderGallery founders={board.founders} />
        </section>

        {/* Thành viên Ban tổ chức (Lưới responsive) */}
        <Members />

        <section className="py-16 text-center sm:py-20">
          <div className="mx-auto max-w-2xl px-5 sm:px-6">
            <p className="mb-6 text-base text-forest/70 dark:text-ink/70">
              Muốn trở thành một phần của đội ngũ mùa {currentYear}?
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
