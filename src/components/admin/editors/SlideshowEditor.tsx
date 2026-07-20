"use client";

// Slideshow trang chủ — main.gallery.
// Giao diện dạng lưới thẻ: nhìn phát biết ngay ảnh nào đang được chiếu,
// thứ tự ra sao, và thêm ảnh thẳng từ Kho ảnh.
import { useState } from "react";
import { Alert, Button, Input, Modal, Popconfirm, Switch, Tag, Tooltip } from "antd";
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  PictureOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ImageField,
} from "../editorKit";
import MediaBrowser from "../MediaBrowser";
import { SLIDESHOW_LIMIT, type Photo } from "@/lib/content/schema";

export default function SlideshowEditor({ initial }: { initial: Photo[] }) {
  const { value, update, status } = useSectionAutosave<Photo[]>(
    "main.gallery",
    initial
  );
  const [pickOpen, setPickOpen] = useState(false);
  const [pickManyOpen, setPickManyOpen] = useState(false);

  const setAt = (i: number, next: Photo) => {
    const arr = value.slice();
    arr[i] = next;
    update(arr);
  };
  const removeAt = (i: number) => {
    const arr = value.slice();
    arr.splice(i, 1);
    update(arr);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const arr = value.slice();
    [arr[i], arr[j]] = [arr[j], arr[i]];
    update(arr);
  };
  const addPhoto = (src: string) => {
    update([...value, { src, caption: "", desc: "", tall: false }]);
    setPickOpen(false);
  };

  const onAir = Math.min(value.length, SLIDESHOW_LIMIT);
  const hidden = Math.max(0, value.length - SLIDESHOW_LIMIT);
  const missingImage = value.filter((p) => !p.src.trim()).length;

  return (
    <EditorCard
      title="Slideshow trang chủ"
      extra={
        <span className="flex items-center gap-2">
          <Tag color="green">{onAir} đang chiếu</Tag>
          {hidden > 0 ? <Tag>{hidden} chưa chiếu</Tag> : null}
          <SaveStatusTag status={status} />
        </span>
      }
    >
      <p className="mb-3 text-sm opacity-60">
        Đây là dãy ảnh chạy trong khung TV ở <strong>trang chủ</strong>, ngay
        dưới mục &ldquo;Giới thiệu&rdquo;. Chỉ{" "}
        <strong>{SLIDESHOW_LIMIT} ảnh đầu tiên</strong> được chiếu — muốn ảnh nào
        lên sóng thì dùng nút mũi tên đưa nó lên trước.
      </p>

      {hidden > 0 ? (
        <Alert
          type="info"
          showIcon
          className="mb-3"
          title={`${hidden} ảnh cuối danh sách sẽ không hiển thị trên trang chủ.`}
          description="Đưa lên vị trí đầu để được chiếu, hoặc xoá bớt cho gọn."
        />
      ) : null}

      {missingImage > 0 ? (
        <Alert
          type="warning"
          showIcon
          className="mb-3"
          title={`Có ${missingImage} mục chưa chọn ảnh.`}
        />
      ) : null}

      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="cursor-pointer"
          onClick={() => setPickOpen(true)}
        >
          Thêm ảnh từ kho
        </Button>
        <Button
          icon={<PictureOutlined />}
          className="cursor-pointer"
          onClick={() => setPickManyOpen(true)}
        >
          Thêm nhiều ảnh
        </Button>
      </div>

      {value.length === 0 ? (
        <div className="rounded-xl border border-dashed border-black/15 py-10 text-center text-sm opacity-60">
          Chưa có ảnh nào. Bấm “Thêm ảnh từ kho” để bắt đầu.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {value.map((photo, i) => {
            const live = i < SLIDESHOW_LIMIT;
            return (
              <div
                key={i}
                className={`rounded-xl border p-3 transition ${
                  live
                    ? "border-[#2e7d32]/35 bg-[#2e7d32]/[0.04]"
                    : "border-black/10 opacity-60"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Tag color={live ? "green" : "default"} className="m-0">
                    #{i + 1} {live ? "Đang chiếu" : "Chưa chiếu"}
                  </Tag>
                  <span className="ml-auto flex gap-1">
                    <Tooltip title="Đưa lên trước">
                      <Button
                        size="small"
                        icon={<ArrowLeftOutlined />}
                        disabled={i === 0}
                        onClick={() => move(i, -1)}
                      />
                    </Tooltip>
                    <Tooltip title="Đẩy về sau">
                      <Button
                        size="small"
                        icon={<ArrowRightOutlined />}
                        disabled={i === value.length - 1}
                        onClick={() => move(i, 1)}
                      />
                    </Tooltip>
                    <Popconfirm
                      title="Xoá ảnh khỏi slideshow?"
                      description="Ảnh vẫn còn trong Kho ảnh."
                      okText="Xoá"
                      cancelText="Huỷ"
                      onConfirm={() => removeAt(i)}
                    >
                      <Button size="small" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                  </span>
                </div>

                <ImageField
                  value={photo.src}
                  onChange={(src) => setAt(i, { ...photo, src })}
                />

                <Input
                  className="mt-2"
                  placeholder="Chú thích (hiện trên ảnh)"
                  value={photo.caption ?? ""}
                  onChange={(e) => setAt(i, { ...photo, caption: e.target.value })}
                />
                <Input.TextArea
                  className="mt-2"
                  rows={2}
                  placeholder="Mô tả chi tiết (tuỳ chọn)"
                  value={photo.desc ?? ""}
                  onChange={(e) => setAt(i, { ...photo, desc: e.target.value })}
                />
                <label className="mt-2 flex items-center gap-2 text-xs opacity-70">
                  <Switch
                    size="small"
                    checked={!!photo.tall}
                    onChange={(tall) => setAt(i, { ...photo, tall })}
                  />
                  Ảnh cao (chiếm 2 hàng trong lưới ảnh)
                </label>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={pickOpen}
        onCancel={() => setPickOpen(false)}
        width={920}
        footer={null}
        destroyOnHidden
        title={
          <span className="flex items-center gap-2">
            <PictureOutlined /> Chọn ảnh cho slideshow
          </span>
        }
      >
        <MediaBrowser mode="pick" onPick={addPhoto} />
      </Modal>

      <Modal
        open={pickManyOpen}
        onCancel={() => setPickManyOpen(false)}
        width={920}
        footer={null}
        destroyOnHidden
        title="Chọn ảnh từ kho — có thể chọn nhiều hoặc cả album"
      >
        <MediaBrowser
          mode="pick"
          multiple
          onPickMany={(urls) => {
            const daCo = new Set(value.map((p) => p.src));
            const them = urls
              .filter((u) => !daCo.has(u))
              .map((src) => ({ src, caption: "", desc: "", tall: false }));
            update([...value, ...them]);
            setPickManyOpen(false);
          }}
        />
      </Modal>
    </EditorCard>
  );
}
