// Trang quản trị: Slideshow trang chủ (main.gallery).
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import SlideshowEditor from "@/components/admin/editors/SlideshowEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <SlideshowEditor initial={content.main.gallery} />;
}
