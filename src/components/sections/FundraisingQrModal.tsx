"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Khóa cuộn trang chính khi mở modal và lắng nghe phím Escape
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

  if (!open || !channel || !mounted) return null;

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

  const modalContent = (
    <div
      data-lenis-prevent
      data-lenis-prevent-wheel
      data-lenis-prevent-touch
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/65 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label={`Thông tin chuyển khoản ${channel.name}`}
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        data-lenis-prevent
        className="flex min-h-screen w-full items-start sm:items-center justify-center p-4 sm:p-6 py-8 sm:py-12"
        onClick={onClose}
      >
        {/* Card Modal Cổ Điển / Đơn Giản */}
        <div
          data-lenis-prevent
          className="relative z-10 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 transition-all text-left my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Nút đóng X */}
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Tiêu đề Đơn giản */}
          <div className="border-b border-gray-100 pb-4 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>{channel.icon || "💳"}</span>
              <span>{channel.name || "Thông tin chuyển khoản"}</span>
            </h3>
          </div>

          {/* Bố cục 2 cột đơn giản */}
          <div className="mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 items-start">
            {/* CỘT BÊN TRÁI: Danh sách thông tin dạng classic */}
            <div className="space-y-4">
              <div>
                <div className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                  Ngân hàng thụ hưởng
                </div>
                <div className="mt-0.5 text-base font-semibold text-gray-900 dark:text-white">
                  {bankName}
                </div>
              </div>

              {accountNumber && (
                <div>
                  <div className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                    Số tài khoản
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="font-mono text-lg font-bold text-gray-900 dark:text-white tracking-wide">
                      {accountNumber}
                    </span>
                    <button
                      onClick={handleCopy}
                      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                        copied
                          ? "bg-emerald-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      }`}
                    >
                      {copied ? (
                        <span>Đã chép!</span>
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
                  <div className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                    Chủ tài khoản
                  </div>
                  <div className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-white">
                    {accountName}
                  </div>
                </div>
              )}

              {modalNote && (
                <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
                  <div className="text-xs font-medium text-gray-500 dark:text-zinc-400">
                    Ghi chú
                  </div>
                  <div className="mt-1 rounded-lg bg-gray-50 p-2.5 text-xs text-gray-800 dark:bg-zinc-800/60 dark:text-zinc-200 border border-gray-100 dark:border-zinc-800/80 leading-relaxed">
                    {modalNote}
                  </div>
                </div>
              )}
            </div>

            {/* CỘT BÊN PHẢI: Hình ảnh Mã QR */}
            <div className="flex flex-col items-center justify-center text-center">
              {qrImage ? (
                <div className="flex w-full flex-col items-center">
                  <div className="p-2 bg-white rounded-xl border border-gray-200 dark:border-zinc-700 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrImage}
                      alt={`Mã QR ${bankName}`}
                      className="max-h-[240px] w-auto max-w-full rounded-lg object-contain"
                    />
                  </div>

                  <a
                    href={qrImage}
                    download={`Ma-QR-Chuyen-Khoan-${bankName}.jpg`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3.5 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition shadow-xs cursor-pointer"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    <span>Tải mã QR về máy</span>
                  </a>
                </div>
              ) : (
                <div className="flex h-44 w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 p-4 dark:border-zinc-800">
                  <span className="text-2xl opacity-40">📱</span>
                  <p className="mt-2 text-xs text-gray-500 dark:text-zinc-400">
                    Chưa có ảnh QR Code
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
