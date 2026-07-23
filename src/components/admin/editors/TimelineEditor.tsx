"use client";

import { useMemo } from "react";
import { Alert, Button, Input, Space, Tag } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
  ImageField,
} from "../editorKit";
import { ItemListEditor } from "../itemList";
import type { TimelineDay, TimelineItem, TimelinePhoto } from "@/lib/content/schema";

const { TextArea } = Input;

/* ------------------------------------------------------------------
   Kiểm tra trường bắt buộc
   ------------------------------------------------------------------ */
const isBlank = (v: string | undefined) => !v || v.trim() === "";

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
   Editor nhiều ảnh — mỗi ảnh có url + note
   ------------------------------------------------------------------ */
function ImagesEditor({
  value,
  onChange,
}: {
  value: TimelinePhoto[];
  onChange: (next: TimelinePhoto[]) => void;
}) {
  const images = value ?? [];

  function update(idx: number, patch: Partial<TimelinePhoto>) {
    const next = images.map((img, i) => (i === idx ? { ...img, ...patch } : img));
    onChange(next);
  }

  function remove(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  function add() {
    onChange([...images, { url: "", note: "" }]);
  }

  return (
    <Field
      label="Ảnh Polaroid (nhiều ảnh)"
      hint="Tối đa 3 ảnh hiển thị chồng nhau và xoè ra khi hover. Nên dùng tỉ lệ 4:3 hoặc 1:1."
    >
      <div className="flex flex-wrap gap-5 items-start">
        {images.map((photo, i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-lg border border-black/5 bg-black/[0.015] p-3">
            <div className="text-xs font-semibold opacity-50 mb-1">Ảnh #{i + 1}</div>
            <ImageField
              value={photo.url}
              onChange={(newUrl) => update(i, { url: newUrl })}
            />
            <Input
              size="small"
              placeholder="Chú thích hiển thị dưới ảnh, vd: “Khởi hành từ TP.HCM 🚌”"
              value={photo.note}
              onChange={(e) => update(i, { note: e.target.value })}
            />
            <Button
              size="small"
              type="text"
              danger
              icon={<DeleteOutlined />}
              className="cursor-pointer"
              onClick={() => remove(i)}
            >
              Xóa ảnh #{i + 1}
            </Button>
          </div>
        ))}
        {images.length < 3 && (
          <Button
            size="small"
            icon={<PlusOutlined />}
            className="cursor-pointer mt-1"
            onClick={add}
          >
            Thêm ảnh
          </Button>
        )}
      </div>
      {images.length === 0 && (
        <p className="mt-2 text-xs text-gray-400">Chưa có ảnh — nhấn “Thêm ảnh” để bắt đầu.</p>
      )}
    </Field>
  );
}

/* ------------------------------------------------------------------
   Editor các mốc trong ngày
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
      getSummary={(item) =>
        [item.time, item.title].filter(Boolean).join(" — ") || "(chưa có mốc)"
      }
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
            <Field
              label="Mô tả"
              hint="Không bắt buộc — mô tả ngắn hiển thị dưới tiêu đề mốc này."
            >
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
   Editor chính — danh sách ngày (main.timeline)
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
        <strong>trang Chương trình</strong>. Ngày đầu tiên sẽ có ghim &quot;Khởi
        hành&quot;, ngày cuối có dấu kết thúc. Các ngày giữa xen kẽ trái/phải với
        cụm ảnh Polaroid.
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
        newItem={() => ({ day: "", date: "", items: [], images: [] })}
        getRow={(day, idx) => ({
          title: day.day || "(chưa đặt nhãn ngày)",
          subtitle: day.date || undefined,
          tags: [
            {
              text:
                idx === 0
                  ? "📌 Khởi hành"
                  : idx === value.length - 1
                  ? "🔵 Kết thúc"
                  : `Ngày ${idx + 1}`,
              color: idx === 0 ? "red" : idx === value.length - 1 ? "blue" : undefined,
            },
            { text: `${day.items.length} mốc` },
            {
              text: `${(day.images ?? []).length} ảnh`,
              color: (day.images ?? []).length > 0 ? "green" : undefined,
            },
          ],
          invalid: isBlank(day.day) || isBlank(day.date),
        })}
        renderForm={(day, updateDay) => (
          <div className="rounded-lg border border-black/5 bg-black/[0.02] p-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Nhãn ngày" hint="Vd: Ngày 1, Ngày 0, Khởi hành…">
                <Input
                  placeholder="Ngày 1"
                  value={day.day}
                  status={isBlank(day.day) ? "error" : undefined}
                  onChange={(e) => updateDay({ ...day, day: e.target.value })}
                />
              </Field>
              <Field
                label="Ngày"
                hint="Dạng ngày/tháng/năm, vd 26/09/2026."
              >
                <Input
                  placeholder="26/09/2026"
                  value={day.date}
                  status={isBlank(day.date) ? "error" : undefined}
                  onChange={(e) => updateDay({ ...day, date: e.target.value })}
                />
              </Field>
            </div>

            <ImagesEditor
              value={day.images ?? []}
              onChange={(imgs) => updateDay({ ...day, images: imgs })}
            />

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
