"use client";

// Chữ hiển thị ở đầu trang chủ (khối Hero) — tách khỏi mục Thương hiệu & SEO
// để không lẫn giữa "chữ khách nhìn thấy" và "thông tin gửi cho Google".
import { Input } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
} from "../editorKit";
import type { SiteMeta } from "@/lib/content/schema";

export default function HomeTextEditor({ initial }: { initial: SiteMeta }) {
  const { value, update, status } = useSectionAutosave<SiteMeta>(
    "main.site",
    initial
  );

  const set = <K extends keyof SiteMeta>(key: K, v: SiteMeta[K]) =>
    update({ ...value, [key]: v });

  return (
    <EditorCard
      title="Chữ ở đầu trang chủ"
      extra={<SaveStatusTag status={status} />}
    >
      <p className="mb-3 text-sm opacity-60">
        Chữ ở màn hình đầu tiên của <strong>trang chủ</strong>: một dòng nhỏ
        phía trên tên dự án và một dòng phía dưới. Đây là chữ{" "}
        <strong>khách nhìn thấy</strong> — khác với phần Thương hiệu &amp; SEO
        (thông tin gửi cho Google), nên có thể viết khác nhau.
      </p>

      <Field
        label="Dòng chữ phía trên tên dự án"
        hint="Câu ngắn dẫn dắt, vd: Dự án tình nguyện."
      >
        <Input
          value={value.heroTagline ?? ""}
          placeholder={value.tagline || "Dự án tình nguyện"}
          onChange={(e) => set("heroTagline", e.target.value)}
        />
      </Field>

      <Field
        label="Dòng chữ phía dưới tên dự án"
        hint="Thường ghi nơi tổ chức, vd: Tại phường Langbiang – Đà Lạt, tỉnh Lâm Đồng."
      >
        <Input
          value={value.subtitle}
          placeholder="Tại phường Langbiang – Đà Lạt, tỉnh Lâm Đồng"
          onChange={(e) => set("subtitle", e.target.value)}
        />
      </Field>
    </EditorCard>
  );
}
