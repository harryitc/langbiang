// Trang quản trị: Gây quỹ.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import FundraisingEditor from "@/components/admin/editors/FundraisingEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <FundraisingEditor initial={content.main.fundraising} />;
}
