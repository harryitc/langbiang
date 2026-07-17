"use client";

import { useState } from "react";
import { Input } from "antd";
import { EditorLayout, ListEditor, Field, useSectionAutosave } from "@/components/admin/editorKit";
import type { TimelineDay, TimelineItem } from "@/lib/content/schema";

export default function TimelineEditor({ initial }: { initial: TimelineDay[] }) {
  const [days, setDays] = useState<TimelineDay[]>(initial);
  const { status, savedCount } = useSectionAutosave("timeline", days);

  return (
    <EditorLayout
      title="Lịch trình"
      description="Quản lý lịch trình theo từng ngày. Tự lưu nháp; xem trước bên phải."
      status={status}
      savedCount={savedCount}
      previewPath="/chuong-trinh"
    >
      <ListEditor<TimelineDay>
        value={days}
        onChange={setDays}
        addLabel="Thêm ngày"
        itemTitle={(d) => d.day}
        newItem={() => ({ day: "Ngày mới", date: "", items: [] })}
        renderItem={(d, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <Field label="Ngày">
              <div style={{ display: "flex", gap: 8 }}>
                <Input
                  addonBefore="Ngày"
                  value={d.day}
                  onChange={(e) => patch({ day: e.target.value })}
                />
                <Input
                  addonBefore="Ngày tháng"
                  placeholder="26/09/2026"
                  value={d.date}
                  onChange={(e) => patch({ date: e.target.value })}
                />
              </div>
            </Field>
            <ListEditor<TimelineItem>
              value={d.items}
              onChange={(items) => patch({ items })}
              addLabel="Thêm mốc"
              itemTitle={(it) => it.title}
              newItem={() => ({ time: "08:00", title: "Mốc mới", desc: "" })}
              renderItem={(it, patchIt) => (
                <div style={{ display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Input
                      addonBefore="Giờ"
                      style={{ width: 160 }}
                      value={it.time}
                      onChange={(e) => patchIt({ time: e.target.value })}
                    />
                    <Input
                      addonBefore="Tiêu đề"
                      value={it.title}
                      onChange={(e) => patchIt({ title: e.target.value })}
                    />
                  </div>
                  <Input.TextArea
                    placeholder="Mô tả"
                    autoSize={{ minRows: 2 }}
                    value={it.desc}
                    onChange={(e) => patchIt({ desc: e.target.value })}
                  />
                </div>
              )}
            />
          </div>
        )}
      />
    </EditorLayout>
  );
}
