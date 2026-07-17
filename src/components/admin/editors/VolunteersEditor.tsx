"use client";

import { useState } from "react";
import { Input, InputNumber, Select } from "antd";
import { EditorLayout, ListEditor, Field, useSectionAutosave } from "@/components/admin/editorKit";
import type { VolunteerTeam } from "@/lib/content/schema";

export default function VolunteersEditor({
  teams: initialTeams,
  count: initialCount,
}: {
  teams: VolunteerTeam[];
  count: number;
}) {
  const [teams, setTeams] = useState<VolunteerTeam[]>(initialTeams);
  const [count, setCount] = useState<number>(initialCount);
  const s1 = useSectionAutosave("volunteerTeams", teams);
  const s2 = useSectionAutosave("volunteerCount", count);

  return (
    <EditorLayout
      title="Tình nguyện viên"
      description="Quản lý các ban và thành viên. Tự lưu nháp."
      status={s1.status}
      savedCount={s1.savedCount}
      previewPath="/2025"
    >
      <Field label="Tổng số TNV hiển thị">
        <InputNumber value={count} onChange={(v) => setCount(v ?? 0)} />
      </Field>
      <ListEditor<VolunteerTeam>
        value={teams}
        onChange={setTeams}
        addLabel="Thêm ban"
        itemTitle={(t) => t.name}
        newItem={() => ({ name: "Ban mới", members: [] })}
        renderItem={(t, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <Input
              addonBefore="Tên ban"
              value={t.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
            <Field label="Thành viên (nhập tên, Enter để thêm)">
              <Select
                mode="tags"
                style={{ width: "100%" }}
                value={t.members}
                onChange={(v) => patch({ members: v })}
                open={false}
                suffixIcon={null}
              />
            </Field>
          </div>
        )}
      />
    </EditorLayout>
  );
}
