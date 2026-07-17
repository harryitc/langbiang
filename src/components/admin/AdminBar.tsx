import Link from "next/link";
import PublishButton from "./PublishButton";
import { logoutAction } from "@/lib/content/actions";

const LINKS = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/site", label: "Thông tin & SEO" },
  { href: "/admin/news", label: "Tin tức" },
];

export default function AdminBar({ active }: { active?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-5 py-3">
        <Link href="/admin" className="flex items-center gap-2 font-bold">
          <span>🌙</span>
          <span className="hidden sm:inline">Quản trị</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-1.5 transition ${
                active === l.href
                  ? "bg-emerald-100 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Xem site ↗
          </Link>
          <PublishButton />
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Đăng xuất
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
