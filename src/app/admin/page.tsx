import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import AdminBar from "@/components/admin/AdminBar";

export const dynamic = "force-dynamic";

const SECTIONS = [
  {
    href: "/admin/site",
    icon: "🔎",
    title: "Thông tin & SEO",
    desc: "Tên dự án, tagline, mô tả, từ khoá, mạng xã hội — ảnh hưởng tiêu đề trang & chia sẻ.",
    ready: true,
  },
  {
    href: "/admin/news",
    icon: "📰",
    title: "Tin tức / Bài viết",
    desc: "Thêm, sửa, xoá bài; chỉnh tiêu đề, ảnh, nội dung. Có xem trước trực tiếp.",
    ready: true,
  },
  { href: "#", icon: "🗓️", title: "Chương trình & Timeline", desc: "Lịch trình các ngày, hoạt động.", ready: false },
  { href: "#", icon: "🖼️", title: "Thư viện ảnh", desc: "Khoảnh khắc, caption.", ready: false },
  { href: "#", icon: "🤝", title: "Nhà tài trợ", desc: "Logo, link, giới thiệu.", ready: false },
  { href: "#", icon: "👥", title: "Ban tổ chức", desc: "Thành viên, vai trò.", ready: false },
  { href: "#", icon: "❓", title: "Câu hỏi thường gặp", desc: "FAQ.", ready: false },
  { href: "#", icon: "💚", title: "Đóng góp & Minh bạch", desc: "Kênh gây quỹ, báo cáo chi.", ready: false },
];

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/login");

  return (
    <>
      <AdminBar active="/admin" />
      <main className="mx-auto max-w-7xl px-5 py-8">
        <h1 className="text-2xl font-bold">Bảng điều khiển nội dung</h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          Chỉnh sửa được lưu vào <b>bản nháp</b> và xem trước ngay. Bấm{" "}
          <b>Xuất bản</b> ở góc phải để đưa thay đổi lên website. Website vẫn chạy
          bình thường dù không đụng tới code.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SECTIONS.map((s) => {
            const card = (
              <div
                className={`h-full rounded-2xl border p-5 transition ${
                  s.ready
                    ? "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                    : "border-dashed border-slate-200 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-900/50"
                }`}
              >
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <span className="text-2xl">{s.icon}</span>
                  {s.title}
                </div>
                <p className="mt-2 text-sm text-slate-500">{s.desc}</p>
                <span
                  className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    s.ready
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                      : "bg-slate-200 text-slate-500 dark:bg-slate-800"
                  }`}
                >
                  {s.ready ? "Quản lý được" : "Sắp có"}
                </span>
              </div>
            );
            return s.ready ? (
              <Link key={s.title} href={s.href}>
                {card}
              </Link>
            ) : (
              <div key={s.title}>{card}</div>
            );
          })}
        </div>
      </main>
    </>
  );
}
