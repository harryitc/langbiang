// Trang quản trị: Bài tin tức.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import NewsEditor from "@/components/admin/editors/NewsEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <NewsEditor initial={content.news} />;
}
