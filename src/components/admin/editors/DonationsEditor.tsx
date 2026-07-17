"use client";

import { useState } from "react";
import { Input } from "antd";
import { EditorLayout, ListEditor, useSectionAutosave } from "@/components/admin/editorKit";
import type { Donation } from "@/lib/content/schema";

export default function DonationsEditor({ initial }: { initial: Donation[] }) {
  const [donations, setDonations] = useState<Donation[]>(initial);
  const { status, savedCount } = useSectionAutosave("donations", donations);

  return (
    <EditorLayout
      title="Danh sách đóng góp"
      status={status}
      savedCount={savedCount}
      previewPath="/dong-gop"
    >
      <ListEditor<Donation>
        value={donations}
        onChange={setDonations}
        itemTitle={(d) => d.name}
        newItem={() => ({ name: "Nhà hảo tâm", amount: "", gift: "", date: "" })}
        renderItem={(d, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <Input addonBefore="Tên" value={d.name} onChange={(e) => patch({ name: e.target.value })} />
            <Input
              addonBefore="Số tiền"
              value={d.amount}
              onChange={(e) => patch({ amount: e.target.value })}
              placeholder="2.000.000đ (để trống nếu hiện vật)"
            />
            <Input
              addonBefore="Hiện vật"
              value={d.gift}
              onChange={(e) => patch({ gift: e.target.value })}
              placeholder="50 phần quà (tuỳ chọn)"
            />
            <Input
              addonBefore="Ngày"
              value={d.date}
              onChange={(e) => patch({ date: e.target.value })}
              placeholder="20/09/2025"
            />
          </div>
        )}
      />
    </EditorLayout>
  );
}
