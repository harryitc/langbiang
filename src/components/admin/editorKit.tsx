"use client";

// Bộ công cụ dựng editor cho Admin CMS: autosave, danh sách, trường ảnh, rich text.
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import {
  App,
  Button,
  Card,
  Input,
  List,
  Popconfirm,
  Segmented,
  Space,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { saveDraftAction } from "@/lib/content/actions";
import { uploadImage } from "@/lib/content/upload-client";

/* ------------------------------------------------------------------
   Autosave theo nhánh nội dung (debounce 700ms)
   ------------------------------------------------------------------ */
export type SaveStatus = "idle" | "saving" | "saved" | "error";

export type SectionAutosave<T> = {
  value: T;
  update: (next: T) => void;
  status: SaveStatus;
};

/**
 * Quản lý state + tự lưu nháp cho một nhánh nội dung.
 * @param path  đường dẫn nội dung, vd 'main.stats', 'currentYear', 'news'
 * @param initial  giá trị khởi tạo (đọc từ draft ở server)
 */
export function useSectionAutosave<T>(
  path: string,
  initial: T
): SectionAutosave<T> {
  const [value, setValue] = useState<T>(initial);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firstRender = useRef(true);

  const update = useCallback((next: T) => {
    setValue(next);
  }, []);

  useEffect(() => {
    // Bỏ qua lần render đầu (không lưu ngay khi mở trang).
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      try {
        const res = await saveDraftAction(path, value);
        setStatus(res.ok ? "saved" : "error");
      } catch {
        setStatus("error");
      }
    }, 700);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, path]);

  return { value, update, status };
}

/** Nhãn trạng thái lưu nháp. */
export function SaveStatusTag({ status }: { status: SaveStatus }) {
  if (status === "saving")
    return (
      <Tag color="processing">
        <Spin size="small" /> Đang lưu…
      </Tag>
    );
  if (status === "saved") return <Tag color="success">Đã lưu</Tag>;
  if (status === "error") return <Tag color="error">Lưu thất bại</Tag>;
  return <Tag>Chưa có thay đổi</Tag>;
}

/* ------------------------------------------------------------------
   Bố cục cơ bản
   ------------------------------------------------------------------ */
export function EditorCard({
  title,
  extra,
  children,
}: {
  title?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card title={title} extra={extra} style={{ marginBottom: 16 }}>
      {children}
    </Card>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: ReactNode;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ marginBottom: 4, fontWeight: 600, fontSize: 13 }}>
        {label}
      </div>
      {children}
      {hint ? (
        <div style={{ marginTop: 4, fontSize: 12, opacity: 0.6 }}>{hint}</div>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------
   ListEditor — thêm / xoá / sắp xếp phần tử danh sách
   ------------------------------------------------------------------ */
export type ListEditorProps<T> = {
  value: T[];
  onChange: (next: T[]) => void;
  /** Render 1 phần tử; `update(next)` thay thế phần tử tại vị trí đó. */
  renderItem: (item: T, update: (next: T) => void, index: number) => ReactNode;
  /** Tạo phần tử mới khi bấm "Thêm". */
  newItem: () => T;
  title?: ReactNode;
  addLabel?: string;
};

export function ListEditor<T>({
  value,
  onChange,
  renderItem,
  newItem,
  title,
  addLabel = "Thêm mục",
}: ListEditorProps<T>) {
  const replaceAt = (index: number, next: T) => {
    const arr = value.slice();
    arr[index] = next;
    onChange(arr);
  };
  const removeAt = (index: number) => {
    const arr = value.slice();
    arr.splice(index, 1);
    onChange(arr);
  };
  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= value.length) return;
    const arr = value.slice();
    [arr[index], arr[target]] = [arr[target], arr[index]];
    onChange(arr);
  };
  const add = () => onChange([...value, newItem()]);

  return (
    <div>
      <List
        header={
          title ? <strong>{title}</strong> : undefined
        }
        locale={{ emptyText: "Chưa có mục nào" }}
        dataSource={value}
        renderItem={(item, index) => (
          <List.Item
            key={index}
            actions={[
              <Tooltip title="Lên" key="up">
                <Button
                  size="small"
                  icon={<ArrowUpOutlined />}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                />
              </Tooltip>,
              <Tooltip title="Xuống" key="down">
                <Button
                  size="small"
                  icon={<ArrowDownOutlined />}
                  disabled={index === value.length - 1}
                  onClick={() => move(index, 1)}
                />
              </Tooltip>,
              <Popconfirm
                key="del"
                title="Xoá mục này?"
                okText="Xoá"
                cancelText="Huỷ"
                onConfirm={() => removeAt(index)}
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>,
            ]}
          >
            <div style={{ width: "100%" }}>
              {renderItem(item, (next) => replaceAt(index, next), index)}
            </div>
          </List.Item>
        )}
      />
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={add}
        style={{ marginTop: 12 }}
        block
      >
        {addLabel}
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------------
   ImageField — tải ảnh lên (Vercel Blob) hoặc dán URL
   ------------------------------------------------------------------ */
export function ImageField({
  value,
  onChange,
  folder = "uploads",
}: {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}) {
  const { message } = App.useApp();
  const [mode, setMode] = useState<"upload" | "url">("url");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      message.error("Tệp không phải ảnh hợp lệ.");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file, folder);
      onChange(url);
      message.success("Đã tải ảnh lên.");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Tải ảnh thất bại.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Space direction="vertical" style={{ width: "100%" }} size={8}>
        <Segmented
          size="small"
          value={mode}
          onChange={(v) => setMode(v as "upload" | "url")}
          options={[
            { label: "Dán URL", value: "url" },
            { label: "Tải lên", value: "upload" },
          ]}
        />
        {mode === "url" ? (
          <Input
            placeholder="https://… hoặc /gallery/anh.jpg"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <div>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
                e.target.value = "";
              }}
            />
            <Button
              icon={<UploadOutlined />}
              loading={uploading}
              onClick={() => inputRef.current?.click()}
            >
              Chọn ảnh từ máy
            </Button>
          </div>
        )}
        {value ? (
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Xem trước"
              style={{
                maxHeight: 96,
                maxWidth: "100%",
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            />
            <div>
              <Button
                size="small"
                type="link"
                danger
                onClick={() => onChange("")}
              >
                Xoá ảnh
              </Button>
            </div>
          </div>
        ) : null}
      </Space>
    </div>
  );
}

/* ------------------------------------------------------------------
   RichText — bọc CKEditor (dynamic, ssr:false)
   ------------------------------------------------------------------ */
const RichTextClient = dynamic(() => import("./RichTextClient"), {
  ssr: false,
  loading: () => <Spin />,
});

/** Loại bỏ thẻ script cơ bản trước khi lưu (sanitize nhẹ). */
function stripScripts(html: string): string {
  return html.replace(/<script[\s\S]*?<\/script>/gi, "");
}

export function RichText({
  value,
  onChange,
  folder = "content",
}: {
  value: string;
  onChange: (html: string) => void;
  folder?: string;
}) {
  return (
    <div className="tsl-richtext">
      <RichTextClient
        value={value}
        onChange={(html) => onChange(stripScripts(html))}
        folder={folder}
      />
    </div>
  );
}
