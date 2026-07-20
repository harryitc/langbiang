"use client";

// Trình duyệt kho ảnh dạng album — dùng chung cho:
//  - Trang quản lý kho ảnh (mode="manage"): tạo/sửa/xoá album, xoá/di chuyển ảnh.
//  - Bộ chọn ảnh trong ImageField (mode="pick"): duyệt theo album rồi chọn.
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  App,
  Button,
  Empty,
  Image as AntdImage,
  Input,
  Popconfirm,
  Select,
  Spin,
  Tag,
} from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  FolderAddOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { uploadImage } from "@/lib/content/upload-client";
import {
  addMediaAction,
  deleteMediaAction,
  moveMediaAction,
  createAlbumAction,
  renameAlbumAction,
  deleteAlbumAction,
} from "@/lib/content/media-actions";
import { loadMediaLibrary } from "@/lib/content/media-cache";
import type { MediaItem, MediaLibrary } from "@/lib/content/media";

const ALL = "all";
const MISC_ALBUM_ID = "alb-khac";
/** Số ảnh render mỗi lô (phân trang lưới, tránh dựng hàng trăm node cùng lúc). */
const PAGE_SIZE = 48;

/** URL tối ưu được bằng next/image (ảnh /public hoặc Vercel Blob public). */
function canOptimize(url: string): boolean {
  return url.startsWith("/") || url.includes(".public.blob.vercel-storage.com");
}

