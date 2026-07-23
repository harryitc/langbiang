"use client";

// Hộp thoại cắt / thu phóng ảnh — dùng chung cho khu quản trị lẫn form đăng ký
// của khách. Bố cục 2 cột: Cột trái rộng dành tối đa diện tích hiển thị ảnh,
// cột phải thu hẹp chứa thanh công cụ và nút thao tác.
import { useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "antd";
import { Cropper, ImageRestriction, type CropperRef } from "react-advanced-cropper";
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

  // Đảm bảo khi mở modal, cropper tự reset về kích thước full sau khi layout đã ổn định
  useEffect(() => {
    if (!file) return;
    const t1 = setTimeout(() => cropperRef.current?.reset(), 50);
    const t2 = setTimeout(() => cropperRef.current?.reset(), 150);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [file, src]);

  // Gõ tới đâu khung cắt đổi theo tới đó; gõ dở dang thì giữ nguyên khung cũ.
  useEffect(() => {
    if (!tuNhap) return;
    const r = Number(rong);
    const c = Number(cao);
    if (r > 0 && c > 0) setTuChon(r / c);
  }, [tuNhap, rong, cao]);

  if (!file) return null;

  async function xong() {
    if (!file) return;
    setDangCat(true);
    setLoi("");
    try {
      const canvas = cropperRef.current?.getCanvas({
        maxArea: MAX_AREA,
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
    <Modal
      open={!!file}
      title={null}
      onCancel={onCancel}
      footer={null}
      width={940}
      centered
      destroyOnClose
      maskClosable={false}
      keyboard={false}
      transitionName=""
      maskTransitionName=""
    >
      {/* Bố cục 2 cột: Trái = Hiển thị ảnh (chiếm diện tích lớn), Phải = Công cụ */}
      <div className="mt-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
        {/* CỘT TRÁI: Vùng Cropper hiển thị ảnh chuẩn tỉ lệ & diện tích tối đa */}
        <div className="md:col-span-8 flex flex-col justify-center overflow-hidden rounded-xl border border-zinc-700/60 shadow-inner bg-[#18181b] bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px] p-1">
          <Cropper
            ref={cropperRef}
            src={src}
            checkOrientation
            stencilProps={{ aspectRatio: tuChon }}
            defaultSize={({ imageSize }) => ({
              width: imageSize.width,
              height: imageSize.height,
            })}
            imageRestriction={ImageRestriction.fitArea}
            onReady={(cropper) => cropper.reset()}
            className="h-[58vh] min-h-[400px] max-h-[620px] w-full !bg-transparent"
          />
        </div>

        {/* CỘT PHẢI: Thanh công cụ tùy chỉnh kích thước nhỏ gọn */}
        <div className="md:col-span-4 flex flex-col justify-between rounded-xl bg-gray-50 p-4 dark:bg-zinc-800/40 border border-gray-100 dark:border-zinc-800">
          <div className="space-y-4">
            {/* 1. Chọn tỉ lệ khung hình */}
            {aspect === undefined && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">
                  Tỉ lệ khung hình
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {TY_LE.map((t) => (
                    <button
                      key={t.nhan}
                      type="button"
                      onClick={() => {
                        setTuNhap(false);
                        setTuChon(t.gt);
                      }}
                      className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                        !tuNhap && tuChon === t.gt
                          ? "bg-[#2e7d32] text-white shadow-xs"
                          : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                      }`}
                    >
                      {t.nhan}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTuNhap(true)}
                    className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                      tuNhap
                        ? "bg-[#2e7d32] text-white shadow-xs"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    Tự nhập
                  </button>
                </div>

                {tuNhap && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs">
                    <input
                      type="number"
                      min={1}
                      value={rong}
                      onChange={(e) => setRong(e.target.value)}
                      placeholder="Rộng"
                      className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    />
                    <span className="text-gray-400 font-bold">:</span>
                    <input
                      type="number"
                      min={1}
                      value={cao}
                      onChange={(e) => setCao(e.target.value)}
                      placeholder="Cao"
                      className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs outline-none focus:border-[#2e7d32] focus:ring-1 focus:ring-[#2e7d32] dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 2. Công cụ thu phóng, xoay & khôi phục */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-2">
                Thao tác ảnh
              </label>
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => cropperRef.current?.zoomImage(0.8)}
                    className="inline-flex items-center justify-center gap-1.5 cursor-pointer rounded-lg bg-white px-2.5 py-2 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 transition shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                    <span>Thu nhỏ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => cropperRef.current?.zoomImage(1.25)}
                    className="inline-flex items-center justify-center gap-1.5 cursor-pointer rounded-lg bg-white px-2.5 py-2 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 transition shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                      <line x1="11" y1="8" x2="11" y2="14"/>
                      <line x1="8" y1="11" x2="14" y2="11"/>
                    </svg>
                    <span>Phóng to</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => cropperRef.current?.rotateImage(90)}
                    className="inline-flex items-center justify-center gap-1.5 cursor-pointer rounded-lg bg-white px-2.5 py-2 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-100 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 transition shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.5 2v6h-6"/>
                      <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                    </svg>
                    <span>Xoay 90°</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTuChon(aspect);
                      setTuNhap(false);
                      setRong("");
                      setCao("");
                      cropperRef.current?.reset();
                    }}
                    className="inline-flex items-center justify-center gap-1.5 cursor-pointer rounded-lg bg-white px-2.5 py-2 text-xs font-medium text-amber-700 border border-amber-200/80 hover:bg-amber-50 dark:bg-zinc-800 dark:text-amber-400 dark:border-zinc-700 transition shadow-2xs"
                  >
                    <svg className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
                      <path d="M3 3v5h5"/>
                    </svg>
                    <span>Khôi phục</span>
                  </button>
                </div>
              </div>
            </div>

            {loi ? <p className="text-xs text-red-600 font-medium">{loi}</p> : null}
          </div>

          {/* 3. Nút hành động (Huỷ / Lưu) nằm cuối cột phải */}
          <div className="mt-6 flex flex-col gap-2 border-t border-gray-200/60 pt-4 dark:border-zinc-700/60">
            <button
              type="button"
              disabled={dangCat}
              onClick={() => void xong()}
              className="inline-flex items-center justify-center gap-2 cursor-pointer rounded-xl bg-[#2e7d32] px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:bg-[#276b2a] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 w-full"
            >
              {dangCat ? (
                <>
                  <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Đang xử lý…</span>
                </>
              ) : (
                "Lưu và tải lên"
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="cursor-pointer rounded-xl px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200/60 dark:text-zinc-300 dark:hover:bg-zinc-700 transition w-full text-center"
            >
              Huỷ
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
