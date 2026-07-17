// Trang quản trị: Tình nguyện viên.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import VolunteersEditor from "@/components/admin/editors/VolunteersEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <VolunteersEditor initial={{ teams: content.main.volunteerTeams, count: content.main.volunteerCount }} />;
}
