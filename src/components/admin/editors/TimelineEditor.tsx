"use client";

import { useMemo } from "react";
import { Alert, Input, Space, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
} from "../editorKit";
import { ItemListEditor } from "../itemList";
import type { TimelineDay, TimelineItem } from "@/lib/content/schema";

const { TextArea } = Input;

/* ------------------------------------------------------------------
   Kiểm tra trường bắt buộc (FR2: "Cần điền {tên trường}.")
   ------------------------------------------------------------------ */
const isBlank = (v: string | undefined) => !v || v.trim() === "";

/** Đếm số trường bắt buộc còn trống trong toàn bộ lịch trình. */
function countMissing(days: TimelineDay[]): number {
  let missing = 0;
  for (const d of days) {
    if (isBlank(d.day)) missing += 1;
    if (isBlank(d.date)) missing += 1;
    for (const it of d.items) {
      if (isBlank(it.time)) missing += 1;
      if (isBlank(it.title)) missing += 1;
    }
  }
  return missing;
}

/* ------------------------------------------------------------------
   Cấp 2 — các mốc trong một ngày
   ------------------------------------------------------------------ */
function ItemsEditor({
  value,
  onChange,
}: {
  value: TimelineItem[];
  onChange: (next: TimelineItem[]) => void;
}) {
  return (
    <ListEditor<TimelineItem>
      value={value}
      onChange={onChange}
      title="Các mốc trong ngày"
      addLabel="Thêm mốc thời gian"
      newItem={() => ({ time: "", title: "", desc: "" })}
      getSummary={(item) => [item.time, item.title].filter(Boolean).join(" — ") || "(chưa có mốc)"}
      renderItem={(item, update) => (
        <div className="grid gap-3 md:grid-cols-[140px_1fr]">
          <Field label="Giờ">
            <Input
              placeholder="05:30"
              value={item.time}
              status={isBlank(item.time) ? "error" : undefined}
              onChange={(e) => update({ ...item, time: e.target.value })}
            />
          </Field>
          <Space orientation="vertical" style={{ width: "100%" }} size={0}>
            <Field label="Tiêu đề">
              <Input
                placeholder="Tập trung & khởi hành"
                value={item.title}
                status={isBlank(item.title) ? "error" : undefined}
                onChange={(e) => update({ ...item, title: e.target.value })}
              />
            </Field>
            <Field label="Mô tả" hint="Không bắt buộc — mô tả ngắn cho mốc này.">
              <TextArea
                rows={2}
                placeholder="Đoàn xuất phát từ TP.HCM hướng về cao nguyên Langbiang."
                value={item.desc}
                onChange={(e) => update({ ...item, desc: e.target.value })}
              />
            </Field>
          </Space>
        </div>
      )}
    />
  );
}

/* ------------------------------------------------------------------
   Cấp 1 — các ngày của lịch trình (main.timeline)
   ------------------------------------------------------------------ */
export default function TimelineEditor({ initial }: { initial: TimelineDay[] }) {
  const { value, update, status } = useSectionAutosave<TimelineDay[]>(
    "main.timeline",
    initial
  );

  const missing = useMemo(() => countMissing(value), [value]);

  return (
    <EditorCard
      title="Lịch trình"
      extra={
        <Space size={8}>
          <Tag>{value.length} ngày</Tag>
          <SaveStatusTag status={status} />
        </Space>
      }
    >
      <p className="mb-3 text-sm opacity-60">
        Hiện ở mục &ldquo;Hành trình hai ngày một đêm&rdquo; trên{" "}
        <strong>trang Chương trình</strong>. Mỗi ngày là một cột, bên trong là
        các mốc giờ xếp từ sáng đến tối.
      </p>

      {missing > 0 ? (
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          title={`Còn ${missing} ô chưa điền.`}
          description="Mỗi ngày cần Nhãn ngày và Ngày; mỗi mốc cần Giờ và Tiêu đề."
        />
      ) : null}

      <ItemListEditor<TimelineDay>
        value={value}
        onChange={update}
        addLabel="Thêm ngày"
        drawerTitle="Ngày trong lịch trình"
        newItem={() => ({ day: "", date: "", items: [] })}
        getRow={(day) => ({
          title: day.day || "(chưa đặt nhãn ngày)",
          subtitle: day.date || undefined,
          tags: [{ text: `${day.items.length} mốc` }],
          invalid: isBlank(day.day) || isBlank(day.date),
        })}
        renderForm={(day, updateDay) => (
          <div className="rounded-lg border border-black/5 bg-black/[0.02] p-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Nhãn ngày" hint="Chữ hiện ở đầu cột, vd Ngày 1.">
                <Input
                  placeholder="Ngày 1"
                  value={day.day}
                  status={isBlank(day.day) ? "error" : undefined}
                  onChange={(e) => updateDay({ ...day, day: e.target.value })}
                />
              </Field>
              <Field
                label="Ngày"
                hint="Gõ theo dạng ngày/tháng/năm, vd 26/09/2026. Nhớ đổi năm khi sang mùa mới."
              >
                <Input
                  placeholder="26/09/2026"
                  value={day.date}
                  status={isBlank(day.date) ? "error" : undefined}
                  onChange={(e) => updateDay({ ...day, date: e.target.value })}
                />
              </Field>
            </div>

            <ItemsEditor
              value={day.items}
              onChange={(items) => updateDay({ ...day, items })}
            />
          </div>
        )}
      />
    </EditorCard>
  );
}
