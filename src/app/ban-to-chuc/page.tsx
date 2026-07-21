import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SmoothScroll from "@/components/SmoothScroll";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import SubPageHeader from "@/components/SubPageHeader";
import Members from "@/components/sections/Board";
import Footer from "@/components/sections/Footer";
import { getContent } from "@/lib/content/store";

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

export default async function BanToChucPage() {
  const { main, currentYear } = await getContent();
  const { board } = main;
  const founders = board.founders ?? [];

  return (
    <>
      <SmoothScroll />
      <ThemeToggle />
      <BackToTop />
      <SubPageHeader currentYear={currentYear} />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-sky-soft via-[#dff2e6] to-cream pb-16 pt-28 dark:from-[#0a1626] dark:via-night-2 dark:to-night sm:pb-24 sm:pt-36">
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

          {/* Danh sách Ban sáng lập — Mỗi người 1 hàng, căn giữa */}
          <div className="relative mx-auto mt-12 max-w-3xl px-5 sm:px-6">
            <div className="flex flex-col gap-10 sm:gap-14">
              {founders.map((m, idx) => {
                const isLeader = m.isLeader || m.role?.toLowerCase().includes("trưởng ban");
                return (
                  <div
                    key={m.name + idx}
                    className="group flex flex-col items-center rounded-3xl bg-white/70 p-6 text-center shadow-sm backdrop-blur ring-1 ring-leaf/10 transition duration-300 hover:shadow-soft dark:bg-white/[0.04] dark:ring-leaf-bright/10 sm:p-8"
                  >
                    {/* Khung ảnh với Leader Star (góc trên trái) và Facebook Icon (góc dưới phải ảnh) */}
                    <div className="relative mb-5">
                      {/* Ngôi sao Trưởng ban góc trên bên trái ảnh */}
                      {isLeader && (
                        <div
                          title="Trưởng ban"
                          className="absolute -left-1 -top-1 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 via-amber-400 to-amber-500 text-white shadow-md ring-2 ring-white dark:ring-night"
                        >
                          <svg className="h-5 w-5 fill-current text-white" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        </div>
                      )}

                      {/* Icon Facebook góc dưới bên phải ảnh */}
                      {m.facebook && (
                        <a
                          href={m.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={`Facebook của ${m.name}`}
                          className="absolute bottom-1 right-1 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-md ring-2 ring-white transition-transform duration-200 hover:scale-110 dark:ring-night"
                        >
                          <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                      )}

                      {/* Ảnh đại diện */}
                      <div className="relative h-28 w-28 overflow-hidden rounded-full bg-gradient-to-br from-leaf to-grass shadow-md ring-4 ring-white dark:ring-white/10 sm:h-36 sm:w-36">
                        {m.photo ? (
                          <Image
                            src={m.photo}
                            alt={m.name}
                            fill
                            sizes="144px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-white sm:text-3xl">
                            {initials(m.name)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Họ tên */}
                    <h3 className="font-display text-xl font-bold text-forest dark:text-ink sm:text-2xl">
                      {m.name}
                    </h3>

                    {/* Vai trò */}
                    {m.role && (
                      <p className="mt-1 text-sm font-semibold text-leaf-deep dark:text-leaf-bright">
                        {m.role}
                      </p>
                    )}

                    {/* Nội dung / Giới thiệu */}
                    {m.bio && (
                      <p className="mt-3 max-w-xl text-sm leading-relaxed text-forest/75 dark:text-ink/75 sm:text-base">
                        {m.bio}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
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
