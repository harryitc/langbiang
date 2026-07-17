import { requireAdmin, previewEnabled } from "@/lib/admin-guard";
import { getDraftContent } from "@/lib/content/store";
import AdminShell from "@/components/admin/AdminShell";
import VolunteersEditor from "@/components/admin/editors/VolunteersEditor";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAdmin();
  const [content, preview] = await Promise.all([getDraftContent(), previewEnabled()]);
  return (
    <AdminShell previewOn={preview}>
      <VolunteersEditor teams={content.volunteerTeams} count={content.volunteerCount} />
    </AdminShell>
  );
}
