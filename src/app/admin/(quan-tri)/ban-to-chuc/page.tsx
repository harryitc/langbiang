// Trang quản trị: Ban tổ chức.
// Đọc bản nháp ở server rồi truyền lát cắt nội dung xuống editor (client).
import { getDraftContent } from "@/lib/content/store";
import BoardEditor from "@/components/admin/editors/BoardEditor";

export default async function Page() {
  const content = await getDraftContent();
  return <BoardEditor initial={content.main.board} />;
}