export default function MediaBrowser({
  mode,
  onPick,
}: {
  mode: "manage" | "pick";
  onPick?: (url: string) => void;
}) {
  const { message, modal } = App.useApp();
  const [lib, setLib] = useState<MediaLibrary | null>(null);
  const [albumId, setAlbumId] = useState<string>(ALL);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function refetch(force = false) {
    const data = await loadMediaLibrary(force);
    if (data) setLib(data);
    else message.error("Không tải được kho ảnh.");
  }
  useEffect(() => {
    void refetch();
  }, []);

  // Đổi album / từ khoá → xem lại từ lô đầu.
  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [albumId, query]);

  const albums = lib?.albums ?? [];
  const items = lib?.items ?? [];

  const countByAlbum = useMemo(() => {
    const m = new Map<string, number>();
    for (const it of items) m.set(it.albumId, (m.get(it.albumId) ?? 0) + 1);
    return m;
  }, [items]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(
      (it) =>
        (albumId === ALL || it.albumId === albumId) &&
        (!q || it.name.toLowerCase().includes(q))
    );
  }, [items, albumId, query]);

  const selectedItem = items.find((i) => i.id === selected) ?? null;

  /* ----------------------------- Upload ----------------------------- */
  async function handleFiles(files: FileList) {
    const targetAlbum = albumId === ALL ? MISC_ALBUM_ID : albumId;
    setUploading(true);
    let lastUrl = "";
    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) continue;
        const url = await uploadImage(file, "kho");
        const res = await addMediaAction({
          url,
          name: file.name,
          albumId: targetAlbum,
        });
        if (res.ok) lastUrl = url;
        else message.error(res.error || "Không thêm được ảnh vào kho.");
      }
      await refetch(true);
      if (lastUrl) message.success("Đã tải ảnh lên kho.");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Tải ảnh thất bại.");
    } finally {
      setUploading(false);
    }
  }

  /* --------------------------- Album ops ---------------------------- */
  async function run(action: Promise<{ ok: boolean; error?: string }>, okMsg?: string) {
    setBusy(true);
    try {
      const res = await action;
      if (res.ok) {
        await refetch(true);
        if (okMsg) message.success(okMsg);
      } else {
        message.error(res.error || "Thao tác thất bại.");
      }
    } finally {
      setBusy(false);
    }
  }

  function promptAlbumName(title: string, initial: string, onOk: (name: string) => void) {
    let name = initial;
    modal.confirm({
      title,
      content: (
        <Input
          defaultValue={initial}
          placeholder="Tên album"
          onChange={(e) => (name = e.target.value)}
        />
      ),
      okText: "Lưu",
      cancelText: "Huỷ",
      onOk: () => onOk(name),
    });
  }

  /* ----------------------------- Render ----------------------------- */
  if (!lib) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spin />
      </div>
    );
  }

  const canManage = mode === "manage";

  return (
    <div className="flex min-h-[420px] flex-col gap-3 md:flex-row">
      {/* Cột album */}
      <div className="md:w-56 md:shrink-0">
        <div className="mb-2 flex items-center justify-between">
          <strong className="text-sm">Album</strong>
          {canManage ? (
            <Button
              size="small"
              type="text"
              icon={<FolderAddOutlined />}
              onClick={() =>
                promptAlbumName("Tạo album mới", "", (n) =>
                  run(createAlbumAction(n), "Đã tạo album.")
                )
              }
            >
              Tạo
            </Button>
          ) : null}
        </div>
        <div className="flex flex-row gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          <AlbumButton
            active={albumId === ALL}
            label="Tất cả"
            count={items.length}
            onClick={() => setAlbumId(ALL)}
          />
          {albums.map((a) => (
            <AlbumButton
              key={a.id}
              active={albumId === a.id}
              label={a.name}
              count={countByAlbum.get(a.id) ?? 0}
              system={a.system}
              manage={canManage}
              onClick={() => setAlbumId(a.id)}
              onRename={() =>
                promptAlbumName("Đổi tên album", a.name, (n) =>
                  run(renameAlbumAction(a.id, n), "Đã đổi tên.")
                )
              }
              onDelete={() => run(deleteAlbumAction(a.id), "Đã xoá album.")}
            />
          ))}
        </div>
      </div>

      {/* Khu vực ảnh */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Input.Search
            allowClear
            placeholder="Tìm theo tên ảnh…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 260 }}
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            style={{ display: "none" }}
            onChange={(e) => {
              if (e.target.files?.length) void handleFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button
            type="primary"
            icon={<UploadOutlined />}
            loading={uploading}
            onClick={() => inputRef.current?.click()}
          >
            Tải ảnh lên
            {albumId !== ALL
              ? ` (${albums.find((a) => a.id === albumId)?.name})`
              : ""}
          </Button>
          <span className="text-xs opacity-60">{visible.length} ảnh</span>
        </div>

        {/* Thanh thao tác cho ảnh đang chọn */}
        {selectedItem ? (
          <div className="flex flex-wrap items-center gap-2 rounded-lg bg-black/[0.03] p-2">
            <span className="max-w-[200px] truncate text-xs font-medium">
              {selectedItem.name}
            </span>
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={() => {
                void navigator.clipboard?.writeText(selectedItem.url);
                message.success("Đã sao chép đường dẫn.");
              }}
            >
              Sao chép URL
            </Button>
            {canManage ? (
              <>
                <Select
                  size="small"
                  value={selectedItem.albumId}
                  style={{ minWidth: 160 }}
                  onChange={(v) =>
                    run(moveMediaAction(selectedItem.id, v), "Đã chuyển album.")
                  }
                  options={albums.map((a) => ({ value: a.id, label: a.name }))}
                />
                <Popconfirm
                  title="Xoá ảnh này?"
                  description={
                    selectedItem.seeded
                      ? "Ảnh nạp sẵn: chỉ gỡ khỏi kho."
                      : "Xoá khỏi kho và xoá luôn file trên lưu trữ."
                  }
                  okText="Xoá"
                  cancelText="Huỷ"
                  onConfirm={() =>
                    run(deleteMediaAction(selectedItem.id), "Đã xoá ảnh.").then(
                      () => setSelected(null)
                    )
                  }
                >
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    Xoá
                  </Button>
                </Popconfirm>
              </>
            ) : null}
            {mode === "pick" ? (
              <Button
                size="small"
                type="primary"
                onClick={() => onPick?.(selectedItem.url)}
              >
                Chọn ảnh này
              </Button>
            ) : null}
          </div>
        ) : null}

        {/* Lưới ảnh */}
        <Spin spinning={busy}>
          {visible.length === 0 ? (
            <Empty description="Chưa có ảnh trong album này" />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {visible.slice(0, limit).map((it, idx) => (
                  <Thumb
                    key={it.id}
                    item={it}
                    active={selected === it.id}
                    onClick={() => setSelected(it.id)}
                    onDoubleClick={
                      mode === "pick" ? () => onPick?.(it.url) : undefined
                    }
                    onPreview={() => {
                      setPreviewIndex(idx);
                      setPreviewOpen(true);
                    }}
                  />
                ))}
              </div>

              {/* Lightbox xem chi tiết + duyệt qua lại (ảnh trong lô đang hiện). */}
              <AntdImage.PreviewGroup
                items={visible.slice(0, limit).map((it) => it.url)}
                preview={{
                  visible: previewOpen,
                  current: previewIndex,
                  onVisibleChange: (v) => setPreviewOpen(v),
                  onChange: (c) => setPreviewIndex(c),
                }}
              />

              {visible.length > limit ? (
                <div className="mt-3 text-center">
                  <Button onClick={() => setLimit((n) => n + PAGE_SIZE)}>
                    Xem thêm ({visible.length - limit} ảnh)
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </Spin>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
function AlbumButton({
  active,
  label,
  count,
  system,
  manage,
  onClick,
  onRename,
  onDelete,
}: {
  active: boolean;
  label: string;
  count: number;
  system?: boolean;
  manage?: boolean;
  onClick: () => void;
  onRename?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className={`group flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm md:shrink ${
        active ? "bg-[#2e7d32]/12 font-semibold text-[#2e7d32]" : "hover:bg-black/[0.04]"
      }`}
    >
      <button className="flex flex-1 cursor-pointer items-center gap-2 text-left" onClick={onClick}>
        <span className="truncate">{label}</span>
        <Tag className="ml-auto" bordered={false}>
          {count}
        </Tag>
      </button>
      {manage && !system ? (
        <span className="hidden gap-0.5 group-hover:flex">
          <EditOutlined className="cursor-pointer opacity-60" onClick={onRename} />
          <Popconfirm
            title="Xoá album?"
            description="Ảnh trong album sẽ dồn về “Khác”."
            okText="Xoá"
            cancelText="Huỷ"
            onConfirm={onDelete}
          >
            <DeleteOutlined className="cursor-pointer opacity-60 hover:text-red-500" />
          </Popconfirm>
        </span>
      ) : null}
    </div>
  );
}

function Thumb({
  item,
  active,
  onClick,
  onDoubleClick,
  onPreview,
}: {
  item: MediaItem;
  active: boolean;
  onClick: () => void;
  onDoubleClick?: () => void;
  onPreview: () => void;
}) {
  return (
    <button
      className={`group relative aspect-square cursor-pointer overflow-hidden rounded-lg border-2 transition ${
        active ? "border-[#2e7d32]" : "border-transparent hover:border-black/20"
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={item.name}
    >
      {/* Nút ＋ ở góc phải — xem ảnh chi tiết trong lightbox. */}
      <span
        role="button"
        aria-label="Xem ảnh chi tiết"
        className="absolute right-1 top-1 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition hover:bg-black/80 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
      >
        <PlusOutlined style={{ fontSize: 11 }} />
      </span>
      {canOptimize(item.url) ? (
        // next/image tự phục vụ ảnh thu nhỏ (giảm băng thông so với ảnh gốc).
        <Image
          src={item.url}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 25vw, 140px"
          className="object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.url}
          alt={item.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      )}
    </button>
  );
}
