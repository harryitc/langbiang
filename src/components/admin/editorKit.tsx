"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Card, Row, Col, Button, Tag, Space, Popconfirm, Empty } from "antd";
import { PlusOutlined, DeleteOutlined, UpOutlined, DownOutlined, ReloadOutlined } from "@ant-design/icons";
import { saveSectionDraftAction } from "@/lib/content/actions";
import type { SectionKey, SiteContent } from "@/lib/content/schema";

export type SaveState = "idle" | "saving" | "saved" | "error";

/**
 * Tự lưu nháp một phần nội dung (debounce). Bỏ qua lần render đầu.
 * Trả về trạng thái + số lần lưu (để bust cache iframe preview).
 */
export function useSectionAutosave<K extends SectionKey>(section: K, value: SiteContent[K]) {
  const [status, setStatus] = useState<SaveState>("idle");
  const [savedCount, setSavedCount] = useState(0);
  const skipFirst = useRef(true);

  useEffect(() => {
    if (skipFirst.current) {
      skipFirst.current = false;
      return;
    }
    setStatus("saving");
    const t = setTimeout(async () => {
      const res = await saveSectionDraftAction(section, value);
      if (res.ok) {
        setStatus("saved");
        setSavedCount((c) => c + 1);
      } else {
        setStatus("error");
      }
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return { status, savedCount };
}

export function SaveStatus({ status }: { status: SaveState }) {
  const map: Record<SaveState, { text: string; color: string }> = {
    idle: { text: "Sẵn sàng", color: "default" },
    saving: { text: "Đang lưu nháp…", color: "gold" },
    saved: { text: "Đã lưu nháp", color: "green" },
    error: { text: "Lưu lỗi", color: "red" },
  };
  const s = map[status];
  return <Tag color={s.color} style={{ marginInlineEnd: 0 }}>{s.text}</Tag>;
}

/** Nhãn nhỏ + control cho form (không cần antd Form context). */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label style={{ display: "block", marginBottom: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      {children}
      {hint && <div style={{ fontSize: 11, color: "#999", marginTop: 3 }}>{hint}</div>}
    </label>
  );
}

/**
 * Khung editor 2 cột: form bên trái, iframe xem trước (bản nháp) bên phải.
 * `previewPath` là trang public để soi (admin đang bật Draft Mode nên iframe hiện nháp).
 */
export function EditorLayout({
  title,
  description,
  status,
  savedCount = 0,
  previewPath,
  children,
}: {
  title: string;
  description?: string;
  status: SaveState;
  savedCount?: number;
  previewPath: string;
  children: ReactNode;
}) {
  const [manual, setManual] = useState(0);
  const src = `${previewPath}${previewPath.includes("?") ? "&" : "?"}v=${savedCount}-${manual}`;

  return (
    <Row gutter={16}>
      <Col xs={24} lg={13}>
        <Card
          size="small"
          title={<span style={{ fontWeight: 700 }}>{title}</span>}
          extra={<SaveStatus status={status} />}
        >
          {description && (
            <p style={{ marginTop: 0, color: "#666", fontSize: 12 }}>{description}</p>
          )}
          {children}
        </Card>
      </Col>
      <Col xs={24} lg={11}>
        <div style={{ position: "sticky", top: 68 }}>
          <Card
            size="small"
            title="Xem trước (bản nháp)"
            extra={
              <Space size={4}>
                <Button size="small" type="text" icon={<ReloadOutlined />} onClick={() => setManual((m) => m + 1)} />
                <a href={previewPath} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>
                  Mở ↗
                </a>
              </Space>
            }
            styles={{ body: { padding: 0 } }}
          >
            <iframe
              key={src}
              src={src}
              title="preview"
              style={{ width: "100%", height: "72vh", border: 0, borderRadius: 6 }}
            />
          </Card>
        </div>
      </Col>
    </Row>
  );
}

/**
 * Editor danh sách tổng quát: thêm/xoá/di chuyển item, render field tuỳ biến.
 */
export function ListEditor<T>({
  value,
  onChange,
  newItem,
  itemTitle,
  renderItem,
  addLabel = "Thêm mục",
}: {
  value: T[];
  onChange: (next: T[]) => void;
  newItem: () => T;
  itemTitle: (item: T, index: number) => string;
  renderItem: (item: T, patch: (p: Partial<T>) => void, index: number) => ReactNode;
  addLabel?: string;
}) {
  const patchAt = (i: number, p: Partial<T>) =>
    onChange(value.map((x, idx) => (idx === i ? { ...x, ...p } : x)));
  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div>
      {value.length === 0 && <Empty description="Chưa có mục nào" style={{ margin: "16px 0" }} />}
      <Space direction="vertical" size={10} style={{ width: "100%" }}>
        {value.map((item, i) => (
          <Card
            key={i}
            size="small"
            styles={{ body: { padding: 12 } }}
            title={<span style={{ fontSize: 13 }}>{itemTitle(item, i) || `Mục ${i + 1}`}</span>}
            extra={
              <Space size={2}>
                <Button size="small" type="text" icon={<UpOutlined />} disabled={i === 0} onClick={() => move(i, -1)} />
                <Button size="small" type="text" icon={<DownOutlined />} disabled={i === value.length - 1} onClick={() => move(i, 1)} />
                <Popconfirm title="Xoá mục này?" okText="Xoá" cancelText="Huỷ" onConfirm={() => removeAt(i)}>
                  <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            }
          >
            {renderItem(item, (p) => patchAt(i, p), i)}
          </Card>
        ))}
      </Space>
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        block
        style={{ marginTop: 10 }}
        onClick={() => onChange([newItem(), ...value])}
      >
        {addLabel}
      </Button>
    </div>
  );
}
