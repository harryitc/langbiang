// Trang quản trị: Chân trang.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import FooterEditor from "@/components/admin/editors/FooterEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <FooterEditor initial={content.main.footer} />;
}
