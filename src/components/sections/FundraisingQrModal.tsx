"use client";

import { useEffect, useState } from "react";
import type { FundraisingChannel } from "@/lib/content/schema";

export default function FundraisingQrModal({
  open,
  onClose,
  channel,
}: {
  open: boolean;
  onClose: () => void;
  channel: FundraisingChannel | null;
}) {
  const [copied, setCopied] = useState(false);

  // Đóng modal khi nhấn phím Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !channel) return null;

  const bankName = channel.bankName?.trim() || "Ngân hàng";
  const accountNumber = channel.accountNumber?.trim() || "";
  const accountName = channel.accountName?.trim() || "";
  const qrImage = channel.qrImage?.trim() || "";
  const note = channel.note?.trim() || "";

  const handleCopy = () => {
    if (!accountNumber) return;
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all dark:bg-[#1a231c] sm:p-8 border border-leaf/10 dark:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng X ở góc trên phải */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-forest/5 text-forest/70 transition hover:bg-forest/10 hover:text-forest dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20 dark:hover:text-white"
          aria-label="Đóng"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Tiêu đề Pop-up */}
        <div className="flex items-center gap-3 border-b border-forest/10 pb-4 dark:border-white/10">
          <span className="text-3xl">{channel.icon || "💳"}</span>
          <div>
            <h3 className="text-xl font-bold text-forest dark:text-ink">
              {channel.name || "Thông tin Chuyển khoản"}
            </h3>
            <p className="text-xs text-forest/60 dark:text-ink/60">
              Quét mã QR hoặc chuyển khoản trực tiếp qua ngân hàng
            </p>
          </div>
        </div>

        {/* Bố cục 2 Cột: Bên trái Thông tin Ngân hàng, Bên phải Ảnh QR */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 items-center">
          {/* CỘT BÊN TRÁI: Thông tin ngân hàng & nút sao chép */}
          <div className="flex flex-col gap-4 rounded-2xl bg-[#f4f9f2] p-5 dark:bg-white/[0.04] border border-leaf/10 dark:border-white/5">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-forest/50 dark:text-ink/50">
                Ngân hàng thụ hưởng
              </span>
              <div className="mt-1 flex items-center gap-2 text-lg font-extrabold text-forest dark:text-ink">
                <span>🏦</span>
                <span>{bankName}</span>
              </div>
            </div>

            {accountNumber && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-forest/50 dark:text-ink/50">
                  Số tài khoản
                </span>
                <div className="mt-1 flex items-center justify-between gap-2 rounded-xl bg-white p-3 shadow-sm dark:bg-night-2 border border-leaf/10 dark:border-white/10">
                  <span className="font-mono text-xl font-black tracking-wider text-sunset">
                    {accountNumber}
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                      copied
                        ? "bg-emerald-500 text-white"
                        : "bg-forest/10 text-forest hover:bg-forest/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {accountName && (
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-forest/50 dark:text-ink/50">
                  Tên chủ tài khoản
                </span>
                <div className="mt-1 text-sm font-bold text-forest dark:text-ink">
                  {accountName}
                </div>
              </div>
            )}

            {note && (
              <div className="border-t border-forest/10 pt-3 dark:border-white/10">
                <span className="text-xs font-semibold uppercase tracking-wider text-forest/50 dark:text-ink/50">
                  Ghi chú ủng hộ
                </span>
                <p className="mt-1 text-xs leading-relaxed text-forest/80 dark:text-ink/80">
                  {note}
                </p>
              </div>
            )}
          </div>

          {/* CỘT BÊN PHẢI: Hình ảnh QR Code & Nút tải về */}
          <div className="flex flex-col items-center justify-center text-center">
            {qrImage ? (
              <div className="w-full flex flex-col items-center">
                <div className="group relative max-w-[240px] overflow-hidden rounded-2xl bg-white p-3 shadow-md border border-leaf/10 dark:bg-white dark:border-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrImage}
                    alt={`Mã QR ${bankName}`}
                    className="h-auto w-full rounded-xl object-contain transition duration-300 group-hover:scale-102"
                  />
                </div>

                <a
                  href={qrImage}
                  download={`Ma-QR-Chuyen-Khoan-${bankName}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 active:scale-98"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Tải mã QR về máy</span>
                </a>
              </div>
            ) : (
              <div className="flex h-56 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-forest/15 p-6 dark:border-white/15">
                <span className="text-4xl opacity-40">📱</span>
                <p className="mt-2 text-xs text-forest/60 dark:text-ink/60">
                  Chưa cập nhật hình ảnh mã QR.
                  <br />
                  Bạn có thể nhập Số tài khoản ở cột bên trái để chuyển khoản.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
