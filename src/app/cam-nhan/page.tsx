import type { Metadata } from "next";
import Link from "next/link";
import SubPageShell from "@/components/SubPageShell";
import Testimonials from "@/components/sections/Testimonials";

export const metadata: Metadata = {
  title: "Cảm nhận tình nguyện viên",
  description:
    "Những chia sẻ chân thật từ các tình nguyện viên Trăng Sáng Langbiang — kỷ niệm, cảm xúc và tình yêu thương trên hành trình.",
  alternates: { canonical: "/cam-nhan" },
};

export default function CamNhanPage() {
  return (
    <SubPageShell
      eyebrow="Cảm nhận"
      title="Tiếng lòng tình nguyện viên"
      subtitle="Những chia sẻ chân thật từ các bạn đã cùng chúng mình đi qua mùa trăng Langbiang."
    >
      <Testimonials showHeading={false} />

      <section className="py-16 text-center sm:py-20">
        <div className="mx-auto max-w-2xl px-5 sm:px-6">
          <Link
            href="/#register"
            className="rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-8 py-3.5 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Viết tiếp câu chuyện của bạn 🌙
          </Link>
        </div>
      </section>
    </SubPageShell>
  );
}
