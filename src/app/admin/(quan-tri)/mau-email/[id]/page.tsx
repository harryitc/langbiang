// Trang quản trị: soạn MỘT mẫu email.
import { getDraftContent } from "@/lib/content/store";
import EmailTemplateEditor from "@/components/admin/editors/EmailTemplateEditor";

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
    <EmailTemplateEditor
      initialTemplates={emailTemplates}
      templateId={decodeURIComponent(id)}
      forms={main.registerForms.map((f) => ({
        id: f.id,
        name: f.name,
        confirmTemplateId: f.confirmTemplateId,
        notifyTemplateId: f.notifyTemplateId,
      }))}
    />
  );
}
