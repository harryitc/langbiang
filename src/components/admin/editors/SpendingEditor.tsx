"use client";

import { Alert } from "antd";
import { useSectionAutosave, SaveStatusTag, EditorCard } from "../editorKit";
import { SpendingFields } from "./sections";
import type { SpendingReport } from "@/lib/content/schema";

// Báo cáo thu – chi của MÙA HIỆN TẠI — main.spendingReport (link Google Sheet).
// Báo cáo của từng năm đã qua nằm trong editor "Danh mục năm đã qua".
export default function SpendingEditor({
  initial,
}: {
  initial: SpendingReport;
}) {
  const { value, update, status } = useSectionAutosave<SpendingReport>(
    "main.spendingReport",
    initial
  );

  return (
    <EditorCard
      title="Báo cáo thu – chi (mùa hiện tại)"
      extra={<SaveStatusTag status={status} />}
    >
      <p className="mb-3 text-sm opacity-60">
        Không trình bày bảng số liệu trên web — chỉ dán link Google Sheet để
        khách bấm sang xem, cho tiện cập nhật. Bỏ trống link thì phần này{" "}
        <strong>tự ẩn</strong> ở trang Gây quỹ. Mỗi năm đã qua có báo cáo riêng,
        sửa trong mục <strong>Danh mục năm đã qua</strong>.
      </p>

      <SpendingFields value={value} onChange={update} />

      {!value.url.trim() ? (
        <Alert
          type="info"
          showIcon
          message="Chưa có link — phần Báo cáo thu – chi đang ẩn trên trang Gây quỹ."
        />
      ) : null}
    </EditorCard>
  );
}
