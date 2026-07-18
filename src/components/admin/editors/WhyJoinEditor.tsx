"use client";

import IconCardEditor from "./IconCardEditor";
import type { IconCard } from "@/lib/content/schema";

// Trình biên tập Lý do tham gia — nhánh nội dung main.whyJoin (FR2 – 2.7)
export default function WhyJoinEditor({ initial }: { initial: IconCard[] }) {
  return (
    <IconCardEditor
      initial={initial}
      config={{
        path: "main.whyJoin",
        title: "Lý do tham gia",
        noun: "lý do",
        itemLabel: "Lý do",
        addLabel: "Thêm lý do",
        suggestions: ["🤝", "🌱", "💚", "✨", "🫶", "🌏", "🎯", "🧡", "🌟"],
        defaultIcon: "🤝",
        titlePlaceholder: "Vd: Kết nối những trái tim",
        descPlaceholder:
          "Gặp gỡ, đồng hành cùng những người trẻ giàu nhiệt huyết và tấm lòng thiện nguyện.",
        descHint: "Nên giữ khoảng 1–2 câu để các thẻ lý do cân đối với nhau.",
      }}
    />
  );
}
