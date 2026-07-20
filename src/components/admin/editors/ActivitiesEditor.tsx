"use client";

import IconCardEditor from "./IconCardEditor";
import type { IconCard } from "@/lib/content/schema";

// Trình biên tập Hoạt động — nhánh nội dung main.activities (FR2 – 2.4)
export default function ActivitiesEditor({ initial }: { initial: IconCard[] }) {
  return (
    <IconCardEditor
      initial={initial}
      config={{
        path: "main.activities",
        title: "Hoạt động",
        noun: "hoạt động",
        itemLabel: "Hoạt động",
        addLabel: "Thêm hoạt động",
        suggestions: ["🌕", "🎁", "🎨", "🏮", "🍡", "🎵", "🤝", "📚", "🌈"],
        defaultIcon: "🌕",
        titlePlaceholder: "Vd: Đêm hội Trăng rằm",
        descPlaceholder: "Rước đèn, phá cỗ, múa lân và những màn văn nghệ rực rỡ…",
        descHint: "Nên giữ khoảng 1–2 câu để thẻ hoạt động cân đối.",
      }}
    />
  );
}
