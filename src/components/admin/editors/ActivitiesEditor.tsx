"use client";

import { useState } from "react";
import { Input } from "antd";
import { EditorLayout, ListEditor, useSectionAutosave } from "@/components/admin/editorKit";
import type { Activity } from "@/lib/content/schema";

export default function ActivitiesEditor({ initial }: { initial: Activity[] }) {
  const [items, setItems] = useState<Activity[]>(initial);
  const { status, savedCount } = useSectionAutosave("activities", items);

  return (
    <EditorLayout
      title="Hoạt động"
      description="Thêm/sửa/xoá hoạt động chương trình. Tự lưu nháp; xem trước bên phải."
      status={status}
      savedCount={savedCount}
      previewPath="/chuong-trinh"
    >
      <ListEditor<Activity>
        value={items}
        onChange={setItems}
        addLabel="Thêm hoạt động"
        itemTitle={(a) => a.title}
        newItem={() => ({ icon: "🌕", title: "Hoạt động mới", desc: "" })}
        renderItem={(a, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <Input
                addonBefore="Icon"
                style={{ width: 120 }}
                value={a.icon}
                onChange={(e) => patch({ icon: e.target.value })}
              />
              <Input
                addonBefore="Tiêu đề"
                value={a.title}
                onChange={(e) => patch({ title: e.target.value })}
              />
            </div>
            <Input.TextArea
              placeholder="Mô tả"
              autoSize={{ minRows: 2 }}
              value={a.desc}
              onChange={(e) => patch({ desc: e.target.value })}
            />
          </div>
        )}
      />
    </EditorLayout>
  );
}
