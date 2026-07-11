import Reveal from "@/components/Reveal";
import { Daisy } from "@/components/Decor";

export default function Team() {
  return (
    <section className="relative py-24 sm:py-32">
      <span id="team" aria-hidden className="block" />
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Đại gia đình
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink">
            Một tập thể,{" "}
            <span className="text-gradient-green">một trái tim</span>
          </h2>
          <p className="mt-4 text-lg text-forest/75 dark:text-ink/75">
            Những con người xa lạ, cùng chung một tấm lòng, đã trở thành gia đình
            dưới ánh trăng Langbiang.
          </p>
        </Reveal>

        <Reveal>
          <figure className="group relative overflow-hidden rounded-[2rem] shadow-soft ring-1 ring-leaf/15 dark:ring-leaf-bright/15">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gallery/team.jpg"
              alt="Đại gia đình tình nguyện Trăng Sáng Langbiang chụp ảnh chung"
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] sm:aspect-[16/10] md:aspect-[2/1]"
            />
            {/* Lớp phủ gradient để chữ nổi */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* Nội dung overlay */}
            <figcaption className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
              <div className="flex flex-col items-start gap-2">
                <span className="rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  Trăng Sáng Langbiang · Mùa 2025
                </span>
                <p className="font-display text-3xl font-bold text-white drop-shadow sm:text-5xl">
                  Cảm ơn vì đã cùng nhau
                </p>
                <p className="max-w-xl text-sm text-white/85 sm:text-base">
                  Mỗi thành viên là một mảnh ghép làm nên hành trình yêu thương. Và
                  năm nay, chúng mình lại tiếp tục — cùng bạn.
                </p>
              </div>
            </figcaption>

            <Daisy className="absolute right-6 top-6 opacity-90 drop-shadow" size={40} />
          </figure>
        </Reveal>

        <Reveal className="mt-12 mx-auto max-w-6xl">
          <div className="rounded-[2rem] bg-leaf/5 p-8 sm:p-12 dark:bg-white/[0.02] ring-1 ring-leaf/10 dark:ring-leaf-bright/10 text-forest/80 dark:text-ink/80 text-base sm:text-lg leading-relaxed space-y-6">
            <p>
              Có lẽ điều đẹp nhất mà <strong>Trăng Sáng LangBiang</strong> mang lại không chỉ là một mùa Trung Thu trọn vẹn cho các em nhỏ, mà còn là sự gắn kết của những con người vốn xa lạ.
            </p>
            <p>
              Chúng ta đến từ nhiều nơi khác nhau, mang những câu chuyện khác nhau, nhưng lại gặp nhau ở một điểm chung: mong muốn được cho đi bằng cả trái tim.
            </p>
            <p>
              Cảm ơn từng anh chị, từng bạn tình nguyện viên đã dành thời gian, công sức và cả tuổi trẻ để cùng nhau tạo nên hành trình ý nghĩa này. Cảm ơn những ngày thức khuya chuẩn bị, những buổi tập luyện, những chuyến xe dài và cả những giọt mồ hôi đổi lấy nụ cười của các em.
            </p>
            <p className="font-bold text-leaf-deep dark:text-leaf-bright">
              Chúng ta không chỉ cùng nhau tổ chức một chương trình, mà đã cùng nhau trở thành một gia đình.
            </p>
            <p>
              Hy vọng rằng, sau khi ánh đèn sân khấu đã tắt, sau khi mùa trăng đã qua, mỗi người vẫn sẽ luôn nhớ rằng mình từng là một phần của <strong>Đại gia đình Trăng Sáng LangBiang</strong> – nơi yêu thương được bắt đầu từ những điều giản dị nhất. 💚
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
