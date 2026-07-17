import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getDraftContent } from "@/lib/content/store";
import AdminBar from "@/components/admin/AdminBar";
import NewsEditor from "@/components/admin/NewsEditor";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const { news } = await getDraftContent();

  return (
    <>
      <AdminBar active="/admin/news" />
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Tin tức / Bài viết</h1>
          <p className="mt-1 text-sm text-slate-500">
            Sửa bên trái, xem trước ngay bên phải. Thay đổi lưu tự động vào bản
            nháp — bấm <b>Xuất bản</b> để đưa lên website.
          </p>
        </div>
        <NewsEditor initial={news} />
      </main>
    </>
  );
}
