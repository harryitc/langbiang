import type { Metadata } from "next";
import SubPageShell from "@/components/SubPageShell";
import News from "@/components/sections/News";
import { getPublishedContent } from "@/lib/content/store";

export const metadata: Metadata = {
  title: "Tin tức & Bản tin",
  description:
    "Tin tức, nhật ký hành trình và bản tin mới nhất về dự án tình nguyện Trăng Sáng Langbiang.",
  alternates: { canonical: "/tin-tuc" },
};

export default async function NewsPage() {
  const { news } = await getPublishedContent();
  return (
    <SubPageShell
      eyebrow="Tin tức & Bản tin"
      title="Câu chuyện từ hành trình"
      subtitle="Những dòng nhật ký, hình ảnh và tin tức mới nhất về Trăng Sáng Langbiang. Đăng ký bản tin để không bỏ lỡ mùa 2026!"
    >
      <News showHeading={false} posts={news} />
    </SubPageShell>
  );
}
