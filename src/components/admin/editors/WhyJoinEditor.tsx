"use client";

import { useState } from "react";
import { Input } from "antd";
import { EditorLayout, ListEditor, useSectionAutosave } from "@/components/admin/editorKit";
import type { WhyJoinItem } from "@/lib/content/schema";

export default function WhyJoinEditor({ initial }: { initial: WhyJoinItem[] }) {
  const [items, setItems] = useState<WhyJoinItem[]>(initial);
  const { status, savedCount } = useSectionAutosave("whyJoin", items);

  return (
    <EditorLayout
      title="Lý do tham gia"
      description="Các lý do khích lệ tình nguyện viên tham gia. Tự lưu nháp; xem trước bên phải."
      status={status}
      savedCount={savedCount}
      previewPath="/"
    >
      <ListEditor<WhyJoinItem>
        value={items}
        onChange={setItems}
        addLabel="Thêm lý do"
        itemTitle={(w) => w.title}
        newItem={() => ({ icon: "🤝", title: "Lý do mới", desc: "" })}
        renderItem={(w, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <Input
                addonBefore="Icon"
                style={{ width: 120 }}
                value={w.icon}
                onChange={(e) => patch({ icon: e.target.value })}
              />
              <Input
                addonBefore="Tiêu đề"
                value={w.title}
                onChange={(e) => patch({ title: e.target.value })}
              />
            </div>
            <Input.TextArea
              placeholder="Mô tả"
              autoSize={{ minRows: 2 }}
              value={w.desc}
              onChange={(e) => patch({ desc: e.target.value })}
            />
          </div>
        )}
      />
    </EditorLayout>
  );
}
