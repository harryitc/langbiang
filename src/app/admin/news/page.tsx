import { requireAdmin, previewEnabled } from "@/lib/admin-guard";
import { getDraftContent } from "@/lib/content/store";
import AdminShell from "@/components/admin/AdminShell";
import NewsEditor from "@/components/admin/NewsEditor";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  await requireAdmin();
  const [{ news }, preview] = await Promise.all([getDraftContent(), previewEnabled()]);
  return (
    <AdminShell previewOn={preview}>
      <NewsEditor initial={news} />
    </AdminShell>
  );
}
