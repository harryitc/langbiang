"use client";

// Component quản lý kho ảnh độc lập dành riêng cho trang Admin (/admin/kho-anh).
// Không bị giới hạn chiều cao max-h-[70vh] hay cuộn nội bộ như khi nhúng trong Modal.
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  App,
  Button,
  Empty,
  Image as AntdImage,
  Input,
  Popconfirm,
  Popover,
  Select,
  Spin,
  Tag,
  Tooltip,
} from "antd";
import {
  CloseOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExpandOutlined,
  FolderAddOutlined,
  ScissorOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import { uploadImage } from "@/lib/content/upload-client";
import { canCrop, taiVeDeCat } from "@/lib/image/crop";
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

const ImageCropperModal = dynamic(
  () => import("@/components/image/ImageCropperModal"),
  { ssr: false }
);

const ALL = "all";
const ICON_BTN = "flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center !px-0";
const MISC_ALBUM_ID = "alb-khac";
const PAGE_SIZE = 48;

function canOptimize(url: string): boolean {
  return url.startsWith("/") || url.includes(".public.blob.vercel-storage.com");
}

export default function MediaManager() {
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
  const [cropping, setCropping] = useState<File | null>(null);
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

  useEffect(() => {
    if (cropping) setSelected(null);
  }, [cropping]);

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

  function handleChosen(files: FileList) {
    const list = Array.from(files);
    if (list.length === 1 && canCrop(list[0].type)) {
      setCropping(list[0]);
      return;
    }
    void handleFiles(list);
  }

  async function handleFiles(files: File[]) {
    const targetAlbum = albumId === ALL ? MISC_ALBUM_ID : albumId;
    setUploading(true);
    let lastUrl = "";
    try {
      for (const file of files) {
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

  async function catLai(it: MediaItem) {
    setBusy(true);
    try {
      setCropping(await taiVeDeCat(it.url, it.name));
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Không cắt lại được ảnh này.");
    } finally {
      setBusy(false);
    }
  }

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

  if (!lib) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spin />
      </div>
    );
  }

  return (
    <div className="flex min-h-[460px] flex-col gap-6 pt-1 md:flex-row">
      {/* Cột album */}
      <div className="flex flex-col md:w-52 md:shrink-0 md:border-r md:border-gray-100 md:pr-4 dark:md:border-zinc-800">
        <div className="mb-2 flex items-center justify-between">
          <strong className="text-sm font-bold text-gray-800 dark:text-zinc-200">Album</strong>
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
        </div>
        <div className="flex flex-row gap-1 overflow-x-auto pr-1 md:flex-col md:overflow-x-hidden">
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
              manage
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

      {/* Khu vực danh sách ảnh — hiển thị dạng khối tự nhiên */}
      <div className="flex min-w-0 flex-1 flex-col gap-3.5 pb-2">
        <div className="flex flex-wrap items-center gap-2 pb-1 pt-0.5">
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
              if (e.target.files?.length) handleChosen(e.target.files);
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
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {visible.slice(0, limit).map((it, idx) => {
                  const isSelected = selected === it.id;
                  const popoverContent = (
                    <div className="w-56 p-0.5 text-left">
                      <div className="truncate text-xs font-bold text-gray-800 dark:text-zinc-200" title={it.name}>
                        {it.name}
                      </div>

                      <div className="mt-2 flex items-center justify-end gap-1 border-t border-gray-100 pt-2 dark:border-zinc-800">
                        <Tooltip title="Sao chép đường dẫn ảnh">
                          <Button
                            size="small"
                            type="text"
                            className={ICON_BTN}
                            icon={<CopyOutlined />}
                            onClick={() => {
                              setSelected(null);
                              void navigator.clipboard?.writeText(it.url);
                              message.success("Đã sao chép đường dẫn.");
                            }}
                          />
                        </Tooltip>
                        <Tooltip title="Cắt / thu phóng ảnh">
                          <Button
                            size="small"
                            type="text"
                            className={ICON_BTN}
                            icon={<ScissorOutlined />}
                            onClick={() => {
                              setSelected(null);
                              void catLai(it);
                            }}
                          />
                        </Tooltip>
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
                            run(deleteMediaAction(it.id), "Đã xoá ảnh.").then(() => setSelected(null))
                          }
                        >
                          <Tooltip title="Xoá ảnh khỏi kho">
                            <Button size="small" type="text" danger className={ICON_BTN} icon={<DeleteOutlined />} />
                          </Tooltip>
                        </Popconfirm>
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

                      <Select
                        size="small"
                        value={it.albumId}
                        className="mt-2 w-full cursor-pointer"
                        onChange={(v) => {
                          setSelected(null);
                          void run(moveMediaAction(it.id, v), "Đã chuyển album.");
                        }}
                        options={albums.map((a) => ({
                          value: a.id,
                          label: a.name,
                        }))}
                      />
                    </div>
                  );

                  return (
                    <div key={it.id}>
                      <Popover
                        content={popoverContent}
                        trigger="click"
                        open={isSelected}
                        onOpenChange={(v) => setSelected(v ? it.id : null)}
                        placement="bottom"
                      >
                        <div>
                          <Thumb
                            item={it}
                            active={isSelected}
                            onClick={() => setSelected((cur) => (cur === it.id ? null : it.id))}
                            onPreview={() => {
                              setPreviewIndex(idx);
                              setPreviewOpen(true);
                            }}
                          />
                        </div>
                      </Popover>
                    </div>
                  );
                })}
              </div>

              {/* Lightbox xem ảnh chi tiết */}
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
                <div className="mt-4 text-center">
                  <Button onClick={() => setLimit((n) => n + PAGE_SIZE)}>
                    Xem thêm ({visible.length - limit} ảnh)
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </Spin>
      </div>

      <ImageCropperModal
        file={cropping}
        onCancel={() => setCropping(null)}
        onDone={(f) => {
          setCropping(null);
          void handleFiles([f]);
        }}
      />
    </div>
  );
}

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
  onPreview,
}: {
  item: MediaItem;
  active: boolean;
  onClick: () => void;
  onPreview: () => void;
}) {
  return (
    <button
      className={`group relative block aspect-square w-full cursor-pointer overflow-hidden rounded-lg border-2 transition ${
        active
          ? "border-[#2e7d32]"
          : "border-transparent hover:border-black/20"
      }`}
      onClick={onClick}
      title={item.name}
    >
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
