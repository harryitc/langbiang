import { requireAdmin, previewEnabled } from "@/lib/admin-guard";
import { getDraftContent } from "@/lib/content/store";
import AdminShell from "@/components/admin/AdminShell";
import GalleryEditor from "@/components/admin/editors/GalleryEditor";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAdmin();
  const [content, preview] = await Promise.all([getDraftContent(), previewEnabled()]);
  return (
    <AdminShell previewOn={preview}>
      <GalleryEditor initial={content.gallery} />
    </AdminShell>
  );
}
