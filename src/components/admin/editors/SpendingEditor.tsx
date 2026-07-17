"use client";

import { Input, Alert, Space } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
} from "../editorKit";
import type { SpendingReport, SpendingItem } from "@/lib/content/schema";

const { TextArea } = Input;

/**
 * FR2-2.15: mỗi khoản mục cần biểu tượng, tên khoản và số tiền;
 * ghi chú là tuỳ chọn.
 */
function missingFields(item: SpendingItem): string[] {
  const missing: string[] = [];
  if (!item.icon.trim()) missing.push("biểu tượng");
  if (!item.item.trim()) missing.push("tên khoản");
  if (!item.amount.trim()) missing.push("số tiền");
  return missing;
}

// Báo cáo chi tiêu — main.spendingReport
export default function SpendingEditor({ initial }: { initial: SpendingReport }) {
  const { value, update, status } = useSectionAutosave<SpendingReport>(
    "main.spendingReport",
    initial
  );

  // Tổng hợp cảnh báo cho toàn danh sách khoản mục (hiện ở đầu thẻ).
  const invalidCount = value.items.filter(
    (it) => missingFields(it).length > 0
  ).length;

  return (
    <EditorCard title="Báo cáo chi tiêu" extra={<SaveStatusTag status={status} />}>
      {invalidCount > 0 ? (
        <Alert
          type="warning"
          showIcon
          className="mb-3"
          message={`Có ${invalidCount} khoản mục chưa điền đủ thông tin.`}
        />
      ) : null}

      <ListEditor<SpendingItem>
        value={value.items}
        onChange={(items) => update({ ...value, items })}
        title="Các khoản mục"
        addLabel="Thêm khoản mục"
        newItem={() => ({ icon: "🎁", item: "", amount: "", note: "" })}
        renderItem={(item, updateItem) => {
          const missing = missingFields(item);
          return (
            <Space direction="vertical" size={0} style={{ width: "100%" }}>
              <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[90px_1fr_170px]">
                <Field label="Biểu tượng" hint="Một emoji">
                  <Input
                    value={item.icon}
                    placeholder="🎁"
                    maxLength={4}
                    status={item.icon.trim() ? "" : "error"}
                    onChange={(e) => updateItem({ ...item, icon: e.target.value })}
                  />
                </Field>
                <Field label="Tên khoản">
                  <Input
                    value={item.item}
                    placeholder="Quà & nhu yếu phẩm cho các em"
                    status={item.item.trim() ? "" : "error"}
                    onChange={(e) => updateItem({ ...item, item: e.target.value })}
                  />
                </Field>
                <Field label="Số tiền" hint="Nhập kèm đơn vị, ví dụ 45.000.000đ">
                  <Input
                    value={item.amount}
                    placeholder="45.000.000đ"
                    status={item.amount.trim() ? "" : "error"}
                    onChange={(e) =>
                      updateItem({ ...item, amount: e.target.value })
                    }
                  />
                </Field>
              </div>
              <Field label="Ghi chú (tuỳ chọn)">
                <Input
                  value={item.note ?? ""}
                  placeholder="500+ phần quà"
                  onChange={(e) => updateItem({ ...item, note: e.target.value })}
                />
              </Field>
              {missing.length > 0 ? (
                <div className="text-xs text-red-500">
                  Cần điền {missing.join(", ")}.
                </div>
              ) : (
                <div className="text-xs opacity-60">
                  Hiển thị: {item.icon} {item.item} — {item.amount}
                  {item.note?.trim() ? ` (${item.note})` : ""}
                </div>
              )}
            </Space>
          );
        }}
      />

      <div className="mt-4 grid grid-cols-1 gap-x-3 sm:grid-cols-[220px_1fr]">
        <Field label="Tổng cộng" hint="Nhập kèm đơn vị, ví dụ 100.000.000đ">
          <Input
            value={value.total}
            placeholder="100.000.000đ"
            status={value.total.trim() ? "" : "error"}
            onChange={(e) => update({ ...value, total: e.target.value })}
          />
        </Field>
        <Field
          label="Ghi chú cập nhật"
          hint="Dòng chú thích hiển thị dưới bảng chi tiêu."
        >
          <TextArea
            value={value.updatedNote}
            rows={3}
            placeholder="Số liệu mang tính minh hoạ — sẽ cập nhật báo cáo thực tế sau mùa."
            onChange={(e) => update({ ...value, updatedNote: e.target.value })}
          />
        </Field>
      </div>

      {!value.total.trim() ? (
        <div className="text-xs text-red-500">Cần điền tổng cộng.</div>
      ) : null}
    </EditorCard>
  );
}
