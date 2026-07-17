"use client";

import { useState, useTransition } from "react";
import { publishAction } from "@/lib/content/actions";

export default function PublishButton() {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  const publish = () => {
    startTransition(async () => {
      const res = await publishAction();
      if (res.ok) {
        setDone(true);
        setTimeout(() => setDone(false), 2500);
      } else {
        alert("Xuất bản thất bại. Vui lòng thử lại.");
      }
    });
  };

  return (
    <button
      type="button"
      onClick={publish}
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
    >
      {pending ? "Đang xuất bản…" : done ? "✓ Đã xuất bản" : "Xuất bản"}
    </button>
  );
}
