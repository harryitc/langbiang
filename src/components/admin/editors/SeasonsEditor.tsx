"use client";

import { useState } from "react";
import { Input, Switch } from "antd";
import { EditorLayout, ListEditor, Field, useSectionAutosave } from "@/components/admin/editorKit";
import type { Season } from "@/lib/content/schema";

export default function SeasonsEditor({ initial }: { initial: Season[] }) {
  const [seasons, setSeasons] = useState<Season[]>(initial);
  const { status, savedCount } = useSectionAutosave("seasons", seasons);

  return (
    <EditorLayout
      title="Mùa / Năm hoạt động"
      description="Quản lý các mùa qua các năm để website hoạt động xuyên suốt."
      status={status}
      savedCount={savedCount}
      previewPath="/"
    >
      <ListEditor<Season>
        value={seasons}
        onChange={setSeasons}
        itemTitle={(s) => s.label || s.year}
        newItem={() => ({ year: "2027", label: "Mùa 2027", dateLabel: "", dateISO: "", active: false })}
        renderItem={(s, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <Input addonBefore="Năm" value={s.year} onChange={(e) => patch({ year: e.target.value })} />
            <Input addonBefore="Tên mùa" value={s.label} onChange={(e) => patch({ label: e.target.value })} />
            <Input addonBefore="Nhãn ngày" value={s.dateLabel} onChange={(e) => patch({ dateLabel: e.target.value })} />
            <Input
              addonBefore="Ngày ISO"
              value={s.dateISO}
              onChange={(e) => patch({ dateISO: e.target.value })}
              placeholder="2027-09-20"
            />
            <Field label="Mùa hiện tại">
              <Switch checked={s.active} onChange={(active) => patch({ active })} />
            </Field>
          </div>
        )}
      />
    </EditorLayout>
  );
}
