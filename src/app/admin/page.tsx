import { requireAdmin, previewEnabled } from "@/lib/admin-guard";
import AdminShell from "@/components/admin/AdminShell";
import DashboardBody from "@/components/admin/DashboardBody";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();
  const preview = await previewEnabled();
  return (
    <AdminShell previewOn={preview}>
      <DashboardBody />
    </AdminShell>
  );
}
