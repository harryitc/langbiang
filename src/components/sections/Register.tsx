// Khối "Đăng ký" ở trang chủ. Toàn bộ chữ và danh sách trường của form đều do
// admin cấu hình — form nào hiện ở đây là do admin chọn ("Đặt làm form hiển thị
// ở trang chủ" trong mục Form đăng ký).
// Đồng bộ giao diện với trang chia sẻ riêng /dang-ky/<id> (nền sky-soft/cream,
// cành lá, hoa cúc, chữ forest/leaf-deep). Không dùng HeroCanvas để tránh trùng
// lặp animation rơi rơi.
import Reveal from "@/components/Reveal";
import { LeafBranch, Daisy } from "@/components/Decor";
import RegisterFormCard from "./RegisterFormCard";
import RoleCards from "./RoleCards";
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
      className="relative overflow-hidden bg-gradient-to-b from-sky-soft via-[#c9ecf2] to-cream py-24 sm:py-32 dark:from-[#0a1626] dark:via-[#0c1712] dark:to-[#0c1712]"
    >
      {/* Cành lá & hoa ở góc, giống trang /dang-ky/<id> */}
      <LeafBranch className="pointer-events-none absolute -left-6 -top-6 z-10 h-56 w-72 animate-sway opacity-90 md:h-72 md:w-96" />
      <Daisy className="pointer-events-none absolute bottom-8 right-6 z-10 h-16 w-16 animate-float opacity-80 md:h-24 md:w-24" />

      {/* max-w-7xl chứ không phải 6xl: cột trái phải đủ rộng cho dòng tiêu đề
          viết tay cỡ lớn, nếu không chữ cuối bị rơi xuống một mình. */}
      <div className="relative z-20 mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <Reveal childrenStagger>
          <span className="mb-3 inline-block rounded-full border border-leaf/40 bg-white/50 px-5 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-leaf-deep backdrop-blur dark:border-leaf-bright/30 dark:bg-white/5 dark:text-leaf-bright">
            {content.eyebrow}
          </span>
          {/* @container: cỡ chữ dòng viết tay tính theo bề ngang CỘT này, không
              phải bề ngang màn hình — ở lg cột chỉ rộng một nửa nên nếu tính
              theo màn hình thì chữ sẽ tràn.
              whitespace-nowrap + cỡ chữ co giãn (cqw): dòng viết tay luôn nằm
              gọn MỘT hàng ở mọi khổ màn hình, thay vì rớt chữ cuối xuống dưới. */}
          <h2 className="@container text-3xl font-extrabold leading-tight text-balance text-forest dark:text-ink sm:text-4xl md:text-5xl">
            {content.title}
            <br />
            <span className="font-display whitespace-nowrap text-[clamp(1.25rem,9cqw,3.75rem)] text-leaf-deep dark:text-leaf-bright">
              {content.titleHighlight}
            </span>
          </h2>
          <p className="mt-5 max-w-lg text-lg text-forest/75 dark:text-ink/75 text-pretty">
            {content.description}
          </p>

          <RoleCards roles={content.roles} className="mt-8 text-left" />
        </Reveal>

        <Reveal>
          <RegisterFormCard form={content} facebook={facebook} />
        </Reveal>
      </div>
    </section>
  );
}
