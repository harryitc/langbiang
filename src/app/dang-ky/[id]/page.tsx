// Trang chia sẻ riêng của MỘT form đăng ký: /dang-ky/<id>.
//
// Cố ý dựng thật nhẹ — CHỈ có form, không Header, không Footer, không các mục
// khác của trang chủ — để gửi link cho tình nguyện viên là điền được ngay.
//
// Bố cục bám sát khối "Đăng ký" ngoài trang chủ (src/components/sections/
// Register.tsx): màn rộng thì chữ bên trái, form bên phải; màn hẹp thì xếp dọc.
// Hai cột không chỉ để giống — thẻ form nền kính đứng một mình giữa nền xanh sẽ
// bị chìm, có cột chữ bên cạnh thì mắt mới bám được vào form.
//
// Khác trang chủ đúng một điểm: KHÔNG hiện 2 ô highlights, giữ trang thật gọn.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import RegisterFormCard from "@/components/sections/RegisterFormCard";
import { getContent } from "@/lib/content/store";

type Params = { params: Promise<{ id: string }> };

/** Form theo slug trên đường dẫn (không có -> undefined). */
async function timForm(id: string) {
  const { main } = await getContent();
  return {
    form: main.registerForms.find((f) => f.id === id),
    site: main.site,
  };
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const { form, site } = await timForm(id);
  if (!form) return { title: "Không tìm thấy form đăng ký" };

  const title = form.name.trim() || form.formTitle;
  return {
    title,
    description: form.description,
    alternates: { canonical: `/dang-ky/${form.id}` },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      siteName: site.name,
      title,
      description: form.description,
    },
  };
}

export default async function Page({ params }: Params) {
  const { id } = await params;
  const { form, site } = await timForm(id);
  if (!form) notFound();

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-leaf-deep via-leaf to-grass py-16 text-white sm:py-20">
      {/* Hoạ tiết mờ — lấy đúng của khối Đăng ký ở trang chủ. */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-sun blur-3xl" />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* Cột trái — giới thiệu */}
        <div className="text-center lg:text-left">
          <Link
            href="/"
            className="cursor-pointer text-xs font-bold uppercase tracking-widest text-white/75 transition hover:text-white"
          >
            {site.name}
          </Link>

          <span className="mt-4 mb-3 block">
            <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
              {form.eyebrow}
            </span>
          </span>

          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            {form.title}
            <br />
            <span className="font-display text-4xl sm:text-5xl md:text-6xl">
              {form.titleHighlight}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-lg text-white/85 lg:mx-0">
            {form.description}
          </p>
        </div>

        {/* Cột phải — form */}
        <RegisterFormCard form={form} facebook={site.facebook} />
      </div>

      <p className="relative mt-12 px-6 text-center text-xs text-white/70">
        {form.name.trim() || form.formTitle} ·{" "}
        <Link href="/" className="cursor-pointer underline">
          Về trang chủ {site.name}
        </Link>
      </p>
    </main>
  );
}
