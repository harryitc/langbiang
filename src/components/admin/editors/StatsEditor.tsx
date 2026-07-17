"use client";

import { InputNumber, Input, Alert, Space } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
} from "../editorKit";
import type { Stat } from "@/lib/content/schema";

/** FR2-2.3: nhãn là bắt buộc; hậu tố tuỳ chọn; giá trị số luôn là số ≥ 0. */
function missingFields(item: Stat): string[] {
  const missing: string[] = [];
  if (!item.label.trim()) missing.push("nhãn");
  return missing;
}

// Con số nổi bật — main.stats
export default function StatsEditor({ initial }: { initial: Stat[] }) {
  const { value, update, status } = useSectionAutosave<Stat[]>(
    "main.stats",
    initial
  );

  // Tổng hợp cảnh báo cho toàn danh sách (hiện ở đầu thẻ).
  const invalidCount = value.filter((s) => missingFields(s).length > 0).length;

  return (
    <EditorCard title="Con số nổi bật" extra={<SaveStatusTag status={status} />}>
      {invalidCount > 0 ? (
        <Alert
          type="warning"
          showIcon
          className="mb-3"
          message={`Có ${invalidCount} con số chưa điền nhãn.`}
        />
      ) : null}

      <ListEditor<Stat>
        value={value}
        onChange={update}
        addLabel="Thêm con số"
        newItem={() => ({ value: 0, suffix: "", label: "" })}
        renderItem={(item, updateItem) => {
          const missing = missingFields(item);
          return (
            <Space direction="vertical" size={0} style={{ width: "100%" }}>
              <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[140px_140px_1fr]">
                <Field label="Giá trị số">
                  <InputNumber
                    value={item.value}
                    min={0}
                    precision={0}
                    style={{ width: "100%" }}
                    placeholder="200"
                    onChange={(v) =>
                      // Để trống ô số ⇒ quy về 0 (tránh NaN lọt vào bản nháp JSON).
                      updateItem({ ...item, value: typeof v === "number" ? v : 0 })
                    }
                  />
                </Field>
                <Field label="Hậu tố" hint='Ví dụ: "+" hoặc " ngày"'>
                  <Input
                    value={item.suffix}
                    placeholder="+"
                    onChange={(e) =>
                      updateItem({ ...item, suffix: e.target.value })
                    }
                  />
                </Field>
                <Field label="Nhãn">
                  <Input
                    value={item.label}
                    placeholder="Em nhỏ nhận quà"
                    status={item.label.trim() ? "" : "error"}
                    onChange={(e) =>
                      updateItem({ ...item, label: e.target.value })
                    }
                  />
                </Field>
              </div>
              {missing.length > 0 ? (
                <div className="text-xs text-red-500">
                  Cần điền {missing.join(", ")}.
                </div>
              ) : (
                <div className="text-xs opacity-60">
                  Hiển thị: {item.value}
                  {item.suffix} — {item.label}
                </div>
              )}
            </Space>
          );
        }}
      />
    </EditorCard>
  );
}
