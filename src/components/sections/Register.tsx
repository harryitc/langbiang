// Khối "Đăng ký" ở trang chủ. Toàn bộ chữ và danh sách trường của form đều do
// admin cấu hình — form nào hiện ở đây là do admin chọn ("Đặt làm form hiển thị
// ở trang chủ" trong mục Form đăng ký).
// Phần thẻ form nằm ở RegisterFormCard để dùng chung với trang /dang-ky/<id>.
import Reveal from "@/components/Reveal";
import RegisterFormCard from "./RegisterFormCard";
import type { RegisterForm } from "@/lib/content/schema";

export default function Register({
  facebook,
  content,
}: {
  facebook: string;
  content: RegisterForm;
}) {
  return (
    <section
      id="register"
      className="relative overflow-hidden bg-gradient-to-br from-leaf-deep via-leaf to-grass py-24 text-white sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-sun blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <Reveal childrenStagger>
          <span className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            {content.eyebrow}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            {content.title}
            <br />
            <span className="font-display text-4xl sm:text-5xl md:text-6xl">
              {content.titleHighlight}
            </span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-white/85">
            {content.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {content.highlights.map((h, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-forest">
                <span className="text-2xl">{h.icon}</span>
                <p className="mt-1 font-bold">{h.title}</p>
                <p className="text-sm text-forest/70">{h.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <RegisterFormCard form={content} facebook={facebook} />
        </Reveal>
      </div>
    </section>
  );
}
