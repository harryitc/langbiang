import type { Metadata } from "next";
import Link from "next/link";
import SubPageShell from "@/components/SubPageShell";
import Donations from "@/components/sections/Donations";

export const metadata: Metadata = {
  title: "Danh sách đóng góp",
  description:
    "Tri ân những tấm lòng đã đóng góp cho Trăng Sáng Langbiang — bằng tài chính hoặc hiện vật, mỗi đóng góp là một mùa Trung thu cho em nhỏ vùng cao.",
  alternates: { canonical: "/dong-gop" },
};

export default function DongGopPage() {
  return (
    <SubPageShell
      eyebrow="Tri ân"
      title="Danh sách đóng góp"
      subtitle="Xin trân trọng cảm ơn những tấm lòng vàng đã đồng hành cùng Trăng Sáng Langbiang trong hành trình yêu thương."
    >
      <Donations showHeading={false} />

      <section className="bg-[#eef8ea] py-16 text-center dark:bg-night-2 sm:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-6">
          <h2 className="text-2xl font-extrabold text-forest sm:text-3xl dark:text-ink">
            Cùng góp một phần quà cho em
          </h2>
          <p className="mt-3 text-base text-forest/75 dark:text-ink/75">
            Ghé gian hàng gây quỹ hoặc đăng ký đồng hành cùng chúng mình nhé!
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/gay-quy"
              className="rounded-full bg-gradient-to-r from-sunset to-sun px-8 py-3.5 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-105"
            >
              Gian hàng gây quỹ 🛒
            </Link>
            <Link
              href="/#register"
              className="rounded-full border-2 border-leaf-deep/30 bg-white/60 px-8 py-3.5 font-semibold text-leaf-deep transition hover:-translate-y-0.5 hover:bg-white dark:border-leaf-bright/25 dark:bg-white/5 dark:text-leaf-bright dark:hover:bg-white/10"
            >
              Đăng ký đồng hành
            </Link>
          </div>
        </div>
      </section>
    </SubPageShell>
  );
}
