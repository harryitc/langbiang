"use client";

import { Alert, Input, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
} from "../editorKit";
import type { SpendingReport } from "@/lib/content/schema";

/** Link báo cáo phải là URL http/https nếu có nhập. */
function isValidUrl(url: string): boolean {
  if (!url.trim()) return true; // bỏ trống là hợp lệ (phần này sẽ tự ẩn)
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Báo cáo thu – chi — main.spendingReport (chỉ là link Google Sheet)
export default function SpendingEditor({
  initial,
}: {
  initial: SpendingReport;
}) {
  const { value, update, status } = useSectionAutosave<SpendingReport>(
    "main.spendingReport",
    initial
  );

  const urlOk = isValidUrl(value.url);

  return (
    <EditorCard
      title="Báo cáo thu – chi"
      extra={<SaveStatusTag status={status} />}
    >
      <p className="mb-3 text-sm opacity-60">
        Không trình bày bảng số liệu trên web nữa — chỉ dán link Google Sheet để
        khách bấm sang xem, cho tiện cập nhật. Bỏ trống link thì phần này{" "}
        <strong>tự ẩn</strong> ở trang Gây quỹ.
      </p>

      <Field
        label="Link Google Sheet"
        hint="Nhớ đặt quyền chia sẻ “Bất kỳ ai có đường liên kết đều xem được”."
      >
        <Input
          value={value.url}
          placeholder="https://docs.google.com/spreadsheets/d/..."
          status={urlOk ? "" : "error"}
          onChange={(e) => update({ ...value, url: e.target.value })}
        />
        {!urlOk ? (
          <div className="mt-1 text-xs text-red-500">
            Link phải bắt đầu bằng http:// hoặc https://.
          </div>
        ) : null}
      </Field>

      <Field
        label="Ghi chú ngắn"
        hint={
          <>
            Hiện phía trên nút bấm. Có thể dùng ký hiệu{" "}
            <Tag className="mx-1">{"{năm}"}</Tag> để tự thay bằng số năm hiện tại.
          </>
        }
      >
        <Input.TextArea
          value={value.note ?? ""}
          rows={3}
          maxLength={300}
          showCount
          placeholder="Toàn bộ khoản thu – chi mùa {năm} được cập nhật công khai trên Google Sheet."
          onChange={(e) => update({ ...value, note: e.target.value })}
        />
      </Field>

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
