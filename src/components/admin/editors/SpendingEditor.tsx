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
        Hiện ở mục &ldquo;Báo cáo thu – chi&rdquo; trên{" "}
        <strong>trang Gây quỹ</strong>. Web không trình bày bảng số liệu — chỉ
        cần dán liên kết Google Sheet để khách bấm sang xem, như vậy cập nhật số
        liệu cũng tiện hơn. Bỏ trống liên kết thì mục này <strong>tự ẩn</strong>.
        Mỗi năm đã qua có báo cáo riêng, sửa trong mục{" "}
        <strong>Danh mục năm đã qua</strong>.
      </p>

      <SpendingFields value={value} onChange={update} />

      {!value.url.trim() ? (
        <Alert
          type="info"
          showIcon
          title="Chưa có liên kết — mục Báo cáo thu – chi đang ẩn trên trang Gây quỹ."
        />
      ) : null}
    </EditorCard>
  );
}
