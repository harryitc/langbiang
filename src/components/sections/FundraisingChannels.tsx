"use client";

import { useState } from "react";
import type { FundraisingChannel } from "@/lib/content/schema";
import FundraisingQrModal from "./FundraisingQrModal";

export default function FundraisingChannels({
  channels,
}: {
  channels: FundraisingChannel[];
}) {
  const [activeChannel, setActiveChannel] = useState<FundraisingChannel | null>(null);

  const handleChannelClick = (
    e: React.MouseEvent,
    channel: FundraisingChannel
  ) => {
    // Nếu kênh có mã QR hoặc số tài khoản / link dạng "#", mở Pop-up Modal mã QR
    if (channel.qrImage?.trim() || channel.accountNumber?.trim() || channel.href === "#") {
      e.preventDefault();
      setActiveChannel(channel);
    }
  };

  return (
    <>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {channels.map((c) => (
          <div
            key={c.name}
            className={`flex flex-col rounded-3xl p-7 shadow-sm ring-1 transition duration-300 hover:-translate-y-1.5 hover:shadow-soft ${
              c.highlight
                ? "bg-gradient-to-br from-[#ee4d2d] to-[#ff7337] text-white ring-transparent"
                : "bg-white/80 ring-leaf/10 dark:bg-white/[0.04] dark:ring-leaf-bright/10"
            }`}
          >
            <span className="text-4xl">{c.icon}</span>
            <h3
              className={`mt-4 text-xl font-bold ${
                c.highlight ? "text-white" : "text-forest dark:text-ink"
              }`}
            >
              {c.name}
            </h3>
            <p
              className={`mt-2 flex-1 text-sm leading-relaxed ${
                c.highlight ? "text-white/90" : "text-forest/75 dark:text-ink/70"
              }`}
            >
              {c.note}
            </p>
            <a
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              onClick={(e) => handleChannelClick(e, c)}
              className={`mt-5 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                c.highlight
                  ? "bg-white text-[#ee4d2d] hover:bg-white/90"
                  : "bg-gradient-to-r from-leaf-deep to-leaf text-white hover:brightness-110"
              }`}
            >
              {c.icon === "🛒" && (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M7 4V2h10v2h3.5l-1 15.2A2.8 2.8 0 0 1 16.7 22H7.3a2.8 2.8 0 0 1-2.8-2.8L3.5 4H7Zm2 0h6V3H9v1Zm-1 5v8h2V9H8Zm5 0v8h2V9h-2Z" />
                </svg>
              )}
              {c.cta}
            </a>
          </div>
        ))}
      </div>

      <FundraisingQrModal
        open={Boolean(activeChannel)}
        onClose={() => setActiveChannel(null)}
        channel={activeChannel}
      />
    </>
  );
}
