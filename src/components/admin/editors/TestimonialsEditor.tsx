"use client";

import { Input, Typography } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
  ImageField,
} from "../editorKit";
import type { Testimonial } from "@/lib/content/schema";

const { Text } = Typography;

/** Đường dẫn nội dung của nhóm này trong store. */
const PATH = "main.testimonials";

/** Trường bắt buộc theo FRD 2.14 (ảnh đại diện là tuỳ chọn). */
function missingFields(item: Testimonial): string[] {
  const missing: string[] = [];
  if (!item.name.trim()) missing.push("Tên");
  if (!item.role.trim()) missing.push("Vai trò");
  if (!item.quote.trim()) missing.push("Trích dẫn");
  return missing;
}

/** Editor "Cảm nhận" — danh sách main.testimonials. */
export default function TestimonialsEditor({
  initial,
}: {
  initial: Testimonial[];
}) {
  const { value, update, status } = useSectionAutosave<Testimonial[]>(
    PATH,
    initial
  );

  // Số mục còn thiếu trường bắt buộc — cảnh báo chung ở đầu thẻ.
  const invalidCount = value.filter((t) => missingFields(t).length > 0).length;

  return (
    <EditorCard title="Cảm nhận" extra={<SaveStatusTag status={status} />}>
      <p className="mb-4 text-sm text-black/60">
        Những chia sẻ của tình nguyện viên và người đồng hành. Ảnh đại diện có
        thể để trống — giao diện sẽ hiển thị chữ cái đầu của tên.
      </p>

      {invalidCount > 0 ? (
        <div className="mb-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Có {invalidCount} cảm nhận còn thiếu trường bắt buộc. Vui lòng điền
          đầy đủ trước khi xuất bản.
        </div>
      ) : null}

      <ListEditor<Testimonial>
        value={value}
        onChange={update}
        title={`Danh sách cảm nhận (${value.length})`}
        addLabel="Thêm cảm nhận"
        newItem={() => ({ name: "", role: "", avatar: "", quote: "" })}
        renderItem={(item, updateItem, index) => {
          const missing = missingFields(item);
          return (
            <div className="w-full">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Text strong>Cảm nhận #{index + 1}</Text>
                {item.name.trim() ? (
                  <Text type="secondary">— {item.name}</Text>
                ) : null}
                {missing.length > 0 ? (
                  <Text type="danger" className="text-xs">
                    Cần điền {missing.join(", ")}.
                  </Text>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <Field label="Tên">
                  <Input
                    placeholder="Vd: Thảo Nhi"
                    value={item.name}
                    status={item.name.trim() ? undefined : "error"}
                    onChange={(e) =>
                      updateItem({ ...item, name: e.target.value })
                    }
                  />
                </Field>

                <Field label="Vai trò" hint="Vd: TNV Ban Chương trình 2025">
                  <Input
                    placeholder="Vai trò / ban phụ trách"
                    value={item.role}
                    status={item.role.trim() ? undefined : "error"}
                    onChange={(e) =>
                      updateItem({ ...item, role: e.target.value })
                    }
                  />
                </Field>
              </div>

              <Field label="Ảnh đại diện" hint="Tuỳ chọn — ảnh vuông hiển thị đẹp nhất.">
                <ImageField
                  value={item.avatar ?? ""}
                  folder="testimonials"
                  onChange={(url) => updateItem({ ...item, avatar: url })}
                />
              </Field>

              <Field label="Trích dẫn">
                <Input.TextArea
                  placeholder="Chia sẻ ngắn gọn về mùa trăng…"
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  showCount
                  maxLength={400}
                  value={item.quote}
                  status={item.quote.trim() ? undefined : "error"}
                  onChange={(e) =>
                    updateItem({ ...item, quote: e.target.value })
                  }
                />
              </Field>
            </div>
          );
        }}
      />
    </EditorCard>
  );
}
