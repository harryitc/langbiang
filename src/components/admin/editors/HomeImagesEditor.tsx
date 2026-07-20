"use client";

// Nội dung trang chủ: chữ ở màn hình đầu, logo, 4 ảnh nổi quanh Hero và ảnh
// mục Giới thiệu. Bố cục Hero giữ trong code — ở đây chỉ đổi chữ và ảnh.
import { Alert, Input } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  ImageField,
} from "../editorKit";
import type { SiteMeta } from "@/lib/content/schema";

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
        title="Chữ ở màn hình đầu trang"
        extra={<SaveStatusTag status={siteStatus} />}
      >
        <p className="mb-3 text-sm opacity-60">
          Hai dòng chữ kẹp trên và dưới tên dự án ở màn hình đầu tiên. Đây là chữ{" "}
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
          label="Dòng chữ phía dưới tên dự án"
          hint="Thường ghi nơi tổ chức, vd: Tại phường Langbiang – Đà Lạt, tỉnh Lâm Đồng."
        >
          <Input
            value={site.subtitle}
            placeholder="Tại phường Langbiang – Đà Lạt, tỉnh Lâm Đồng"
            onChange={(e) => setSite("subtitle", e.target.value)}
          />
        </Field>
      </EditorCard>

      <EditorCard title="Logo" extra={<SaveStatusTag status={siteStatus} />}>
        <p className="mb-3 text-sm opacity-60">
          Logo hiển thị ở thanh menu trên cùng của <strong>mọi trang</strong>.
          Nên dùng ảnh nền trong suốt (PNG) cho đẹp.
        </p>
        <Field label="Ảnh logo" hint="Bỏ trống sẽ dùng logo mặc định của dự án.">
          <ImageField
            value={site.logo ?? ""}
            onChange={(logo) => updateSite({ ...site, logo })}
          />
        </Field>
      </EditorCard>

      <EditorCard
        title="Ảnh nổi ở đầu trang chủ"
        extra={<SaveStatusTag status={heroStatus} />}
      >
        <p className="mb-3 text-sm opacity-60">
          Bốn ảnh nhỏ bay lượn quanh màn hình đầu <strong>trang chủ</strong>. Vị
          trí, độ nghiêng và kích thước đã cố định theo thiết kế — ở đây chỉ cần{" "}
          <strong>đổi ảnh</strong>.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {heroSlots.map((src, i) => (
            <Field key={i} label={`Ảnh ${i + 1} — ${HERO_SLOTS[i]}`}>
              <ImageField value={src} onChange={(v) => setHeroAt(i, v)} />
            </Field>
          ))}
        </div>
        {heroSlots.some((s) => !s.trim()) ? (
          <Alert
            type="info"
            showIcon
            title="Ô ảnh để trống sẽ dùng ảnh mặc định."
          />
        ) : null}
      </EditorCard>

      <EditorCard
        title="Ảnh mục Giới thiệu"
        extra={<SaveStatusTag status={aboutStatus} />}
      >
        <p className="mb-3 text-sm opacity-60">
          Ảnh lớn bên trái mục giới thiệu dự án ở <strong>trang chủ</strong> —
          phần &ldquo;Mang ánh trăng ấm áp đến với núi rừng&rdquo;. Ảnh chụp dọc
          hiển thị đẹp nhất.
        </p>
        <Field label="Ảnh giới thiệu" hint="Bỏ trống sẽ dùng ảnh mặc định.">
          <ImageField value={about} onChange={updateAbout} />
        </Field>
      </EditorCard>
    </>
  );
}
