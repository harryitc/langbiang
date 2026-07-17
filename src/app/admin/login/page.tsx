import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { loginAction } from "@/lib/content/actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const sp = searchParams ? await searchParams : {};
  const hasError = sp.error === "1";
  const noPassword = !process.env.ADMIN_PASSWORD;

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <form
        action={loginAction}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-800"
      >
        <div className="mb-6 text-center">
          <div className="text-3xl">🌙</div>
          <h1 className="mt-2 text-xl font-bold">Quản trị nội dung</h1>
          <p className="mt-1 text-sm text-slate-500">Trăng Sáng Langbiang</p>
        </div>

        {noPassword && (
          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 ring-1 ring-amber-200">
            Chưa đặt biến môi trường <code>ADMIN_PASSWORD</code>. Hãy thêm vào
            <code> .env.local</code> và trên Vercel.
          </p>
        )}
        {hasError && (
          <p className="mb-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">
            Mật khẩu không đúng, thử lại nhé.
          </p>
        )}

        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Mật khẩu
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 dark:border-slate-700 dark:bg-slate-800"
          />
        </label>

        <button
          type="submit"
          className="mt-5 w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white transition hover:bg-emerald-700"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
