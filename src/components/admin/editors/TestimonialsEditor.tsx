"use client";

import { useState } from "react";
import { Input } from "antd";
import { EditorLayout, ListEditor, useSectionAutosave } from "@/components/admin/editorKit";
import type { Testimonial } from "@/lib/content/schema";

export default function TestimonialsEditor({ initial }: { initial: Testimonial[] }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initial);
  const { status, savedCount } = useSectionAutosave("testimonials", testimonials);

  return (
    <EditorLayout
      title="Cảm nhận tình nguyện viên"
      description="Thêm/sửa/xoá cảm nhận. Tự lưu nháp; xem trước bên phải."
      status={status}
      savedCount={savedCount}
      previewPath="/cam-nhan"
    >
      <ListEditor<Testimonial>
        value={testimonials}
        onChange={setTestimonials}
        addLabel="Thêm cảm nhận"
        itemTitle={(t) => t.name}
        newItem={() => ({ name: "Tên TNV", role: "", avatar: "", quote: "" })}
        renderItem={(t, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <Input
              addonBefore="Tên"
              value={t.name}
              onChange={(e) => patch({ name: e.target.value })}
            />
            <Input
              addonBefore="Vai trò"
              value={t.role}
              onChange={(e) => patch({ role: e.target.value })}
            />
            <Input
              addonBefore="Ảnh"
              placeholder="(tuỳ chọn)"
              value={t.avatar}
              onChange={(e) => patch({ avatar: e.target.value })}
            />
            <Input.TextArea
              placeholder="Cảm nhận"
              autoSize={{ minRows: 3 }}
              value={t.quote}
              onChange={(e) => patch({ quote: e.target.value })}
            />
          </div>
        )}
      />
    </EditorLayout>
  );
}
