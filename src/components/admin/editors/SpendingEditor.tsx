"use client";

import { useState } from "react";
import { Input } from "antd";
import { EditorLayout, ListEditor, Field, useSectionAutosave } from "@/components/admin/editorKit";
import type { SpendingReport, SpendingItem } from "@/lib/content/schema";

export default function SpendingEditor({ initial }: { initial: SpendingReport }) {
  const [state, setState] = useState<SpendingReport>(initial);
  const { status, savedCount } = useSectionAutosave("spendingReport", state);

  return (
    <EditorLayout
      title="Báo cáo chi"
      status={status}
      savedCount={savedCount}
      previewPath="/gay-quy"
    >
      <Field label="Tổng cộng">
        <Input
          value={state.total}
          onChange={(e) => setState((s) => ({ ...s, total: e.target.value }))}
          placeholder="100.000.000đ"
        />
      </Field>
      <Field label="Ghi chú cập nhật">
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 4 }}
          value={state.updatedNote}
          onChange={(e) => setState((s) => ({ ...s, updatedNote: e.target.value }))}
        />
      </Field>
      <ListEditor<SpendingItem>
        value={state.items}
        onChange={(items) => setState((s) => ({ ...s, items }))}
        itemTitle={(it) => it.item}
        newItem={() => ({ icon: "🎁", item: "Khoản chi mới", amount: "", note: "" })}
        renderItem={(it, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <Input addonBefore="Icon" value={it.icon} onChange={(e) => patch({ icon: e.target.value })} />
            <Input addonBefore="Khoản" value={it.item} onChange={(e) => patch({ item: e.target.value })} />
            <Input addonBefore="Số tiền" value={it.amount} onChange={(e) => patch({ amount: e.target.value })} />
            <Input
              addonBefore="Ghi chú"
              value={it.note}
              onChange={(e) => patch({ note: e.target.value })}
              placeholder="(tuỳ chọn)"
            />
          </div>
        )}
      />
    </EditorLayout>
  );
}
