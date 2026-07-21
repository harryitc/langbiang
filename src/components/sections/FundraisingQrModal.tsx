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
  const modalNote = channel.modalNote?.trim() || channel.transferNote?.trim() || "";

  const handleCopy = () => {
    if (!accountNumber) return;
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-[9000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Thông tin chuyển khoản ${channel.name}`}
      onClick={onClose}
    >
      {/* Lớp nền mờ giống Modal Đơn vị tài trợ */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl rounded-3xl bg-cream p-6 shadow-soft dark:bg-night-2 sm:p-8 border border-leaf/15 dark:border-leaf-bright/10 transition-all overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng X */}
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-leaf/10 text-forest transition hover:bg-leaf/20 dark:bg-white/10 dark:text-ink cursor-pointer"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Tiêu đề Pop-up */}
        <div className="flex items-center gap-3 border-b border-leaf/10 pb-4 dark:border-white/10">
          <span className="text-3xl">{channel.icon || "💳"}</span>
          <div>
            <h3 className="text-xl font-bold text-forest dark:text-ink">
              {channel.name || "Thông tin Chuyển khoản"}
            </h3>
            <p className="text-xs text-forest/70 dark:text-ink/70">
              Quét mã QR hoặc sao chép thông tin tài khoản để chuyển khoản
            </p>
          </div>
        </div>

        {/* Bố cục 2 Cột: Bên trái Thông tin Ngân hàng & Cú pháp; Bên phải Mã QR & Nút Tải */}
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 items-center">
          {/* CỘT BÊN TRÁI: Thông tin ngân hàng & Cú pháp chuyển khoản */}
          <div className="flex flex-col gap-3.5 rounded-2xl bg-white/70 p-5 ring-1 ring-leaf/15 dark:bg-white/5 dark:ring-leaf-bright/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-leaf-deep dark:text-leaf-bright">
                Ngân hàng thụ hưởng
              </span>
              <div className="mt-1 text-base font-bold text-forest dark:text-ink">
                🏦 {bankName}
              </div>
            </div>

            {accountNumber && (
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-leaf-deep dark:text-leaf-bright">
                  Số tài khoản
                </span>
                <div className="mt-1 flex items-center justify-between gap-2 rounded-xl bg-leaf/5 p-2.5 dark:bg-white/10">
                  <span className="font-mono text-lg font-bold tracking-wider text-sunset">
                    {accountNumber}
                  </span>
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-soft transition cursor-pointer ${
                      copied
                        ? "bg-emerald-600 text-white"
                        : "bg-gradient-to-r from-sunset to-sun text-white hover:brightness-105"
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Đã chép!</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
                <span className="text-xs font-bold uppercase tracking-wider text-leaf-deep dark:text-leaf-bright">
                  Chủ tài khoản
                </span>
                <div className="mt-0.5 text-sm font-bold text-forest dark:text-ink">
                  {accountName}
                </div>
              </div>
            )}

            {modalNote && (
              <div className="border-t border-leaf/10 pt-3 dark:border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-leaf-deep dark:text-leaf-bright">
                  Ghi chú trong Pop-up
                </span>
                <p className="mt-1 rounded-lg bg-sun/10 p-2 text-xs font-medium leading-relaxed text-forest dark:bg-sun/15 dark:text-ink">
                  {modalNote}
                </p>
              </div>
            )}
          </div>

          {/* CỘT BÊN PHẢI: Hình ảnh Mã QR Code & Nút Tải về */}
          <div className="flex flex-col items-center justify-center text-center">
            {qrImage ? (
              <div className="flex w-full flex-col items-center">
                <div className="group relative max-w-[210px] overflow-hidden rounded-2xl bg-white p-3 shadow-soft ring-1 ring-leaf/10 dark:bg-white dark:ring-white/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrImage}
                    alt={`Mã QR ${bankName}`}
                    className="h-auto w-full rounded-xl object-contain transition duration-300 group-hover:scale-105"
                  />
                </div>

                <a
                  href={qrImage}
                  download={`Ma-QR-Chuyen-Khoan-${bankName}.jpg`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-leaf-deep to-leaf px-6 py-2.5 text-xs font-semibold text-white shadow-soft transition hover:brightness-110 active:scale-95"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Tải mã QR về máy</span>
                </a>
              </div>
            ) : (
              <div className="flex h-52 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-leaf/20 p-5 dark:border-white/20">
                <span className="text-3xl opacity-50">📱</span>
                <p className="mt-2 text-xs text-forest/70 dark:text-ink/70">
                  Chưa cập nhật hình ảnh mã QR.
                  <br />
                  Bạn có thể dùng Số tài khoản bên trái để chuyển khoản.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
