import { requireAdmin, previewEnabled } from "@/lib/admin-guard";
import { getDraftContent } from "@/lib/content/store";
import AdminShell from "@/components/admin/AdminShell";
import SiteEditor from "@/components/admin/SiteEditor";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  await requireAdmin();
  const [{ site }, preview] = await Promise.all([getDraftContent(), previewEnabled()]);
  return (
    <AdminShell previewOn={preview}>
      <SiteEditor initial={site} />
    </AdminShell>
  );
}
