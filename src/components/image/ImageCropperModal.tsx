"use client";

// Hộp thoại cắt / thu phóng ảnh — dùng chung cho khu quản trị lẫn form đăng ký
// của khách. Dựng bằng Tailwind thuần (không antd) để trang công khai không
// phải kéo cả antd vào gói tải về.
import { useEffect, useMemo, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { cutAnh } from "@/lib/image/crop";

/** Tỉ lệ khung cho sẵn; `null` = giữ đúng tỉ lệ ảnh gốc. */
const TY_LE: { nhan: string; gt: number | null }[] = [
  { nhan: "Gốc", gt: null },
  { nhan: "1:1", gt: 1 },
  { nhan: "4:3", gt: 4 / 3 },
  { nhan: "3:4", gt: 3 / 4 },
  { nhan: "16:9", gt: 16 / 9 },
];

export default function ImageCropperModal({
  file,
  aspect,
  title = "Cắt và chỉnh ảnh",
  onCancel,
  onDone,
}: {
  /** Tệp cần cắt. `null` = đóng hộp thoại. */
  file: File | null;
  /** Ép cứng một tỉ lệ (vd 1 cho ảnh chân dung); bỏ trống thì cho chọn. */
  aspect?: number;
  title?: string;
  onCancel: () => void;
  onDone: (file: File) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [vung, setVung] = useState<Area | null>(null);
  const [tuChon, setTuChon] = useState<number | null>(aspect ?? null);
  const [tyLeGoc, setTyLeGoc] = useState(1);
  const [dangCat, setDangCat] = useState(false);
  const [loi, setLoi] = useState("");

  // Đường dẫn tạm để hiện ảnh; thu hồi khi đổi tệp/đóng để khỏi rò bộ nhớ.
  const src = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  // Mở tệp mới thì đưa mọi thứ về mặc định.
  useEffect(() => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setVung(null);
    setTuChon(aspect ?? null);
    setLoi("");
  }, [file, aspect]);

  // Bấm Esc để đóng, giống các hộp thoại khác.
  useEffect(() => {
    if (!file) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [file, onCancel]);

  if (!file) return null;

  async function xong() {
    if (!file || !vung) return;
    setDangCat(true);
    setLoi("");
    try {
      onDone(await cutAnh(file, vung, { rotation }));
    } catch (err) {
      setLoi(err instanceof Error ? err.message : "Cắt ảnh không được.");
    } finally {
      setDangCat(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/60 p-3"
      onClick={onCancel}
    >
      <div
        className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-black/10 px-4 py-3 text-base font-semibold">
          {title}
        </div>

        {/* Khung cắt — nền tối để thấy rõ mép ảnh. */}
        <div className="relative h-[46vh] min-h-[240px] w-full bg-neutral-900">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={tuChon ?? tyLeGoc}
            minZoom={1}
            maxZoom={4}
            restrictPosition
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onMediaLoaded={(size) =>
              setTyLeGoc(size.naturalWidth / size.naturalHeight || 1)
            }
            onCropComplete={(_, pixels) => setVung(pixels)}
          />
        </div>

        <div className="flex flex-col gap-3 px-4 py-3">
          <label className="flex items-center gap-3 text-sm">
            <span className="w-16 shrink-0 text-forest/70">Phóng to</span>
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer accent-[#2e7d32]"
            />
          </label>

          <div className="flex flex-wrap items-center gap-2 text-sm">
            {/* Chỉ cho đổi tỉ lệ khi nơi gọi không ép cứng. */}
            {aspect === undefined ? (
              <>
                <span className="text-forest/70">Tỉ lệ</span>
                {TY_LE.map((t) => (
                  <button
                    key={t.nhan}
                    type="button"
                    onClick={() => setTuChon(t.gt)}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition ${
                      tuChon === t.gt
                        ? "border-[#2e7d32] bg-[#2e7d32]/10 text-[#2e7d32]"
                        : "border-black/15 hover:border-black/35"
                    }`}
                  >
                    {t.nhan}
                  </button>
                ))}
              </>
            ) : null}
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="ml-auto cursor-pointer rounded-full border border-black/15 px-3 py-1 text-xs font-medium transition hover:border-black/35"
            >
              Xoay 90°
            </button>
          </div>

          {loi ? <p className="text-sm text-red-600">{loi}</p> : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-black/10 px-4 py-3">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-forest/70 transition hover:bg-black/5"
          >
            Huỷ
          </button>
          <button
            type="button"
            disabled={dangCat || !vung}
            onClick={() => void xong()}
            className="cursor-pointer rounded-lg bg-[#2e7d32] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#276b2a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {dangCat ? "Đang xử lý…" : "Lưu và tải lên"}
          </button>
        </div>
      </div>
    </div>
  );
}
