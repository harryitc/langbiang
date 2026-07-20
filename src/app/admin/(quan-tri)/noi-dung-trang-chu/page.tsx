// Trang quản trị: chữ ở đầu trang chủ (khối Hero).
import { getDraftContent } from "@/lib/content/store";
import HomeTextEditor from "@/components/admin/editors/HomeTextEditor";

export default async function Page() {
  const { main } = await getDraftContent();
  return <HomeTextEditor initial={main.site} />;
}
