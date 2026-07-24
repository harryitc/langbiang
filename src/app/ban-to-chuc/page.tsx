import type { Metadata } from "next";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import SubPageHeader from "@/components/SubPageHeader";
import MembersList from "@/components/sections/MembersList";
import Footer from "@/components/sections/Footer";
import { getContent } from "@/lib/content/store";
import FounderGallery from "./FounderGallery";
import OrgLeadGallery from "./OrgLeadGallery";
import HeroCanvas from "@/components/HeroCanvas";
import { LeafBranch, Daisy } from "@/components/Decor";

export const metadata: Metadata = {
  title: "Ban tổ chức",
  description:
    "Gặp gỡ ban sáng lập và ban tổ chức Trăng Sáng Langbiang — những người đứng sau hành trình mang Trung thu đến trẻ em vùng cao.",
  alternates: { canonical: "/ban-to-chuc" },
};

export default async function BanToChucPage() {
  const { main, currentYear } = await getContent();
  const { board } = main;

  // Tách trưởng ban tổ chức ra khỏi danh sách thành viên
  const orgLeaders = (board?.members ?? []).filter(
    (m) => m.isLeader || m.role?.toLowerCase().includes("trưởng ban")
  );
  const orgNonLeaders = (board?.members ?? []).filter(
    (m) => !m.isLeader && !m.role?.toLowerCase().includes("trưởng ban")
  );

  return (
    <>
      <SmoothScroll />
      <ThemeToggle />
      <BackToTop />
      <SubPageHeader currentYear={currentYear} />

      {/* Toàn bộ trang nằm trong một main duy nhất với nền hero xuyên suốt */}
      <main className="relative overflow-hidden bg-gradient-to-b from-sky-soft via-[#c9ecf2] to-cream dark:from-[#0a1626] dark:via-night-2 dark:to-night">
        {/* Canvas trăng + đom đóm + lá bay — trải xuyên suốt toàn trang */}
        <HeroCanvas />

        {/* Cành lá góc trái trên */}
        <LeafBranch className="pointer-events-none absolute -left-6 -top-6 z-10 h-56 w-72 animate-sway opacity-90 md:h-72 md:w-96" />
        {/* Hoa cúc góc phải giữa trang */}
        <Daisy className="pointer-events-none absolute right-6 top-1/3 z-10 h-16 w-16 animate-float opacity-70 md:h-24 md:w-24" />
        {/* Hoa cúc nhỏ góc trái dưới */}
        <Daisy className="pointer-events-none absolute bottom-32 left-8 z-10 h-10 w-10 animate-float opacity-50 md:h-14 md:w-14 [animation-delay:2s]" />

        {/* ── BAN SÁNG LẬP ── */}
        <section className="relative z-20 pb-16 pt-20 sm:pb-24 sm:pt-24">
          <div className="mx-auto max-w-4xl px-5 text-center sm:px-6">
            <span className="mb-3 inline-block rounded-full bg-white/50 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-leaf-deep backdrop-blur dark:bg-white/5 dark:text-leaf-bright">
              Đội ngũ
            </span>
            <h1 className="font-display pb-4 text-4xl font-extrabold text-gradient-green sm:text-6xl">
              Ban sáng lập
            </h1>
          </div>

          <FounderGallery founders={board.founders} />
        </section>

        {/* Đường phân cách mỏng */}
        {board?.members && board.members.length > 0 && (
          <div className="relative z-20 mx-auto max-w-6xl px-5 sm:px-6">
            <div className="h-px bg-gradient-to-r from-transparent via-leaf/30 to-transparent" />
          </div>
        )}

        {/* ── BAN TỔ CHỨC ── */}
        {board?.members && board.members.length > 0 && (
          <section id="members" className="relative z-20 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-5 sm:px-6">
              <div className="mx-auto max-w-2xl text-center">
                <span className="mb-3 inline-block rounded-full bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep backdrop-blur dark:bg-white/5 dark:text-leaf-bright">
                  Đội ngũ
                </span>
                <h2 className="font-display text-3xl font-extrabold text-gradient-green sm:text-5xl">
                  Ban tổ chức
                </h2>
              </div>

              {/* Trưởng ban tổ chức — gallery căn giữa, ảnh nhỏ hơn ban sáng lập */}
              {orgLeaders.length > 0 && (
                <OrgLeadGallery members={orgLeaders} />
              )}

              {/* Đường phân cách mỏng giữa trưởng ban và thành viên (chỉ khi có cả hai) */}
              {orgLeaders.length > 0 && orgNonLeaders.length > 0 && (
                <div className="mb-2 h-px bg-gradient-to-r from-transparent via-leaf/20 to-transparent" />
              )}

              {/* Thành viên ban tổ chức (không phải trưởng ban) — dạng card */}
              {orgNonLeaders.length > 0 && (
                <MembersList members={orgNonLeaders} />
              )}
            </div>
          </section>
        )}

        {/* Đường phân cách mỏng */}
        <div className="relative z-20 mx-auto max-w-6xl px-5 sm:px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-leaf/30 to-transparent" />
        </div>

        {/* ── NÚT ĐĂNG KÝ ── */}
        <section className="relative z-20 py-16 text-center sm:py-20">
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
