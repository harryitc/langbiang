"use client";

// Nội dung trang chủ: chữ ở màn hình đầu, logo, 4 ảnh nổi quanh Hero và ảnh
// mục Giới thiệu. Bố cục Hero giữ trong code — ở đây chỉ đổi chữ và ảnh.
import { Input } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  ImageField,
  ListEditor,
} from "../editorKit";
import type {
  AboutSection,
  DonateBand,
  SiteMeta,
} from "@/lib/content/schema";

/** Vị trí của 4 ảnh nổi trên Hero — mô tả cho người biên tập dễ hình dung. */
const HERO_SLOTS = [
  "Trái · phía trên",
  "Trái · phía dưới",
  "Phải · phía trên",
  "Phải · phía dưới",
];

export type HomeImagesInitial = {
  site: SiteMeta;
  heroPhotos: string[];
  aboutImage: string;
  about: AboutSection;
  donateBand: DonateBand;
};

export default function HomeImagesEditor({
  initial,
}: {
  initial: HomeImagesInitial;
}) {
  // Logo nằm trong main.site nên lưu theo nhánh riêng của nó.
  const { value: site, update: updateSite, status: siteStatus } =
    useSectionAutosave<SiteMeta>("main.site", initial.site);
  const { value: hero, update: updateHero, status: heroStatus } =
    useSectionAutosave<string[]>("main.heroPhotos", initial.heroPhotos);
  const { value: about, update: updateAbout, status: aboutStatus } =
    useSectionAutosave<string>("main.aboutImage", initial.aboutImage);
  const {
    value: aboutText,
    update: updateAboutText,
    status: aboutTextStatus,
  } = useSectionAutosave<AboutSection>("main.about", initial.about);
  const {
    value: band,
    update: updateBand,
    status: bandStatus,
  } = useSectionAutosave<DonateBand>("main.donateBand", initial.donateBand);

  const setBand = <K extends keyof DonateBand>(key: K, v: DonateBand[K]) =>
    updateBand({ ...band, [key]: v });

  const setAboutText = <K extends keyof AboutSection>(
    key: K,
    v: AboutSection[K]
  ) => updateAboutText({ ...aboutText, [key]: v });

  /** Đảm bảo luôn đủ 4 ô ảnh Hero. */
  const heroSlots = Array.from({ length: 4 }, (_, i) => hero[i] ?? "");
  const setHeroAt = (i: number, src: string) => {
    const arr = Array.from({ length: 4 }, (_, k) => hero[k] ?? "");
    arr[i] = src;
    updateHero(arr);
  };

  const setSite = <K extends keyof SiteMeta>(key: K, v: SiteMeta[K]) =>
    updateSite({ ...site, [key]: v });

  return (
    <>
      <EditorCard
        title="Màn hình đầu trang"
        extra={
          <span className="flex items-center gap-2">
            <SaveStatusTag status={siteStatus} />
            <SaveStatusTag status={heroStatus} />
          </span>
        }
      >
        <p className="mb-3 text-sm opacity-60">
          Các dòng chữ hiển thị ở màn hình đầu tiên. Đây là chữ{" "}
          <strong>khách nhìn thấy</strong> — khác với phần Thương hiệu &amp; SEO
          (thông tin gửi cho Google), nên có thể viết khác nhau.
        </p>

        <Field
          label="Dòng chữ phía trên tên dự án"
          hint="Câu ngắn dẫn dắt, vd: Dự án tình nguyện."
        >
          <Input
            value={site.heroTagline ?? ""}
            placeholder="Dự án tình nguyện"
            onChange={(e) => setSite("heroTagline", e.target.value)}
          />
        </Field>

        <Field
          label="Dòng 1 tiêu đề chính (chữ viết tay)"
          hint="Dòng thứ nhất của tiêu đề chính vẽ nghệ thuật."
        >
          <Input
            value={site.heroTitle1 ?? ""}
            placeholder="Trăng sáng"
            onChange={(e) => setSite("heroTitle1", e.target.value)}
          />
        </Field>

        <Field
          label="Dòng 2 tiêu đề chính (chữ viết tay)"
          hint="Dòng thứ hai của tiêu đề chính (tự động xuống hàng dưới Dòng 1. Để trống cũng được)."
        >
          <Input
            value={site.heroTitle2 ?? ""}
            placeholder="Langbiang"
            onChange={(e) => setSite("heroTitle2", e.target.value)}
          />
        </Field>

        <Field
          label="Dòng chữ phía dưới tên dự án"
          hint="Thường ghi nơi tổ chức, vd: Tại phường Langbiang – Đà Lạt, tỉnh Lâm Đồng."
        >
          <Input
            value={site.subtitle}
            placeholder="Tại phường Langbiang – Đà Lạt, tỉnh Lâm Đồng"
            onChange={(e) => setSite("subtitle", e.target.value)}
          />
        </Field>

        <div className="mt-4 border-t border-black/5 pt-4">
          <div className="mb-1 font-semibold">Bốn ảnh nhỏ bay quanh</div>
          <p className="mb-3 text-sm opacity-60">
            Vị trí, độ nghiêng và kích thước đã cố định theo thiết kế — ở đây chỉ
            cần đổi ảnh. Ô để trống sẽ dùng ảnh mặc định.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {heroSlots.map((src, i) => (
              <Field key={i} label={`Ảnh ${i + 1} — ${HERO_SLOTS[i]}`}>
                <ImageField
                  value={src}
                  onChange={(v) => setHeroAt(i, v)}
                />
              </Field>
            ))}
          </div>
        </div>
      </EditorCard>




      <EditorCard
        title="Mục Giới thiệu"
        extra={
          <span className="flex items-center gap-2">
            <SaveStatusTag status={aboutStatus} />
            <SaveStatusTag status={aboutTextStatus} />
          </span>
        }
      >
        <Field
          label="Ảnh lớn bên trái"
          hint="Ảnh chụp dọc hiển thị đẹp nhất. Bỏ trống sẽ dùng ảnh mặc định."
        >
          <ImageField value={about} onChange={updateAbout} />
        </Field>

        <p className="mb-3 text-sm opacity-60">
          Phần chữ nằm bên phải ảnh giới thiệu ở <strong>trang chủ</strong> —
          khối &ldquo;Mang ánh trăng ấm áp đến với núi rừng&rdquo;.
        </p>

        <Field
          label="Nhãn nhỏ phía trên tiêu đề"
          hint="Dòng chữ in hoa trong viên thuốc màu xanh, vd: Về dự án."
        >
          <Input
            value={aboutText.eyebrow}
            placeholder="Về dự án"
            onChange={(e) => setAboutText("eyebrow", e.target.value)}
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Tiêu đề — phần đầu"
            hint="Phần chữ màu đen bình thường."
          >
            <Input
              value={aboutText.title}
              placeholder="Mang ánh trăng ấm áp"
              onChange={(e) => setAboutText("title", e.target.value)}
            />
          </Field>
          <Field
            label="Tiêu đề — phần được tô màu"
            hint="Phần này hiện với màu xanh chuyển sắc, nối ngay sau phần đầu."
          >
            <Input
              value={aboutText.titleHighlight}
              placeholder="đến với núi rừng"
              onChange={(e) => setAboutText("titleHighlight", e.target.value)}
            />
          </Field>
        </div>

        <Field
          label="Các đoạn giới thiệu"
          hint="Mỗi mục là một đoạn văn. Kéo biểu tượng bên trái để đổi thứ tự."
        >
          <ListEditor<string>
            value={aboutText.paragraphs}
            onChange={(paragraphs) => setAboutText("paragraphs", paragraphs)}
            addLabel="Thêm đoạn văn"
            newItem={() => ""}
            getSummary={(item, i) =>
              item.trim()
                ? item.length > 70
                  ? `${item.slice(0, 70)}…`
                  : item
                : `(đoạn ${i + 1} chưa có nội dung)`
            }
            renderItem={(item, updateItem, index) => (
              <Field label={`Đoạn ${index + 1}`}>
                <Input.TextArea
                  value={item}
                  rows={4}
                  showCount
                  maxLength={600}
                  placeholder="Trăng sáng Langbiang là dự án tình nguyện phi lợi nhuận…"
                  status={item.trim() ? undefined : "error"}
                  onChange={(e) => updateItem(e.target.value)}
                />
              </Field>
            )}
          />
        </Field>

        <Field
          label="Dòng đậm trong ô kính trên ảnh"
          hint="Bỏ trống thì hệ thống tự điền “Mùa … · năm” theo số mùa đã qua và năm đang chạy."
        >
          <Input
            value={aboutText.badgeTitle ?? ""}
            placeholder="Bỏ trống — hệ thống tự điền “Mùa … · năm”"
            onChange={(e) => setAboutText("badgeTitle", e.target.value)}
          />
        </Field>

        <Field
          label="Dòng nhỏ trong ô kính trên ảnh"
          hint="Dòng chữ nhạt nằm ngay dưới dòng đậm."
        >
          <Input
            value={aboutText.badgeNote}
            placeholder="Trở lại Langbiang với thật nhiều yêu thương."
            onChange={(e) => setAboutText("badgeNote", e.target.value)}
          />
        </Field>

        <Field
          label="Chữ trên nút bấm"
          hint="Nút xanh cuối mục, bấm vào sẽ cuộn xuống khối Đăng ký ở cùng trang."
        >
          <Input
            value={aboutText.ctaPrimaryLabel}
            placeholder="Đăng ký đồng hành 🌙"
            onChange={(e) => setAboutText("ctaPrimaryLabel", e.target.value)}
          />
        </Field>
      </EditorCard>

      <EditorCard
        title="Dải “Gian hàng quyên góp”"
        extra={<SaveStatusTag status={bandStatus} />}
      >
        <p className="mb-3 text-sm opacity-60">
          Dải màu cam nằm giữa trang chủ, mời mọi người mua ủng hộ. Ở đây chỉ đổi{" "}
          <strong>chữ</strong>. Đường dẫn của hai nút không sửa ở đây: nút trắng
          luôn dẫn sang gian hàng Shopee (đổi địa chỉ ở mục{" "}
          <em>Kênh gây quỹ</em>), nút viền luôn dẫn sang trang Gây quỹ.
        </p>

        <Field
          label="Nhãn nhỏ phía trên"
          hint="Chữ trong ô bo tròn nhấp nháy, viết ngắn."
        >
          <Input
            value={band.eyebrow}
            placeholder="Gian hàng quyên góp"
            onChange={(e) => setBand("eyebrow", e.target.value)}
          />
        </Field>

        <Field label="Tiêu đề" hint="Dòng chữ to nhất. Thêm emoji cũng được.">
          <Input
            value={band.title}
            placeholder="Mua sắm cũng là sẻ chia 🛒"
            onChange={(e) => setBand("title", e.target.value)}
          />
        </Field>

        <Field label="Đoạn giới thiệu ngắn" hint="1–2 dòng là vừa đẹp.">
          <Input.TextArea
            value={band.desc}
            rows={2}
            showCount
            maxLength={300}
            placeholder="Mỗi sản phẩm bạn mua tại gian hàng Shopee của dự án…"
            onChange={(e) => setBand("desc", e.target.value)}
          />
        </Field>

        <Field label="Chữ trên nút trắng" hint="Nút dẫn sang gian hàng Shopee.">
          <Input
            value={band.primaryLabel}
            placeholder="Ghé gian hàng Shopee"
            onChange={(e) => setBand("primaryLabel", e.target.value)}
          />
        </Field>

        <Field label="Chữ trên nút viền" hint="Nút dẫn sang trang Gây quỹ.">
          <Input
            value={band.secondaryLabel}
            placeholder="Cách khác để đóng góp"
            onChange={(e) => setBand("secondaryLabel", e.target.value)}
          />
        </Field>
      </EditorCard>
    </>
  );
}
