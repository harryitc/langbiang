import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getDraftContent } from "@/lib/content/store";
import { site } from "@/lib/site";
import AdminBar from "@/components/admin/AdminBar";
import SiteEditor from "@/components/admin/SiteEditor";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const { site: meta } = await getDraftContent();

  return (
    <>
      <AdminBar active="/admin/site" />
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Thông tin & SEO</h1>
          <p className="mt-1 text-sm text-slate-500">
            Các trường này ảnh hưởng tiêu đề trang, mô tả và thẻ chia sẻ mạng xã
            hội. Xem trước cập nhật ngay bên phải.
          </p>
        </div>
        <SiteEditor initial={meta} siteUrl={site.url} />
      </main>
    </>
  );
}
