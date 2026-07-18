"use client";

import { Alert, Space, Tag } from "antd";
import { useSectionAutosave, SaveStatusTag, EditorCard } from "../editorKit";
import { PhotoListEditor, missingPhotoFields } from "./sections";
import type { Photo } from "@/lib/content/schema";

// Thư viện ảnh — main.gallery
export default function GalleryEditor({ initial }: { initial: Photo[] }) {
  const { value, update, status } = useSectionAutosave<Photo[]>(
    "main.gallery",
    initial
  );

  // Tổng hợp cảnh báo cho toàn danh sách (hiện ở đầu thẻ).
  const invalidCount = value.filter((p) => missingPhotoFields(p).length > 0).length;

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

      <PhotoListEditor value={value} onChange={update} folder="gallery" />
    </EditorCard>
  );
}
