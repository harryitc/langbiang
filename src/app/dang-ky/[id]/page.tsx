// Trang chia sẻ riêng của MỘT form đăng ký: /dang-ky/<id>.
//
// Nội dung cố ý gọn — CHỈ có form, không Header, không Footer, không các mục
// khác của trang chủ — để gửi link cho tình nguyện viên là điền được ngay.
//
// Nền dùng ĐÚNG nền Hero trang chủ: bầu trời gradient + HeroCanvas (trăng, đom
// đóm, lá bay) + cành lá và hoa cúc ở góc. Vì nền sáng nên chữ ở đây là chữ
// đậm (forest/leaf-deep) chứ không phải chữ trắng như khối Đăng ký.
//
// Bố cục hai cột giống khối Đăng ký ở trang chủ: chữ bên trái, form bên phải;
// màn hẹp thì xếp dọc — kể cả lưới thẻ vai trò Đại sứ, để trang chia sẻ và
// trang chủ trông như một.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HeroCanvas from "@/components/HeroCanvas";
import { LeafBranch, Daisy } from "@/components/Decor";
import RegisterFormCard from "@/components/sections/RegisterFormCard";
import RoleCards from "@/components/sections/RoleCards";
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
    <main className="relative flex min-h-screen flex-col overflow-hidden py-16 sm:py-20">
      {/* Bầu trời gradient — lấy nguyên của Hero trang chủ. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-sky-soft via-[#c9ecf2] to-cream" />
      <HeroCanvas />

      {/* Cành lá & hoa ở góc, như Hero. */}
      <LeafBranch className="pointer-events-none absolute -left-6 -top-6 z-10 h-56 w-72 animate-sway opacity-90 md:h-72 md:w-96" />
      <Daisy className="pointer-events-none absolute bottom-8 right-6 z-10 h-16 w-16 animate-float opacity-80 md:h-24 md:w-24" />

      <div className="relative z-20 mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-6 lg:grid-cols-2">
        {/* Cột trái — giới thiệu */}
        <div className="text-center lg:text-left">
          <Link
            href="/"
            className="cursor-pointer text-xs font-bold uppercase tracking-widest text-leaf-deep/70 transition hover:text-leaf-deep"
          >
            {site.name}
          </Link>

          <span className="mt-4 mb-3 block">
            <span className="inline-block rounded-full border border-leaf/40 bg-white/50 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-leaf-deep backdrop-blur">
              {form.eyebrow}
            </span>
          </span>

          {/* Cùng cách xử lý với khối Đăng ký trang chủ: cỡ chữ dòng viết tay
              tính theo bề ngang cột nên luôn nằm gọn một hàng. */}
          <h1 className="@container text-3xl font-extrabold leading-tight text-balance text-forest sm:text-4xl md:text-5xl">
            {form.title}
            <br />
            <span className="font-display whitespace-nowrap text-[clamp(1.25rem,9cqw,3.75rem)] text-leaf-deep">
              {form.titleHighlight}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-lg text-forest/75 text-pretty lg:mx-0">
            {form.description}
          </p>

          {/* Cùng lưới thẻ vai trò với trang chủ. */}
          <RoleCards roles={form.roles} className="mt-8 text-left" />
        </div>

        {/* Cột phải — form. */}
        <RegisterFormCard form={form} facebook={site.facebook} />
      </div>

      <p className="relative z-20 mt-12 px-6 text-center text-xs text-forest/60">
        {form.name.trim() || form.formTitle} ·{" "}
        <Link
          href="/"
          className="cursor-pointer underline hover:text-leaf-deep"
        >
          Về trang chủ {site.name}
        </Link>
      </p>
    </main>
  );
}
