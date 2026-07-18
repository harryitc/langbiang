"use client";

import { Alert } from "antd";
import { useSectionAutosave, SaveStatusTag, EditorCard } from "../editorKit";
import { StatListEditor, missingStatFields } from "./sections";
import type { Stat } from "@/lib/content/schema";

// Con số nổi bật — main.stats
export default function StatsEditor({ initial }: { initial: Stat[] }) {
  const { value, update, status } = useSectionAutosave<Stat[]>(
    "main.stats",
    initial
  );

  // Tổng hợp cảnh báo cho toàn danh sách (hiện ở đầu thẻ).
  const invalidCount = value.filter((s) => missingStatFields(s).length > 0).length;

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

      <StatListEditor value={value} onChange={update} />
    </EditorCard>
  );
}
