import { requireAdmin, previewEnabled } from "@/lib/admin-guard";
import { getDraftContent } from "@/lib/content/store";
import AdminShell from "@/components/admin/AdminShell";
import DonationsEditor from "@/components/admin/editors/DonationsEditor";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAdmin();
  const [content, preview] = await Promise.all([getDraftContent(), previewEnabled()]);
  return (
    <AdminShell previewOn={preview}>
      <DonationsEditor initial={content.donations} />
    </AdminShell>
  );
}
