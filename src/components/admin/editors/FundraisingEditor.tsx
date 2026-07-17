"use client";

import { useState } from "react";
import { Input, Switch } from "antd";
import { EditorLayout, ListEditor, Field, useSectionAutosave } from "@/components/admin/editorKit";
import type { Fundraising, FundraisingChannel } from "@/lib/content/schema";

export default function FundraisingEditor({ initial }: { initial: Fundraising }) {
  const [state, setState] = useState<Fundraising>(initial);
  const { status, savedCount } = useSectionAutosave("fundraising", state);

  return (
    <EditorLayout
      title="Kênh gây quỹ"
      status={status}
      savedCount={savedCount}
      previewPath="/gay-quy"
    >
      <Field label="Tiêu đề">
        <Input value={state.title} onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))} />
      </Field>
      <Field label="Mô tả">
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 4 }}
          value={state.desc}
          onChange={(e) => setState((s) => ({ ...s, desc: e.target.value }))}
        />
      </Field>
      <ListEditor<FundraisingChannel>
        value={state.channels}
        onChange={(channels) => setState((s) => ({ ...s, channels }))}
        itemTitle={(c) => c.name}
        newItem={() => ({ icon: "🛒", name: "Kênh mới", note: "", cta: "Ủng hộ", href: "#", highlight: false })}
        renderItem={(c, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <Input addonBefore="Icon" value={c.icon} onChange={(e) => patch({ icon: e.target.value })} />
            <Input addonBefore="Tên" value={c.name} onChange={(e) => patch({ name: e.target.value })} />
            <Input addonBefore="Ghi chú" value={c.note} onChange={(e) => patch({ note: e.target.value })} />
            <Input addonBefore="Nút" value={c.cta} onChange={(e) => patch({ cta: e.target.value })} />
            <Input addonBefore="Link" value={c.href} onChange={(e) => patch({ href: e.target.value })} />
            <Field label="Nổi bật">
              <Switch checked={c.highlight} onChange={(highlight) => patch({ highlight })} />
            </Field>
          </div>
        )}
      />
    </EditorLayout>
  );
}
