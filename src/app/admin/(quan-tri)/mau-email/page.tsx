// Trang quản trị: danh sách các mẫu email gửi tự động khi có người đăng ký.
import { getDraftContent } from "@/lib/content/store";
import EmailTemplatesEditor from "@/components/admin/editors/EmailTemplatesEditor";

export default async function Page() {
  const { main, emailTemplates, emailFromName } = await getDraftContent();
  return (
    <EmailTemplatesEditor
      initialTemplates={emailTemplates}
      initialFromName={emailFromName}
      forms={main.registerForms.map((f) => ({
        id: f.id,
        name: f.name,
        confirmTemplateId: f.confirmTemplateId,
        notifyTemplateId: f.notifyTemplateId,
      }))}
    />
  );
}
