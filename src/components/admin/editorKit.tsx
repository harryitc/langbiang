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
  Modal,
  Popconfirm,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import type { InputProps } from "antd";
import {
  ExportOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { saveDraftAction } from "@/lib/content/actions";
import { uploadImage } from "@/lib/content/upload-client";
import { addMediaAction } from "@/lib/content/media-actions";
import MediaBrowser from "./MediaBrowser";
import { SortableList } from "./itemList";

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
 * @param path  đường dẫn nội dung, vd 'main.gallery', 'currentYear', 'news'
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
  if (status === "saved") return <Tag color="success">Đã lưu nháp</Tag>;
  if (status === "error")
    return <Tag color="error">Chưa lưu được — kiểm tra mạng rồi sửa lại</Tag>;
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
   LinkInput — ô nhập liên kết kèm nút mở thử ở tab mới
   ------------------------------------------------------------------ */

/**
 * Liên kết tuỳ chọn: bỏ trống vẫn hợp lệ, nhưng đã nhập thì phải là URL
 * http/https tuyệt đối. (Dùng chung cho các ô nhập link trong khu quản trị.)
 */
export function isValidUrl(url: string): boolean {
  if (!url.trim()) return true; // bỏ trống là hợp lệ (trường tuỳ chọn)
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Đổi nội dung người dùng gõ thành địa chỉ có thể mở được ở tab mới.
 * Trả về `null` nếu chưa mở thử được (ô trống, gõ thiếu https://, hoặc chỉ là
 * dấu neo trong trang như "#gioi-thieu").
 * Riêng ô email: gõ "ten@gmail.com" sẽ mở trình soạn thư (mailto:).
 */
export function toOpenableHref(raw: string): string | null {
  const value = (raw ?? "").trim();
  if (!value) return null;
  if (/^mailto:\S+@\S+/i.test(value)) return value;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${value}`;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

export type LinkInputProps = Omit<InputProps, "suffix">;

/**
 * Ô nhập liên kết: giống <Input> bình thường (giữ nguyên value/onChange/
 * placeholder/status…), chỉ thêm nút mở liên kết ở cuối ô.
 * Nút chỉ sáng khi liên kết mở được; ngược lại mờ đi kèm lời nhắc ngắn.
 */
export function LinkInput(props: LinkInputProps) {
  const raw = typeof props.value === "string" ? props.value : "";
  const href = toOpenableHref(raw);
  const laEmail = href?.toLowerCase().startsWith("mailto:") ?? false;

  const loiNhac = href
    ? laEmail
      ? "Mở trình soạn thư gửi tới địa chỉ này"
      : "Mở liên kết ở tab mới"
    : raw.trim()
      ? "Chưa mở thử được — liên kết cần bắt đầu bằng https://"
      : "Dán liên kết vào ô này rồi bấm để mở thử";

  return (
    <Input
      {...props}
      suffix={
        <Tooltip title={loiNhac}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={loiNhac}
              className="cursor-pointer"
              style={{ display: "inline-flex", color: "inherit", opacity: 0.75 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ExportOutlined />
            </a>
          ) : (
            <span
              aria-disabled
              aria-label={loiNhac}
              style={{
                display: "inline-flex",
                opacity: 0.3,
                cursor: "not-allowed",
              }}
            >
              <ExportOutlined />
            </span>
          )}
        </Tooltip>
      }
    />
  );
}

/* ------------------------------------------------------------------
   ListEditor — giữ nguyên API cũ, nay chạy trên SortableList (kéo thả)
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
  /** Dòng tóm tắt khi mục đang thu gọn. */
  getSummary?: (item: T, index: number) => ReactNode;
};

export function ListEditor<T>(props: ListEditorProps<T>) {
  return <SortableList<T> {...props} />;
}

/* ------------------------------------------------------------------
   ImageField — chọn ảnh từ KHO ẢNH tập trung (hoặc dán URL ngoài)
   ------------------------------------------------------------------ */
/** Tên tệp lấy từ đường dẫn ảnh (để biết đang dùng ảnh nào). */
function fileNameFromUrl(url: string): string {
  const clean = url.split("?")[0];
  return decodeURIComponent(clean.substring(clean.lastIndexOf("/") + 1)) || url;
}

export function ImageField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
  /** Giữ để tương thích call-site cũ; ảnh nay đi qua kho ảnh chung. */
  folder?: string;
}) {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [broken, setBroken] = useState(false);

  /** Kéo ảnh từ máy thả vào -> tải lên kho rồi gán luôn. */
  async function handleDrop(file: File) {
    if (!file.type.startsWith("image/")) {
      message.error("Tệp này không phải ảnh. Hãy thả tệp ảnh (jpg, png, webp…).");
      return;
    }
    setUploading(true);
    try {
      const url = await uploadImage(file, "kho");
      await addMediaAction({ url, name: file.name, albumId: "alb-khac" }).catch(
        () => {}
      );
      setBroken(false);
      onChange(url);
      message.success("Đã tải ảnh lên kho và dùng cho mục này.");
    } catch (err) {
      message.error(
        err instanceof Error
          ? err.message
          : "Tải ảnh lên không thành công. Thử lại hoặc chọn từ kho ảnh."
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div
        // Kéo ảnh từ máy thả thẳng vào khung này.
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void handleDrop(f);
        }}
        // Không ép khung: ảnh giữ đúng tỉ lệ gốc, chỉ giới hạn chiều cao 96px
        // như bản đầu. Khung trống mới cần kích thước cố định cho dòng gợi ý.
        className={`relative inline-block h-24 overflow-hidden rounded-lg border-2 border-dashed align-top transition ${
          value ? "" : "w-44"
        } ${
          dragging
            ? "border-[#2e7d32] bg-[#2e7d32]/[0.06]"
            : value
            ? "border-transparent"
            : "border-black/15 hover:border-black/30"
        }`}
      >
        {value ? (
          <div className="relative h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt="Xem trước"
              onError={() => setBroken(true)}
              onLoad={() => setBroken(false)}
              className="h-full w-auto max-w-[280px] object-contain"
            />
            {broken ? (
              <div className="absolute inset-0 flex items-center justify-center bg-red-50/90 px-3 text-center text-xs text-red-600">
                Không tải được ảnh — đường dẫn có thể đã hỏng.
              </div>
            ) : null}
          </div>
        ) : (
          <button
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 px-2 text-center"
            onClick={() => setOpen(true)}
          >
            {uploading ? (
              <Spin />
            ) : (
              <>
                <PictureOutlined className="text-xl opacity-40" />
                <span className="text-[11px] leading-tight opacity-60">
                  Kéo ảnh vào đây
                  <br />
                  hoặc bấm để chọn từ kho
                </span>
              </>
            )}
          </button>
        )}
      </div>

      {value ? (
        <div className="mt-1.5 max-w-[220px]">
          <div className="truncate text-xs opacity-60" title={value}>
            {fileNameFromUrl(value)}
          </div>
          <div className="mt-1 flex items-center gap-1">
            <Button
              size="small"
              className="cursor-pointer"
              icon={<PictureOutlined />}
              loading={uploading}
              onClick={() => setOpen(true)}
            >
              Đổi ảnh
            </Button>
            <Popconfirm
              title="Bỏ ảnh khỏi mục này?"
              description="Ảnh vẫn còn trong kho, có thể chọn lại sau."
              okText="Bỏ ảnh"
              cancelText="Huỷ"
              onConfirm={() => {
                setBroken(false);
                onChange("");
              }}
            >
              <Button size="small" type="text" danger className="cursor-pointer">
                Bỏ ảnh
              </Button>
            </Popconfirm>
          </div>
        </div>
      ) : (
        <Button
          type="text"
          size="small"
          className="mt-1 cursor-pointer"
          onClick={() => setUrlMode((v) => !v)}
        >
          Dán đường dẫn ảnh
        </Button>
      )}

      {urlMode && !value ? (
        <LinkInput
          className="mt-1 max-w-[260px]"
          placeholder="Dán đường dẫn ảnh, ví dụ https://…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : null}

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        width={920}
        footer={null}
        destroyOnHidden
        title="Chọn ảnh từ kho"
      >
        <MediaBrowser
          mode="pick"
          onPick={(url) => {
            setBroken(false);
            onChange(url);
            setOpen(false);
          }}
        />
      </Modal>
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

// Lưu ý: HTML rich text được sanitize authoritative ở phía server khi render
// (sanitizeHtml trong src/lib/content/html.ts, dùng ở tin-tuc/[id] & RetroSummary),
// nên không cần strip lặp lại mỗi lần gõ ở client.
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
      <RichTextClient value={value} onChange={onChange} folder={folder} />
    </div>
  );
}
