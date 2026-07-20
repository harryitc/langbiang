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
  Tooltip,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExpandOutlined,
  FolderAddOutlined,
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
/** Nút biểu tượng trong bảng thao tác: ô vuông đều nhau để hàng nút thẳng hàng. */
const ICON_BTN = "flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center !px-0";
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
    else
      message.error(
        "Không mở được kho ảnh. Kiểm tra kết nối mạng rồi tải lại trang."
      );
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
        else
          message.error(
            res.error ||
              `Không thêm được ảnh “${file.name}” vào kho. Thử tải lại ảnh này.`
          );
      }
      await refetch(true);
      if (lastUrl) message.success("Đã tải ảnh lên kho.");
    } catch (err) {
      message.error(
        err instanceof Error
          ? err.message
          : "Tải ảnh lên không thành công. Kiểm tra kết nối mạng rồi thử lại."
      );
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
        message.error(res.error || "Chưa thực hiện được. Vui lòng thử lại.");
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

        {/* Lưới ảnh */}
        <Spin spinning={busy}>
          {visible.length === 0 ? (
            <Empty description="Chưa có ảnh nào ở đây. Bấm “Tải ảnh lên” để thêm." />
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
                {visible.slice(0, limit).map((it, idx) => (
                  // relative để bảng thao tác neo tuyệt đối ngay dưới ảnh.
                  <div key={it.id} className="relative">
                    <Thumb
                      item={it}
                      active={selected === it.id}
                      onClick={() =>
                        setSelected((cur) => (cur === it.id ? null : it.id))
                      }
                      onDoubleClick={
                        mode === "pick" ? () => onPick?.(it.url) : undefined
                      }
                      onPreview={() => {
                        setPreviewIndex(idx);
                        setPreviewOpen(true);
                      }}
                    />

                    {/* Bảng thao tác gọn, nổi ngay dưới ảnh đang chọn — khỏi
                        phải cuộn lên thanh công cụ. */}
                    {selected === it.id ? (
                      <div className="absolute left-1/2 top-full z-30 mt-2 w-60 -translate-x-1/2 rounded-xl border border-[#2e7d32]/30 bg-white p-2.5 shadow-lg">
                        <div
                          className="truncate text-xs font-medium leading-5"
                          title={it.name}
                        >
                          {it.name}
                        </div>
                        {/* Ở chế độ quản lý đã có ô chọn album bên dưới nên
                            không lặp lại tên album ở đây. */}
                        {!canManage ? (
                          <div className="truncate text-[11px] leading-4 opacity-60">
                            {albums.find((a) => a.id === it.albumId)?.name ?? "Khác"}
                          </div>
                        ) : null}

                        {/* Hàng nút — kẻ mảnh tách khỏi phần tên cho đỡ dồn cục. */}
                        <div className="mt-2 flex items-center justify-end gap-1 border-t border-black/5 pt-2">
                          {mode === "pick" ? (
                            <Button
                              size="small"
                              type="primary"
                              className="!h-7 flex-1 cursor-pointer"
                              icon={<CheckOutlined />}
                              onClick={() => onPick?.(it.url)}
                            >
                              Chọn
                            </Button>
                          ) : null}
                          {/* Nhóm nút biểu tượng luôn dồn về phải, cách đều nhau. */}
                          <Tooltip title="Sao chép đường dẫn ảnh">
                            <Button
                              size="small"
                              type="text"
                              className={ICON_BTN}
                              icon={<CopyOutlined />}
                              onClick={() => {
                                void navigator.clipboard?.writeText(it.url);
                                message.success("Đã sao chép đường dẫn.");
                              }}
                            />
                          </Tooltip>
                          {canManage ? (
                            <Popconfirm
                              title="Xoá ảnh này?"
                              description={
                                it.seeded
                                  ? "Ảnh có sẵn của dự án — chỉ gỡ khỏi kho, ảnh gốc vẫn còn."
                                  : "Ảnh sẽ mất hẳn. Chỗ nào đang dùng ảnh này sẽ bị trống."
                              }
                              okText="Xoá"
                              cancelText="Huỷ"
                              onConfirm={() =>
                                run(deleteMediaAction(it.id), "Đã xoá ảnh.").then(
                                  () => setSelected(null)
                                )
                              }
                            >
                              <Tooltip title="Xoá ảnh khỏi kho">
                                {/* type="text" + danger: vẫn đỏ để nhận ra là
                                    hành động nguy hiểm nhưng không lấn át. */}
                                <Button
                                  size="small"
                                  type="text"
                                  danger
                                  className={ICON_BTN}
                                  icon={<DeleteOutlined />}
                                />
                              </Tooltip>
                            </Popconfirm>
                          ) : null}
                          <Tooltip title="Đóng">
                            <Button
                              size="small"
                              type="text"
                              className={ICON_BTN}
                              icon={<CloseOutlined />}
                              onClick={() => setSelected(null)}
                            />
                          </Tooltip>
                        </div>

                        {canManage ? (
                          <Select
                            size="small"
                            value={it.albumId}
                            className="mt-2 w-full cursor-pointer"
                            onChange={(v) =>
                              run(moveMediaAction(it.id, v), "Đã chuyển album.")
                            }
                            options={albums.map((a) => ({
                              value: a.id,
                              label: a.name,
                            }))}
                          />
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              {/* Lightbox xem chi tiết + duyệt qua lại (ảnh trong lô đang hiện). */}
              <AntdImage.PreviewGroup
                items={visible.slice(0, limit).map((it) => it.url)}
                preview={{
                  open: previewOpen,
                  current: previewIndex,
                  onOpenChange: (v) => setPreviewOpen(v),
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
        <Tag className="ml-auto" variant="filled">
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
      // block + w-full: nút nằm trong div bọc (không còn là grid item) nên phải
      // tự chiếm hết chiều rộng, nếu không aspect-square sẽ ra kích thước 0.
      className={`group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-lg border-2 transition ${
        active ? "border-[#2e7d32]" : "border-transparent hover:border-black/20"
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      title={item.name}
    >
      {/* Nút phóng to ở góc phải — xem ảnh chi tiết trong lightbox. */}
      <span
        role="button"
        aria-label="Xem ảnh lớn"
        title="Xem ảnh lớn"
        className="absolute right-1 top-1 z-10 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition hover:bg-black/80 group-hover:opacity-100"
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
      >
        <ExpandOutlined style={{ fontSize: 11 }} />
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
