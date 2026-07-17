import { requireAdmin, previewEnabled } from "@/lib/admin-guard";
import { getDraftContent } from "@/lib/content/store";
import AdminShell from "@/components/admin/AdminShell";
import SpendingEditor from "@/components/admin/editors/SpendingEditor";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAdmin();
  const [content, preview] = await Promise.all([getDraftContent(), previewEnabled()]);
  return (
    <AdminShell previewOn={preview}>
      <SpendingEditor initial={content.spendingReport} />
    </AdminShell>
  );
}
