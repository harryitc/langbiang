import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SubPageShell from "@/components/SubPageShell";
import RetroSummary from "@/components/sections/RetroSummary";
import Gallery from "@/components/sections/Gallery";
import Volunteers from "@/components/sections/Volunteers";
import Journey from "@/components/sections/Journey";
import Sponsors from "@/components/sections/Sponsors";
import { getContent } from "@/lib/content/store";
import type { PastYear } from "@/lib/content/schema";

type Params = { year: string };

/** Sinh sẵn một trang cho mỗi năm trong danh mục "năm đã qua" (FR4). */
export async function generateStaticParams(): Promise<Params[]> {
  const { pastYears } = await getContent();
  return pastYears.map((y) => ({ year: String(y.year) }));
}

/** Tìm năm trong danh mục theo tham số đường dẫn. */
async function findYear(param: string): Promise<PastYear | undefined> {
  if (!/^\d{4}$/.test(param)) return undefined;
  const { pastYears } = await getContent();
  return pastYears.find((y) => y.year === Number(param));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { year } = await params;
  const data = await findYear(year);
  if (!data) return { title: "Không tìm thấy trang" };

  return {
    title: data.title,
    description:
      data.subtitle ??
      `Nhìn lại hành trình Trăng Sáng Langbiang mùa ${data.year}: khoảnh khắc, đại gia đình tình nguyện và những con số biết nói.`,
    alternates: { canonical: `/${data.year}` },
  };
}

export default async function PastYearPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { year } = await params;
  const data = await findYear(year);
  if (!data) notFound();

  const { currentYear } = await getContent();

  // Chỉ hiện mục điều hướng cho những phần có nội dung (FR4 — phần rỗng thì ẩn).
  const nav = [
    data.summaryHtml.trim() && { href: "#summary", label: "Tổng kết" },
    data.gallery.length > 0 && { href: "#gallery", label: "Khoảnh khắc" },
    data.volunteerTeams.length > 0 && { href: "#team", label: "Đại gia đình" },
    data.stats.length > 0 && { href: "#journey", label: "Những con số" },
    data.sponsorTiers.length > 0 && { href: "#sponsors", label: "Nhà tài trợ" },
  ].filter((n): n is { href: string; label: string } => Boolean(n));

  // Tổng số TNV của mùa = tổng thành viên các ban.
  const volunteerCount = data.volunteerTeams.reduce(
    (sum, t) => sum + t.members.filter((m) => m.trim()).length,
    0
  );

  return (
    <SubPageShell
      eyebrow={data.eyebrow || "Hồi ức"}
      title={data.title}
      subtitle={data.subtitle ?? ""}
      nav={nav}
      bgImage={data.bgImage}
    >
      <RetroSummary html={data.summaryHtml} title={data.title} year={data.year} />
      <Gallery photos={data.gallery} year={data.year} />
      <Volunteers
        id="team"
        teams={data.volunteerTeams}
        count={volunteerCount}
        year={data.year}
      />
      <Journey
        stats={data.stats}
        year={data.year}
        photos={data.gallery.slice(0, 3)}
      />
      <Sponsors tiers={data.sponsorTiers} currentYear={currentYear} />

      <section className="py-16 text-center sm:py-24">
        <div className="mx-auto max-w-2xl px-5 sm:px-6">
          <h2 className="text-2xl font-extrabold text-forest sm:text-4xl dark:text-ink">
            Sẵn sàng cho mùa{" "}
            <span className="text-gradient-green">{currentYear}</span>?
          </h2>
          <p className="mt-3 text-base text-forest/75 sm:text-lg dark:text-ink/75">
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
              href="/ban-to-chuc"
              className="rounded-full border-2 border-leaf-deep/30 bg-white/60 px-8 py-3.5 font-semibold text-leaf-deep transition hover:-translate-y-0.5 hover:bg-white dark:border-leaf-bright/25 dark:bg-white/5 dark:text-leaf-bright dark:hover:bg-white/10"
            >
              Gặp ban tổ chức
            </Link>
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
