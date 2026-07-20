// Trang quản trị: chỉnh sửa MỘT form đăng ký.
// Đường dẫn trên thanh địa chỉ chính là đường dẫn chia sẻ của form.
import { getDraftContent } from "@/lib/content/store";
import RegisterFormEditor from "@/components/admin/editors/RegisterFormEditor";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ main, emailTemplates }, { id }] = await Promise.all([
    getDraftContent(),
    params,
  ]);

  return (
    <RegisterFormEditor
      initialForms={main.registerForms}
      initialActiveId={main.activeRegisterFormId}
      formId={decodeURIComponent(id)}
      templates={emailTemplates}
    />
  );
}
