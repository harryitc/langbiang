"use client";

import { useState } from "react";
import { Input } from "antd";
import { EditorLayout, ListEditor, useSectionAutosave } from "@/components/admin/editorKit";
import type { Faq } from "@/lib/content/schema";

export default function FaqEditor({ initial }: { initial: Faq[] }) {
  const [faqs, setFaqs] = useState<Faq[]>(initial);
  const { status, savedCount } = useSectionAutosave("faqs", faqs);

  return (
    <EditorLayout
      title="Câu hỏi thường gặp"
      description="Thêm/sửa/xoá câu hỏi. Tự lưu nháp; xem trước bên phải."
      status={status}
      savedCount={savedCount}
      previewPath="/"
    >
      <ListEditor<Faq>
        value={faqs}
        onChange={setFaqs}
        addLabel="Thêm câu hỏi"
        itemTitle={(f) => f.q}
        newItem={() => ({ q: "Câu hỏi mới?", a: "" })}
        renderItem={(f, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <Input
              addonBefore="Hỏi"
              value={f.q}
              onChange={(e) => patch({ q: e.target.value })}
            />
            <Input.TextArea
              placeholder="Trả lời"
              autoSize={{ minRows: 2 }}
              value={f.a}
              onChange={(e) => patch({ a: e.target.value })}
            />
          </div>
        )}
      />
    </EditorLayout>
  );
}
