"use client";

import { Alert, Input, Space, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  ListEditor,
} from "../editorKit";
import type { Donation } from "@/lib/content/schema";

/**
 * Trình biên tập "Đóng góp" — nhánh nội dung `main.donations` (FRD 2.13).
 * Mỗi mục: tên người/đơn vị, số tiền (tuỳ chọn), hiện vật (tuỳ chọn), ngày.
 * FR2-R6: mỗi đóng góp phải có ít nhất số tiền HOẶC hiện vật.
 */
export default function DonationsEditor({ initial }: { initial: Donation[] }) {
  const { value, update, status } = useSectionAutosave<Donation[]>(
    "main.donations",
    initial
  );

  // Các mục còn thiếu dữ liệu bắt buộc (cảnh báo, không chặn lưu nháp).
  const invalid = value
    .map((d, i) => ({ d, i }))
    .filter(
      ({ d }) =>
        !d.name.trim() ||
        !d.date.trim() ||
        (!d.amount?.trim() && !d.gift?.trim())
    );

  return (
    <EditorCard
      title="Đóng góp"
      extra={
        <Space size={8}>
          <Tag>{value.length} mục</Tag>
          <SaveStatusTag status={status} />
        </Space>
      }
    >
      {invalid.length > 0 ? (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 12 }}
          message={`Có ${invalid.length} mục chưa hợp lệ`}
          description={`Cần điền Tên người/đơn vị và Ngày; đồng thời phải có ít nhất Số tiền hoặc Hiện vật. Mục cần sửa: ${invalid
            .map(({ i }) => `#${i + 1}`)
            .join(", ")}.`}
        />
      ) : null}

      <ListEditor<Donation>
        value={value}
        onChange={update}
        addLabel="Thêm đóng góp"
        newItem={() => ({ name: "", amount: "", gift: "", date: "" })}
        renderItem={(item, updateItem, index) => {
          const missingName = !item.name.trim();
          const missingDate = !item.date.trim();
          const missingValue = !item.amount?.trim() && !item.gift?.trim();
          return (
            <div className="w-full">
              <div className="mb-2 text-xs font-semibold opacity-60">
                Mục #{index + 1}
              </div>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <Field
                  label="Tên người/đơn vị"
                  hint={missingName ? "Cần điền Tên người/đơn vị." : undefined}
                >
                  <Input
                    status={missingName ? "error" : undefined}
                    placeholder="vd: Anh Nguyễn Văn A"
                    value={item.name}
                    onChange={(e) =>
                      updateItem({ ...item, name: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Ngày"
                  hint={missingDate ? "Cần điền Ngày." : "Định dạng: dd/mm/yyyy"}
                >
                  <Input
                    status={missingDate ? "error" : undefined}
                    placeholder="vd: 20/09/2025"
                    value={item.date}
                    onChange={(e) =>
                      updateItem({ ...item, date: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Số tiền (tuỳ chọn)"
                  hint={
                    missingValue
                      ? "Cần có ít nhất Số tiền hoặc Hiện vật."
                      : "Để trống nếu đóng góp bằng hiện vật."
                  }
                >
                  <Input
                    status={missingValue ? "error" : undefined}
                    placeholder="vd: 2.000.000đ"
                    value={item.amount ?? ""}
                    onChange={(e) =>
                      updateItem({ ...item, amount: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Hiện vật (tuỳ chọn)"
                  hint={
                    missingValue
                      ? "Cần có ít nhất Số tiền hoặc Hiện vật."
                      : "Để trống nếu đóng góp bằng tiền."
                  }
                >
                  <Input
                    status={missingValue ? "error" : undefined}
                    placeholder="vd: 80 phần quà Trung thu"
                    value={item.gift ?? ""}
                    onChange={(e) =>
                      updateItem({ ...item, gift: e.target.value })
                    }
                  />
                </Field>
              </div>
            </div>
          );
        }}
      />
    </EditorCard>
  );
}
