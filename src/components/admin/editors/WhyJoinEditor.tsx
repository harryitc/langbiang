"use client";

import { Alert, Input, Space, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
} from "../editorKit";
import type { IconCard } from "@/lib/content/schema";

/** Gợi ý biểu tượng nhanh cho người biên tập (FR2 – 2.7). */
const ICON_SUGGESTIONS = ["🤝", "🌱", "💚", "✨", "🫶", "🌏", "🎯", "🧡", "🌟"];

/** Kiểm tra trường bắt buộc của một lý do tham gia (FR2-R3). */
function validate(item: IconCard) {
  return {
    icon: item.icon.trim() ? "" : "Cần điền biểu tượng.",
    title: item.title.trim() ? "" : "Cần điền tiêu đề.",
    desc: item.desc.trim() ? "" : "Cần điền mô tả.",
  };
}

// Trình biên tập Lý do tham gia — nhánh nội dung main.whyJoin
export default function WhyJoinEditor({ initial }: { initial: IconCard[] }) {
  const { value, update, status } = useSectionAutosave<IconCard[]>(
    "main.whyJoin",
    initial
  );

  // Tổng số phần tử còn thiếu trường bắt buộc → cảnh báo chung ở đầu thẻ.
  const invalidCount = value.filter((item) =>
    Object.values(validate(item)).some(Boolean)
  ).length;

  return (
    <EditorCard title="Lý do tham gia" extra={<SaveStatusTag status={status} />}>
      {invalidCount > 0 ? (
        <Alert
          className="mb-4"
          type="warning"
          showIcon
          message={`Có ${invalidCount} lý do chưa điền đủ trường bắt buộc.`}
          description="Lý do thiếu biểu tượng, tiêu đề hoặc mô tả sẽ không hiển thị đúng trên trang chính."
        />
      ) : null}

      <ListEditor<IconCard>
        value={value}
        onChange={update}
        addLabel="Thêm lý do"
        newItem={() => ({ icon: "🤝", title: "", desc: "" })}
        renderItem={(item, updateItem, index) => {
          const errors = validate(item);
          return (
            <div className="w-full">
              <div className="mb-2 text-xs font-semibold uppercase opacity-50">
                Lý do {index + 1}
              </div>

              <Field
                label="Biểu tượng (emoji)"
                hint="Dán một emoji, hoặc bấm chọn từ gợi ý bên dưới."
              >
                <Space direction="vertical" size={8} className="w-full">
                  <Input
                    value={item.icon}
                    maxLength={4}
                    placeholder="🤝"
                    status={errors.icon ? "error" : undefined}
                    className="w-24 text-center text-xl"
                    onChange={(e) =>
                      updateItem({ ...item, icon: e.target.value })
                    }
                  />
                  <div className="flex flex-wrap gap-1">
                    {ICON_SUGGESTIONS.map((icon) => (
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
                  placeholder="Vd: Kết nối những trái tim"
                  status={errors.title ? "error" : undefined}
                  onChange={(e) =>
                    updateItem({ ...item, title: e.target.value })
                  }
                />
                {errors.title ? (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.title}
                  </div>
                ) : null}
              </Field>

              <Field
                label="Mô tả"
                hint="Nên giữ khoảng 1–2 câu để các thẻ lý do cân đối với nhau."
              >
                <Input.TextArea
                  value={item.desc}
                  rows={3}
                  showCount
                  maxLength={200}
                  placeholder="Gặp gỡ, đồng hành cùng những người trẻ giàu nhiệt huyết và tấm lòng thiện nguyện."
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
