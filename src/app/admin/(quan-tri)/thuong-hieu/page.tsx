// Trang quản trị: Thương hiệu & SEO.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import SiteEditor from "@/components/admin/editors/SiteEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <SiteEditor initial={content.main.site} />;
}
