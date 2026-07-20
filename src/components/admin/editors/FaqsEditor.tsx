"use client";

import { Alert, Input } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
} from "../editorKit";
import type { Faq } from "@/lib/content/schema";

/** Kiểm tra trường bắt buộc của một câu hỏi (FR2-R3). */
function validate(item: Faq) {
  return {
    q: item.q.trim() ? "" : "Vui lòng nhập câu hỏi.",
    a: item.a.trim() ? "" : "Vui lòng nhập câu trả lời.",
  };
}

// Trình biên tập Câu hỏi thường gặp — nhánh nội dung main.faqs (FR2 – 2.8)
export default function FaqsEditor({ initial }: { initial: Faq[] }) {
  const { value, update, status } = useSectionAutosave<Faq[]>(
    "main.faqs",
    initial
  );

  // Tổng số phần tử còn thiếu trường bắt buộc → cảnh báo chung ở đầu thẻ.
  const invalidCount = value.filter((item) =>
    Object.values(validate(item)).some(Boolean)
  ).length;

  return (
    <EditorCard
      title="Câu hỏi thường gặp"
      extra={<SaveStatusTag status={status} />}
    >
      {invalidCount > 0 ? (
        <Alert
          className="mb-4"
          type="warning"
          showIcon
          message={`Có ${invalidCount} câu hỏi chưa điền đủ trường bắt buộc.`}
          description="Câu hỏi thiếu nội dung hỏi hoặc câu trả lời sẽ không hiển thị đúng trên trang chính."
        />
      ) : null}

      <ListEditor<Faq>
        value={value}
        onChange={update}
        addLabel="Thêm câu hỏi"
        newItem={() => ({ q: "", a: "" })}
        renderItem={(item, updateItem, index) => {
          const errors = validate(item);
          return (
            <div className="w-full">
              <div className="mb-2 text-xs font-semibold uppercase opacity-50">
                Câu hỏi {index + 1}
              </div>

              <Field label="Câu hỏi">
                <Input
                  value={item.q}
                  showCount
                  maxLength={150}
                  placeholder="Vd: Tôi cần chuẩn bị gì khi tham gia?"
                  status={errors.q ? "error" : undefined}
                  onChange={(e) => updateItem({ ...item, q: e.target.value })}
                />
                {errors.q ? (
                  <div className="mt-1 text-xs text-red-500">{errors.q}</div>
                ) : null}
              </Field>

              <Field
                label="Câu trả lời"
                hint="Nên trả lời ngắn gọn, đi thẳng vào ý chính (2–4 câu)."
              >
                <Input.TextArea
                  value={item.a}
                  rows={4}
                  showCount
                  maxLength={600}
                  placeholder="Bạn chỉ cần mang theo tinh thần nhiệt huyết; ban tổ chức lo phần còn lại…"
                  status={errors.a ? "error" : undefined}
                  onChange={(e) => updateItem({ ...item, a: e.target.value })}
                />
                {errors.a ? (
                  <div className="mt-1 text-xs text-red-500">{errors.a}</div>
                ) : null}
              </Field>
            </div>
          );
        }}
      />
    </EditorCard>
  );
}
