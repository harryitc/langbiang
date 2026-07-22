"use client";

import { Alert, Input } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
} from "../editorKit";
import type { FooterContent } from "@/lib/content/schema";

/** Chân trang hiện ở mọi trang, nên bỏ trống một ô là cả website bị hụt chữ. */
function validate(value: FooterContent) {
  return {
    title: value.title.trim() ? "" : "Chưa nhập tên hiển thị chân trang.",
    description: value.description.trim() ? "" : "Chưa nhập đoạn giới thiệu.",
    facebookLabel: value.facebookLabel.trim() ? "" : "Chưa nhập chữ trên nút.",
    exploreTitle: value.exploreTitle.trim() ? "" : "Chưa nhập tiêu đề cột.",
    contactTitle: value.contactTitle.trim() ? "" : "Chưa nhập tiêu đề cột.",
  };
}

// Trình biên tập Chân trang — nhánh nội dung main.footer
export default function FooterEditor({ initial }: { initial: FooterContent }) {
  const { value, update, status } = useSectionAutosave<FooterContent>(
    "main.footer",
    initial
  );

  const errors = validate(value);
  const set = (patch: Partial<FooterContent>) => update({ ...value, ...patch });

  return (
    <EditorCard title="Chân trang" extra={<SaveStatusTag status={status} />}>
      <Alert
        className="mb-4"
        type="info"
        showIcon
        title="Chân trang hiện ở cuối mọi trang."
        description={
          "Danh sách liên kết “Khám phá” tự sinh từ các trang đang có, còn địa điểm, ngày diễn ra và email lấy từ mục “Sự kiện” và “Thương hiệu & SEO” — sửa ở đó thì chân trang đổi theo."
        }
      />

      <Field
        label="Tên hiển thị ở chân trang"
        hint="Tên lớn của dự án hiện ở góc dưới bên trái của chân trang và trước dòng bản quyền."
      >
        <Input
          value={value.title}
          maxLength={100}
          placeholder="Trăng Sáng Langbiang"
          status={errors.title ? "error" : undefined}
          onChange={(e) => set({ title: e.target.value })}
        />
        {errors.title ? (
          <div className="mt-1 text-xs text-red-500">{errors.title}</div>
        ) : null}
      </Field>

      <Field
        label="Đoạn giới thiệu"
        hint="Vài dòng ngắn dưới tên chân trang. Xuống dòng được giữ nguyên khi hiển thị."
      >
        <Input.TextArea
          value={value.description}
          rows={3}
          showCount
          maxLength={300}
          placeholder="Dự án tình nguyện mang Trung thu ấm áp đến các em nhỏ vùng cao…"
          status={errors.description ? "error" : undefined}
          onChange={(e) => set({ description: e.target.value })}
        />
        {errors.description ? (
          <div className="mt-1 text-xs text-red-500">{errors.description}</div>
        ) : null}
      </Field>

      <Field
        label="Chữ trên nút Fanpage"
        hint="Địa chỉ Fanpage lấy ở mục “Thương hiệu & SEO”, đây chỉ là chữ hiện trên nút."
      >
        <Input
          value={value.facebookLabel}
          maxLength={40}
          placeholder="Vd: Theo dõi Fanpage"
          status={errors.facebookLabel ? "error" : undefined}
          onChange={(e) => set({ facebookLabel: e.target.value })}
        />
        {errors.facebookLabel ? (
          <div className="mt-1 text-xs text-red-500">{errors.facebookLabel}</div>
        ) : null}
      </Field>

      <Field label="Tiêu đề cột liên kết" hint="Cột giữa, phía trên danh sách trang.">
        <Input
          value={value.exploreTitle}
          maxLength={30}
          placeholder="Vd: Khám phá"
          status={errors.exploreTitle ? "error" : undefined}
          onChange={(e) => set({ exploreTitle: e.target.value })}
        />
        {errors.exploreTitle ? (
          <div className="mt-1 text-xs text-red-500">{errors.exploreTitle}</div>
        ) : null}
      </Field>

      <Field
        label="Tiêu đề cột liên hệ"
        hint="Cột phải, phía trên địa điểm – ngày – email."
      >
        <Input
          value={value.contactTitle}
          maxLength={30}
          placeholder="Vd: Liên hệ"
          status={errors.contactTitle ? "error" : undefined}
          onChange={(e) => set({ contactTitle: e.target.value })}
        />
        {errors.contactTitle ? (
          <div className="mt-1 text-xs text-red-500">{errors.contactTitle}</div>
        ) : null}
      </Field>

      <Field
        label="Câu sau dòng bản quyền"
        hint="Phần “© số năm, tên chân trang.” do hệ thống tự viết; đây là câu nối tiếp phía sau. Để trống cũng được."
      >
        <Input
          value={value.copyrightNote}
          maxLength={80}
          placeholder="Vd: Được tạo bằng tất cả yêu thương 💚"
          onChange={(e) => set({ copyrightNote: e.target.value })}
        />
      </Field>

      <Field
        label="Dòng cuối bên phải"
        hint="Dòng nhỏ nằm cùng hàng với bản quyền. Để trống cũng được."
      >
        <Input
          value={value.bottomNote}
          maxLength={80}
          placeholder="Vd: Langbiang · Đà Lạt · Lâm Đồng"
          onChange={(e) => set({ bottomNote: e.target.value })}
        />
      </Field>
    </EditorCard>
  );
}
