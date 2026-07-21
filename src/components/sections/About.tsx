import Reveal from "@/components/Reveal";
import Photo from "@/components/Photo";
import { Daisy } from "@/components/Decor";

export default function About() {
  return (
    <section className="relative py-24 sm:py-32">
      <span id="about" aria-hidden className="block" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Ảnh */}
        <Reveal className="relative">
          <div className="relative">
            {/* TODO(anh Vũ): thay bằng ảnh TNV áo Langbiang đang cho một bạn nhỏ
                đồng bào ăn phở. Đặt file vào /public/gallery/about.jpg */}
            <Photo
              src="/gallery/about.jpg"
              alt="Tình nguyện viên Trăng Sáng Langbiang bên các em nhỏ vùng cao"
              ratio="aspect-[4/5]"
              priority
              className="shadow-soft"
            />
            <div className="glass glass-adaptive absolute -bottom-6 -right-4 max-w-[220px] rounded-2xl p-4 shadow-soft sm:-right-8">
              <p className="font-display text-3xl font-bold text-leaf-deep dark:text-leaf-bright">
                Mùa 2 · 2026
              </p>
              <p className="mt-1 text-sm text-forest/75 dark:text-ink/75">
                Trở lại Langbiang với thật nhiều yêu thương.
              </p>
            </div>
            <Daisy className="absolute -left-4 -top-4 animate-float" size={44} />
          </div>
        </Reveal>

        {/* Nội dung */}
        <Reveal childrenStagger>
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Về dự án
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Mang ánh trăng ấm áp{" "}
            <span className="text-gradient-green">đến với núi rừng</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-forest/80 dark:text-ink/80">
            <strong>Trăng Sáng Langbiang</strong> là dự án thiện nguyện phi lợi nhuận
            hướng về trẻ em vùng cao, được khởi xướng bởi những cá nhân trưởng thành từ
            phong trào Đoàn - Hội. Dự án luôn được tổ chức bài bản bởi các cơ sở Đoàn -
            Hội đăng cai, với kế hoạch triển khai được phối hợp, chấp thuận và giám sát
            chặt chẽ từ chính quyền địa phương cùng các đơn vị liên quan.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-forest/80 dark:text-ink/80">
            Vượt lên trên ý nghĩa của một chương trình trao quà thiện nguyện thông
            thường, chúng mình mang đến những sân chơi và không gian sinh hoạt bổ ích cho
            các em nhỏ. Thông qua đó, dự án còn lồng ghép nhiều hoạt động giáo dục nhằm
            nuôi dưỡng tình yêu quê hương, bồi đắp lòng tự hào dân tộc và tôn vinh những
            giá trị văn hóa Việt Nam trong tâm hồn các em.
          </p>

          <p className="mt-4 text-lg leading-relaxed text-forest/80 dark:text-ink/80">
            Bên cạnh đó, hành trình này còn là môi trường thực tiễn để các bạn sinh
            viên và thanh niên trực tiếp dấn thân, cống hiến cho cộng đồng. Qua từng hoạt
            động, mỗi người trẻ không chỉ được rèn luyện kỹ năng tổ chức, làm việc nhóm
            và lãnh đạo, mà còn có cơ hội nuôi dưỡng, lan tỏa tình yêu thương, góp phần
            xây dựng một thế hệ sống trách nhiệm, nhân ái và sẵn sàng phụng sự xã hội.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#register"
              className="rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Đăng ký đồng hành 🌙
            </a>
            <a
              href="#why"
              className="rounded-full border-2 border-leaf-deep/25 bg-white/60 px-6 py-3 text-sm font-semibold text-leaf-deep transition hover:-translate-y-0.5 hover:bg-white dark:border-leaf-bright/25 dark:bg-white/5 dark:text-leaf-bright dark:hover:bg-white/10"
            >
              Vì sao nên tham gia?
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
