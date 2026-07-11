import Reveal from "@/components/Reveal";
import { Daisy } from "@/components/Decor";

export default function Summary() {
  return (
    <section className="relative py-24 sm:py-32">
      <span id="summary" aria-hidden className="block" />
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center mb-16">
          <span className="mb-3 inline-block rounded-full bg-leaf/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-leaf-deep dark:bg-leaf-bright/15 dark:text-leaf-bright">
            Tổng kết hành trình
          </span>
          <h2 className="text-3xl font-extrabold text-forest sm:text-4xl md:text-5xl dark:text-ink leading-tight">
            Trăng Sáng LangBiang 2026
            <span className="block text-gradient-green mt-2 text-2xl sm:text-3xl font-display font-bold">
              Khép Lại Một Hành Trình, Mở Ra Những Ký Ức Đẹp
            </span>
          </h2>
        </Reveal>

        <Reveal className="mx-auto">
          {/* Lời mở đầu */}
          <div className="relative mb-12 rounded-3xl bg-leaf/10 p-6 sm:p-10 dark:bg-white/[0.03] ring-1 ring-leaf/10 dark:ring-leaf-bright/10">
            <span className="font-display text-5xl leading-none text-leaf/40 dark:text-leaf-bright/40 absolute -top-5 left-6">
              &ldquo;
            </span>
            <p className="italic text-lg text-forest/90 dark:text-ink/90 leading-relaxed pl-4">
              Có những chuyến đi không được đo bằng số kilomet đã đi qua, mà được ghi nhớ bằng những nụ cười còn đọng lại trong tim.
            </p>
            <Daisy className="absolute right-6 -bottom-4 animate-float" size={32} />
          </div>

          <div className="space-y-6 text-forest/80 dark:text-ink/80 text-base sm:text-lg leading-relaxed">
            <p>
              <strong>&quot;Trăng Sáng LangBiang 2026&quot;</strong> đã chính thức khép lại, để lại phía sau là một mùa Trung Thu ngập tràn tiếng cười, những cái ôm thật chặt và ánh mắt lấp lánh hạnh phúc của các em nhỏ nơi núi rừng LangBiang.
            </p>

            <p>
              Mỗi chiếc lồng đèn được thắp sáng, mỗi phần quà được trao tận tay, mỗi trò chơi, mỗi tiết mục văn nghệ hay từng bữa ăn sẻ chia đều là những mảnh ghép tạo nên một bức tranh đầy yêu thương. Có lẽ, điều quý giá nhất mà tất cả thành viên Ban Tổ chức nhận được không phải là những bức ảnh đẹp hay những lời cảm ơn, mà chính là khoảnh khắc nhìn thấy các em được cười thật tươi, được đón một mùa trăng đúng nghĩa như bao bạn nhỏ khác.
            </p>

            <p>
              Nhưng hành trình ấy sẽ không thể trở thành hiện thực nếu thiếu đi sự đồng hành của những tấm lòng nhân ái.
            </p>
          </div>

          {/* Tri ân */}
          <div className="my-12 border-l-4 border-leaf-deep dark:border-leaf-bright pl-6 space-y-6">
            <h3 className="text-xl font-bold text-leaf-deep dark:text-leaf-bright flex items-center gap-2">
              <span>💙</span> Lời tri ân sâu sắc
            </h3>
            <p className="text-forest/80 dark:text-ink/80 text-base sm:text-lg leading-relaxed">
              Ban Tổ chức xin gửi lời tri ân chân thành và sâu sắc nhất đến tất cả Quý Nhà tài trợ, Quý Đơn vị đồng hành và những cá nhân đã dành sự tin tưởng, sẻ chia để cùng chúng tôi mang yêu thương đến với các em nhỏ.
            </p>
            <p className="text-forest/80 dark:text-ink/80 text-base sm:text-lg leading-relaxed">
              Mỗi sự đóng góp, dù lớn hay nhỏ, đều mang trong mình một ý nghĩa đặc biệt. Đó không chỉ là sự hỗ trợ về vật chất mà còn là niềm tin, sự động viên và nguồn động lực để chương trình được diễn ra trọn vẹn.
            </p>
          </div>

          {/* Chi tiết nhà tài trợ & đơn vị */}
          <div className="grid gap-6 sm:grid-cols-2 my-12">
            <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-leaf/10 dark:bg-white/[0.02] dark:ring-leaf-bright/10">
              <h4 className="font-bold text-forest dark:text-ink mb-3 text-lg">Đồng hành đặc biệt</h4>
              <p className="text-sm text-forest/75 dark:text-ink/75 leading-relaxed">
                Ban Tổ chức xin được gửi lời cảm ơn sâu sắc đến <strong className="text-leaf-deep dark:text-leaf-bright">WESET English Center</strong> và <strong className="text-leaf-deep dark:text-leaf-bright">Phở Huỳnh Trâm</strong> vì đã luôn đồng hành, tiếp thêm nguồn lực và lan tỏa tinh thần thiện nguyện trong suốt hành trình.
              </p>
            </div>
            <div className="rounded-3xl bg-white/70 p-6 shadow-sm ring-1 ring-leaf/10 dark:bg-white/[0.02] dark:ring-leaf-bright/10">
              <h4 className="font-bold text-forest dark:text-ink mb-3 text-lg">Hỗ trợ quý báu</h4>
              <p className="text-sm text-forest/75 dark:text-ink/75 leading-relaxed">
                Chúng tôi cũng vô cùng biết ơn sự hỗ trợ quý báu từ <strong className="text-forest dark:text-ink">Sun Taxi Phan Thiết</strong>, <strong className="text-forest dark:text-ink">Bánh kem Kim Phụng</strong> và <strong className="text-forest dark:text-ink">Bệnh viện Đa khoa Tâm Phúc</strong>. Chính sự chung tay của Quý đơn vị đã góp phần tạo nên một mùa Trung Thu đầy ắp niềm vui, yêu thương và những ký ức khó quên.
              </p>
            </div>
          </div>

          {/* Tình nguyện viên */}
          <div className="space-y-6 text-forest/80 dark:text-ink/80 text-base sm:text-lg leading-relaxed">
            <p>
              Xin cảm ơn tất cả các anh chị tình nguyện viên đã dành thời gian, công sức và cả trái tim để chuẩn bị từng phần quà, dựng sân khấu, tổ chức các hoạt động và mang đến những nụ cười rạng rỡ cho các em nhỏ. Mỗi người đều là một mảnh ghép không thể thiếu để tạo nên thành công của chương trình.
            </p>

            <p>
              Có thể chương trình đã khép lại, nhưng những giá trị mà <strong>&quot;Trăng Sáng LangBiang&quot;</strong> mang lại sẽ còn tiếp tục lan tỏa.
            </p>

            <p>
              Hy vọng rằng, nhiều năm sau, khi nhắc đến mùa Trung Thu ấy, các em vẫn sẽ nhớ về một đêm trăng thật sáng, về những chiếc lồng đèn lung linh, về những người đã vượt đường xa để cùng các em cười, cùng các em vui và cùng viết nên một ký ức tuổi thơ thật đẹp.
            </p>

            <p>
              Xin chân thành cảm ơn tất cả những tấm lòng đã đồng hành cùng <strong>&quot;Trăng Sáng LangBiang 2026&quot;</strong>.
            </p>

            <p>
              Hẹn gặp lại trong những hành trình thiện nguyện tiếp theo, nơi yêu thương sẽ tiếp tục được trao đi và hy vọng sẽ tiếp tục được thắp sáng.
            </p>
          </div>

          {/* Trích dẫn kết thúc */}
          <div className="mt-14 text-center">
            <p className="font-display text-2xl text-gradient-green drop-shadow-sm font-semibold max-w-xl mx-auto leading-relaxed">
              &quot;Một đêm trăng có thể chỉ kéo dài vài giờ, nhưng những yêu thương được trao đi sẽ còn ở lại rất lâu trong ký ức của một đứa trẻ.&quot; 🌕💙
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
