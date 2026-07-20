"use client";

// Editor dùng chung cho các nhóm "thẻ có biểu tượng" (IconCard[]):
// Hiện dùng cho Hoạt động (main.activities); tách riêng để tái dùng khi cần,
// cấu hình (đường dẫn, gợi ý emoji, nhãn, placeholder).
import { Alert, Input, Space, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
} from "../editorKit";
import type { IconCard } from "@/lib/content/schema";

export type IconCardEditorConfig = {
  /** Đường dẫn nội dung, vd 'main.activities'. */
  path: string;
  /** Tiêu đề thẻ, vd 'Hoạt động'. */
  title: string;
  /** Danh từ trong cảnh báo, vd 'hoạt động' / 'lý do'. */
  noun: string;
  /** Nhãn từng mục + nút thêm, vd 'Hoạt động' / 'Lý do'. */
  itemLabel: string;
  addLabel: string;
  suggestions: string[];
  defaultIcon: string;
  titlePlaceholder: string;
  descPlaceholder: string;
  descHint: string;
};

/** Kiểm tra trường bắt buộc của một thẻ (FR2-R3). */
function validate(item: IconCard) {
  return {
    icon: item.icon.trim() ? "" : "Cần điền biểu tượng.",
    title: item.title.trim() ? "" : "Cần điền tiêu đề.",
    desc: item.desc.trim() ? "" : "Cần điền mô tả.",
  };
}

export default function IconCardEditor({
  initial,
  config,
}: {
  initial: IconCard[];
  config: IconCardEditorConfig;
}) {
  const { value, update, status } = useSectionAutosave<IconCard[]>(
    config.path,
    initial
  );

  // Tổng số phần tử còn thiếu trường bắt buộc → cảnh báo chung ở đầu thẻ.
  const invalidCount = value.filter((item) =>
    Object.values(validate(item)).some(Boolean)
  ).length;

  return (
    <EditorCard title={config.title} extra={<SaveStatusTag status={status} />}>
      {invalidCount > 0 ? (
        <Alert
          className="mb-4"
          type="warning"
          showIcon
          title={`Có ${invalidCount} ${config.noun} chưa điền đủ thông tin.`}
          description={`${config.itemLabel} thiếu biểu tượng, tiêu đề hoặc mô tả sẽ hiển thị lệch lạc trên trang web.`}
        />
      ) : null}

      <ListEditor<IconCard>
        value={value}
        onChange={update}
        addLabel={config.addLabel}
        newItem={() => ({ icon: config.defaultIcon, title: "", desc: "" })}
        getSummary={(item) => `${item.icon} ${item.title}`.trim() || "(chưa có tiêu đề)"}
        renderItem={(item, updateItem, index) => {
          const errors = validate(item);
          return (
            <div className="w-full">
              <div className="mb-2 text-xs font-semibold uppercase opacity-50">
                {config.itemLabel} {index + 1}
              </div>

              <Field
                label="Biểu tượng"
                hint="Hình vui nhỏ hiện phía trên tiêu đề. Bấm chọn một gợi ý bên dưới cho nhanh."
              >
                <Space orientation="vertical" size={8} className="w-full">
                  <Input
                    value={item.icon}
                    maxLength={4}
                    placeholder={config.defaultIcon}
                    status={errors.icon ? "error" : undefined}
                    className="w-24 text-center text-xl"
                    onChange={(e) => updateItem({ ...item, icon: e.target.value })}
                  />
                  <div className="flex flex-wrap gap-1">
                    {config.suggestions.map((icon) => (
                      <Tag
                        key={icon}
                        className="cursor-pointer text-base"
                        color={item.icon === icon ? "gold" : undefined}
                        onClick={() => updateItem({ ...item, icon })}
                      >
                        {icon}
                      </Tag>
                    ))}
                  </div>
                  {errors.icon ? (
                    <div className="text-xs text-red-500">{errors.icon}</div>
                  ) : null}
                </Space>
              </Field>

              <Field label="Tiêu đề">
                <Input
                  value={item.title}
                  placeholder={config.titlePlaceholder}
                  status={errors.title ? "error" : undefined}
                  onChange={(e) => updateItem({ ...item, title: e.target.value })}
                />
                {errors.title ? (
                  <div className="mt-1 text-xs text-red-500">{errors.title}</div>
                ) : null}
              </Field>

              <Field label="Mô tả" hint={config.descHint}>
                <Input.TextArea
                  value={item.desc}
                  rows={3}
                  showCount
                  maxLength={200}
                  placeholder={config.descPlaceholder}
                  status={errors.desc ? "error" : undefined}
                  onChange={(e) => updateItem({ ...item, desc: e.target.value })}
                />
                {errors.desc ? (
                  <div className="mt-1 text-xs text-red-500">{errors.desc}</div>
                ) : null}
              </Field>
            </div>
          );
        }}
      />
    </EditorCard>
  );
}
