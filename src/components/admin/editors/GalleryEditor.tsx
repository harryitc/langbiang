"use client";

import { Alert, Input, Space, Switch, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
  ImageField,
} from "../editorKit";
import type { Photo } from "@/lib/content/schema";

/** Nhãn hiển thị của các trường (dùng cho thông báo "Cần điền …"). */
const FIELD_LABELS = {
  src: "Ảnh",
} as const;

/** FR2-2.6: bắt buộc có ảnh; chú thích, mô tả và cờ "ảnh cao" tuỳ chọn. */
function missingFields(item: Photo): string[] {
  const missing: string[] = [];
  if (!item.src.trim()) missing.push(FIELD_LABELS.src);
  return missing;
}

// Thư viện ảnh — main.gallery
export default function GalleryEditor({ initial }: { initial: Photo[] }) {
  const { value, update, status } = useSectionAutosave<Photo[]>(
    "main.gallery",
    initial
  );

  // Tổng hợp cảnh báo cho toàn danh sách (hiện ở đầu thẻ).
  const invalidCount = value.filter((p) => missingFields(p).length > 0).length;

  return (
    <EditorCard
      title="Thư viện ảnh"
      extra={
        <Space size={8}>
          <Tag>{value.length} ảnh</Tag>
          <SaveStatusTag status={status} />
        </Space>
      }
    >
      <p className="mb-3 text-sm opacity-60">
        Các khoảnh khắc hiển thị ở lưới ảnh trang chính. Bật &ldquo;Ảnh
        cao&rdquo; để ảnh chiếm 2 hàng trong lưới.
      </p>

      {invalidCount > 0 ? (
        <Alert
          type="warning"
          showIcon
          className="mb-3"
          message={`Có ${invalidCount} ảnh chưa điền đủ thông tin bắt buộc.`}
        />
      ) : null}

      <ListEditor<Photo>
        value={value}
        onChange={update}
        addLabel="Thêm ảnh"
        newItem={() => ({ src: "", caption: "", desc: "", tall: false })}
        renderItem={(item, updateItem, index) => {
          const missing = missingFields(item);
          return (
            <Space direction="vertical" size={0} style={{ width: "100%" }}>
              <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                <Field label={`Ảnh #${index + 1}`} hint="Tải ảnh từ máy hoặc dán URL sẵn có.">
                  <ImageField
                    value={item.src}
                    folder="gallery"
                    onChange={(src) => updateItem({ ...item, src })}
                  />
                </Field>

                <div>
                  <Field label="Chú thích" hint="Dòng chữ ngắn hiện trên ảnh.">
                    <Input
                      value={item.caption ?? ""}
                      placeholder="Đêm hội trăng rằm"
                      onChange={(e) =>
                        updateItem({ ...item, caption: e.target.value })
                      }
                    />
                  </Field>

                  <Field label="Mô tả" hint="Mô tả chi tiết hơn (tuỳ chọn).">
                    <Input.TextArea
                      value={item.desc ?? ""}
                      rows={3}
                      placeholder="Các em nhỏ rước đèn quanh sân trường…"
                      onChange={(e) =>
                        updateItem({ ...item, desc: e.target.value })
                      }
                    />
                  </Field>

                  <Field
                    label="Ảnh cao"
                    hint="Ảnh chiếm 2 hàng trong lưới masonry."
                  >
                    <Switch
                      checked={!!item.tall}
                      onChange={(tall) => updateItem({ ...item, tall })}
                    />
                  </Field>
                </div>
              </div>

              {missing.length > 0 ? (
                <div className="text-xs text-red-500">
                  Cần chọn {missing.join(", ").toLowerCase()}.
                </div>
              ) : (
                <div className="text-xs opacity-60">
                  Hiển thị: {item.caption || "(chưa có chú thích)"}
                  {item.tall ? " — ảnh cao" : ""}
                </div>
              )}
            </Space>
          );
        }}
      />
    </EditorCard>
  );
}
