"use client";

import { useState } from "react";
import { Input, Switch } from "antd";
import { EditorLayout, ListEditor, Field, useSectionAutosave } from "@/components/admin/editorKit";
import type { GalleryItem } from "@/lib/content/schema";

export default function GalleryEditor({ initial }: { initial: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(initial);
  const { status, savedCount } = useSectionAutosave("gallery", items);

  return (
    <EditorLayout
      title="Thư viện ảnh"
      description="Thêm/sửa/xoá ảnh. Tự lưu nháp; xem trước bên phải."
      status={status}
      savedCount={savedCount}
      previewPath="/"
    >
      <ListEditor<GalleryItem>
        value={items}
        onChange={setItems}
        addLabel="Thêm ảnh"
        itemTitle={(g) => g.caption}
        newItem={() => ({ src: "/gallery/g1.jpg", caption: "Ảnh mới", desc: "", tall: false })}
        renderItem={(g, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <Input
              addonBefore="Ảnh"
              value={g.src}
              onChange={(e) => patch({ src: e.target.value })}
              placeholder="/gallery/g1.jpg"
            />
            <Input
              addonBefore="Chú thích"
              value={g.caption}
              onChange={(e) => patch({ caption: e.target.value })}
            />
            <Input.TextArea
              autoSize={{ minRows: 2 }}
              value={g.desc}
              onChange={(e) => patch({ desc: e.target.value })}
            />
            <Field label="Ảnh cao (chiếm 2 hàng)">
              <Switch checked={g.tall} onChange={(v) => patch({ tall: v })} />
            </Field>
          </div>
        )}
      />
    </EditorLayout>
  );
}
