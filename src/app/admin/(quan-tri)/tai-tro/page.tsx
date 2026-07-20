// Trang quản trị: Nhà tài trợ.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import SponsorsEditor from "@/components/admin/editors/SponsorsEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <SponsorsEditor initial={content.main.sponsorTiers} />;
}
