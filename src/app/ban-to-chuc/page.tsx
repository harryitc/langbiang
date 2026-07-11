import type { Metadata } from "next";
import Link from "next/link";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import SubPageHeader from "@/components/SubPageHeader";
import Members from "@/components/sections/Board";
import Footer from "@/components/sections/Footer";
import { board } from "@/lib/site";

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
        {/* Hero — tiêu đề trái, cards absolute bên phải */}
        <section className="relative min-h-[100svh] overflow-hidden bg-gradient-to-b from-sky-soft via-[#dff2e6] to-cream dark:from-[#0a1626] dark:via-night-2 dark:to-night">

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

          {/* Cards ban sáng lập — mỗi card absolute riêng, tự do định vị */}

          {/* Trưởng ban */}
          {lead && (
            <div className="absolute top-[12%] right-[6%] hidden w-[380px] rounded-3xl bg-gradient-to-br from-leaf/12 to-sun/12 p-6 shadow-soft ring-1 ring-leaf/25 backdrop-blur-sm dark:from-leaf-bright/10 dark:to-sun/5 dark:ring-leaf-bright/20 lg:block">
              <div className="flex items-start gap-5">
                <span className="flex h-36 w-36 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass text-2xl font-bold text-white ring-2 ring-white/60 shadow dark:ring-white/10">
                  {lead.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={lead.photo} alt={lead.name} loading="eager" decoding="async" className="h-full w-full object-cover" />
                  ) : initials(lead.name)}
                </span>
                <div>
                  <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-sun/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-sunset">
                    ⭐ Trưởng ban
                  </span>
                  <p className="text-xl font-bold text-forest dark:text-ink">{lead.name}</p>
                  <p className="text-sm font-semibold text-leaf-deep dark:text-leaf-bright">{lead.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-forest/70 dark:text-ink/70">{lead.bio}</p>
                </div>
              </div>
            </div>
          )}

          {/* Đồng sáng lập 1 */}
          {coFounders[0] && (
            <div className="absolute bottom-[12%] right-[22%] hidden w-[280px] items-start gap-4 rounded-3xl bg-white/85 p-5 shadow-soft ring-1 ring-leaf/10 backdrop-blur-sm dark:bg-white/[0.06] dark:ring-leaf-bright/10 lg:flex">
              <span className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass text-xl font-bold text-white ring-2 ring-white/60 shadow dark:ring-white/10">
                {coFounders[0].photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coFounders[0].photo} alt={coFounders[0].name} loading="eager" decoding="async" className="h-full w-full object-cover" />
                ) : initials(coFounders[0].name)}
              </span>
              <div>
                <p className="font-bold text-forest dark:text-ink">{coFounders[0].name}</p>
                <p className="text-sm font-semibold text-leaf-deep dark:text-leaf-bright">{coFounders[0].role}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-forest/70 dark:text-ink/70">{coFounders[0].bio}</p>
              </div>
            </div>
          )}

          {/* Đồng sáng lập 2 */}
          {coFounders[1] && (
            <div className="absolute bottom-[12%] right-[3%] hidden w-[280px] items-start gap-4 rounded-3xl bg-white/85 p-5 shadow-soft ring-1 ring-leaf/10 backdrop-blur-sm dark:bg-white/[0.06] dark:ring-leaf-bright/10 lg:flex">
              <span className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass text-xl font-bold text-white ring-2 ring-white/60 shadow dark:ring-white/10">
                {coFounders[1].photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coFounders[1].photo} alt={coFounders[1].name} loading="eager" decoding="async" className="h-full w-full object-cover" />
                ) : initials(coFounders[1].name)}
              </span>
              <div>
                <p className="font-bold text-forest dark:text-ink">{coFounders[1].name}</p>
                <p className="text-sm font-semibold text-leaf-deep dark:text-leaf-bright">{coFounders[1].role}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-forest/70 dark:text-ink/70">{coFounders[1].bio}</p>
              </div>
            </div>
          )}

          {/* Mobile — cards xếp dưới tiêu đề */}
          <div className="flex flex-col gap-4 px-6 pb-16 lg:hidden">
            {lead && (
              <div className="rounded-3xl bg-gradient-to-br from-leaf/12 to-sun/12 p-5 ring-1 ring-leaf/25 dark:from-leaf-bright/10 dark:to-sun/5 dark:ring-leaf-bright/20">
                <div className="flex items-start gap-4">
                  <span className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass text-xl font-bold text-white ring-2 ring-white/60 dark:ring-white/10">
                    {lead.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={lead.photo} alt={lead.name} loading="eager" decoding="async" className="h-full w-full object-cover" />
                    ) : initials(lead.name)}
                  </span>
                  <div>
                    <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-sun/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-sunset">
                      ⭐ Trưởng ban
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
                <span className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-leaf to-grass text-lg font-bold text-white ring-2 ring-white/60 dark:ring-white/10">
                  {m.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.photo} alt={m.name} loading="eager" decoding="async" className="h-full w-full object-cover" />
                  ) : initials(m.name)}
                </span>
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
