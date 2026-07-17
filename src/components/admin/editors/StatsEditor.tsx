"use client";

import { useState } from "react";
import { Input, InputNumber } from "antd";
import { EditorLayout, ListEditor, useSectionAutosave } from "@/components/admin/editorKit";
import type { Stat } from "@/lib/content/schema";

export default function StatsEditor({ initial }: { initial: Stat[] }) {
  const [stats, setStats] = useState<Stat[]>(initial);
  const { status, savedCount } = useSectionAutosave("stats", stats);

  return (
    <EditorLayout
      title="Con số nổi bật"
      description="Các chỉ số nổi bật hiển thị trên trang. Tự lưu nháp; xem trước bên phải."
      status={status}
      savedCount={savedCount}
      previewPath="/2025"
    >
      <ListEditor<Stat>
        value={stats}
        onChange={setStats}
        addLabel="Thêm chỉ số"
        itemTitle={(s) => s.label}
        newItem={() => ({ value: 0, suffix: "+", label: "Chỉ số mới" })}
        renderItem={(s, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <InputNumber
                addonBefore="Số"
                style={{ width: 180 }}
                value={s.value}
                onChange={(v) => patch({ value: Number(v ?? 0) })}
              />
              <Input
                addonBefore="Hậu tố"
                placeholder="+ hoặc ' ngày'"
                value={s.suffix}
                onChange={(e) => patch({ suffix: e.target.value })}
              />
            </div>
            <Input
              addonBefore="Nhãn"
              value={s.label}
              onChange={(e) => patch({ label: e.target.value })}
            />
          </div>
        )}
      />
    </EditorLayout>
  );
}
