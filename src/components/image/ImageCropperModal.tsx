"use client";

// Hộp thoại cắt / thu phóng ảnh — dùng chung cho khu quản trị lẫn form đăng ký
// của khách. Khung cắt do react-advanced-cropper lo (kéo thả, lăn chuột để
// phóng to, chụm hai ngón trên điện thoại, tự xoay theo EXIF); phần vỏ dựng
// bằng Tailwind thuần để trang công khai không phải kéo cả antd vào gói tải về.
import { useEffect, useMemo, useRef, useState } from "react";
import { Cropper, type CropperRef } from "react-advanced-cropper";
import "react-advanced-cropper/dist/style.css";
import { MAX_AREA, canvasThanhFile } from "@/lib/image/crop";

/** Tỉ lệ khung cho sẵn; `undefined` = kéo tự do. */
const TY_LE: { nhan: string; gt: number | undefined }[] = [
  { nhan: "Tự do", gt: undefined },
  { nhan: "1:1", gt: 1 },
  { nhan: "4:3", gt: 4 / 3 },
  { nhan: "3:4", gt: 3 / 4 },
  { nhan: "16:9", gt: 16 / 9 },
];

const NUT =
  "cursor-pointer rounded-full border px-3 py-1 text-xs font-medium transition";

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
  const cropperRef = useRef<CropperRef>(null);
  const [tuChon, setTuChon] = useState<number | undefined>(aspect);
  // Tỉ lệ tự nhập (vd 5 : 2). Chỉ áp khi cả hai ô đều là số dương.
  const [tuNhap, setTuNhap] = useState(false);
  const [rong, setRong] = useState("");
  const [cao, setCao] = useState("");
  const [dangCat, setDangCat] = useState(false);
  const [loi, setLoi] = useState("");

  // Đường dẫn tạm để hiện ảnh; thu hồi khi đổi tệp/đóng để khỏi rò bộ nhớ.
  const src = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => {
    return () => {
      if (src) URL.revokeObjectURL(src);
    };
  }, [src]);

  useEffect(() => {
    setTuChon(aspect);
    setTuNhap(false);
    setRong("");
    setCao("");
    setLoi("");
  }, [file, aspect]);

  // Gõ tới đâu khung cắt đổi theo tới đó; gõ dở dang thì giữ nguyên khung cũ.
  useEffect(() => {
    if (!tuNhap) return;
    const r = Number(rong);
    const c = Number(cao);
    if (r > 0 && c > 0) setTuChon(r / c);
  }, [tuNhap, rong, cao]);

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
    if (!file) return;
    setDangCat(true);
    setLoi("");
    try {
      // Giữ nguyên độ phân giải vùng đã cắt — không thu nhỏ. Chỉ chặn ngưỡng
      // an toàn của Safari. Nền trắng để phần tràn ra ngoài mép ảnh không
      // thành mảng đen khi xuất WebP.
      const canvas = cropperRef.current?.getCanvas({
        maxArea: MAX_AREA,
        fillColor: "#ffffff",
        imageSmoothingQuality: "high",
      });
      if (!canvas) throw new Error("Ảnh chưa sẵn sàng, bạn đợi một chút rồi thử lại.");
      onDone(await canvasThanhFile(canvas, file));
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

        <Cropper
          ref={cropperRef}
          src={src}
          // Tự đọc cờ xoay EXIF của ảnh chụp bằng điện thoại.
          checkOrientation
          stencilProps={{ aspectRatio: tuChon }}
          className="h-[46vh] min-h-[240px] w-full bg-neutral-900"
        />

        <div className="flex flex-wrap items-center gap-2 px-4 py-3 text-sm">
          {/* Chỉ cho đổi tỉ lệ khi nơi gọi không ép cứng. */}
          {aspect === undefined ? (
            <>
              <span className="text-forest/70">Tỉ lệ</span>
              {TY_LE.map((t) => (
                <button
                  key={t.nhan}
                  type="button"
                  onClick={() => {
                    setTuNhap(false);
                    setTuChon(t.gt);
                  }}
                  className={`${NUT} ${
                    !tuNhap && tuChon === t.gt
                      ? "border-[#2e7d32] bg-[#2e7d32]/10 text-[#2e7d32]"
                      : "border-black/15 hover:border-black/35"
                  }`}
                >
                  {t.nhan}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setTuNhap(true)}
                className={`${NUT} ${
                  tuNhap
                    ? "border-[#2e7d32] bg-[#2e7d32]/10 text-[#2e7d32]"
                    : "border-black/15 hover:border-black/35"
                }`}
              >
                Tự nhập
              </button>
              {tuNhap ? (
                <span className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    value={rong}
                    onChange={(e) => setRong(e.target.value)}
                    placeholder="Rộng"
                    className="w-16 rounded-lg border border-black/15 px-2 py-1 text-xs outline-none focus:border-[#2e7d32]"
                  />
                  <span className="text-forest/50">:</span>
                  <input
                    type="number"
                    min={1}
                    value={cao}
                    onChange={(e) => setCao(e.target.value)}
                    placeholder="Cao"
                    className="w-16 rounded-lg border border-black/15 px-2 py-1 text-xs outline-none focus:border-[#2e7d32]"
                  />
                </span>
              ) : null}
            </>
          ) : null}

          {/* Lăn chuột / chụm hai ngón cũng phóng to được; hai nút này cho
              những ai không quen thao tác đó. */}
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => cropperRef.current?.zoomImage(0.8)}
              className={`${NUT} border-black/15 hover:border-black/35`}
            >
              Thu nhỏ
            </button>
            <button
              type="button"
              onClick={() => cropperRef.current?.zoomImage(1.25)}
              className={`${NUT} border-black/15 hover:border-black/35`}
            >
              Phóng to
            </button>
            <button
              type="button"
              onClick={() => cropperRef.current?.rotateImage(90)}
              className={`${NUT} border-black/15 hover:border-black/35`}
            >
              Xoay 90°
            </button>
          </div>
        </div>

        {loi ? <p className="px-4 pb-2 text-sm text-red-600">{loi}</p> : null}

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
            disabled={dangCat}
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
