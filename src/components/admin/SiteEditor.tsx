"use client";

import { useState } from "react";
import { Input } from "antd";
import { EditorLayout, Field, useSectionAutosave } from "./editorKit";
import type { SiteMeta } from "@/lib/content/schema";

export default function SiteEditor({ initial }: { initial: SiteMeta }) {
  const [meta, setMeta] = useState<SiteMeta>(initial);
  const { status, savedCount } = useSectionAutosave("site", meta);
  const patch = (p: Partial<SiteMeta>) => setMeta((m) => ({ ...m, ...p }));

  return (
    <EditorLayout
      title="Thông tin & SEO"
      description="Ảnh hưởng tiêu đề trang, mô tả và thẻ chia sẻ mạng xã hội. Xem trước trang chủ bên phải."
      status={status}
      savedCount={savedCount}
      previewPath="/"
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Tên dự án">
          <Input value={meta.name} onChange={(e) => patch({ name: e.target.value })} />
        </Field>
        <Field label="Tên rút gọn">
          <Input value={meta.shortName} onChange={(e) => patch({ shortName: e.target.value })} />
        </Field>
      </div>
      <Field label="Tagline">
        <Input value={meta.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
      </Field>
      <Field label="Phụ đề">
        <Input value={meta.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Nhãn ngày (hiển thị)">
          <Input value={meta.dateLabel} onChange={(e) => patch({ dateLabel: e.target.value })} />
        </Field>
        <Field label="Ngày (ISO)" hint="VD 2026-09-26">
          <Input value={meta.dateISO} onChange={(e) => patch({ dateISO: e.target.value })} />
        </Field>
      </div>
      <Field label="Địa điểm">
        <Input value={meta.location} onChange={(e) => patch({ location: e.target.value })} />
      </Field>
      <Field label="Mô tả (SEO / chia sẻ)" hint="~150–160 ký tự là đẹp">
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 4 }}
          value={meta.description}
          onChange={(e) => patch({ description: e.target.value })}
        />
      </Field>
      <Field label="Từ khoá" hint="Ngăn cách bằng dấu phẩy">
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 3 }}
          value={meta.keywords.join(", ")}
          onChange={(e) =>
            patch({ keywords: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
          }
        />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Field label="Facebook">
          <Input value={meta.facebook} onChange={(e) => patch({ facebook: e.target.value })} />
        </Field>
        <Field label="Email">
          <Input value={meta.email} onChange={(e) => patch({ email: e.target.value })} />
        </Field>
      </div>
      <Field label="Link gian hàng Shopee">
        <Input value={meta.shopee} onChange={(e) => patch({ shopee: e.target.value })} />
      </Field>
    </EditorLayout>
  );
}
