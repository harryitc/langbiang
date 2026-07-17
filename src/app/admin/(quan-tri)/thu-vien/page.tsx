// Trang quản trị: Thư viện ảnh.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import GalleryEditor from "@/components/admin/editors/GalleryEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <GalleryEditor initial={content.main.gallery} />;
}
