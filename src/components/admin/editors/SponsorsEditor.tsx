"use client";

import { useState } from "react";
import { Input } from "antd";
import { EditorLayout, ListEditor, useSectionAutosave } from "@/components/admin/editorKit";
import type { Sponsor, SponsorTier } from "@/lib/content/schema";

export default function SponsorsEditor({ initial }: { initial: SponsorTier[] }) {
  const [tiers, setTiers] = useState<SponsorTier[]>(initial);
  const { status, savedCount } = useSectionAutosave("sponsorTiers", tiers);

  return (
    <EditorLayout
      title="Nhà tài trợ"
      description="Quản lý hạng tài trợ và danh sách nhà tài trợ trong mỗi hạng. Tự lưu nháp."
      status={status}
      savedCount={savedCount}
      previewPath="/2025"
    >
      <ListEditor<SponsorTier>
        value={tiers}
        onChange={setTiers}
        addLabel="Thêm hạng tài trợ"
        itemTitle={(t) => t.tier}
        newItem={() => ({ tier: "Hạng tài trợ mới", sponsors: [] })}
        renderItem={(t, patch) => (
          <div style={{ display: "grid", gap: 8 }}>
            <Input
              addonBefore="Tên hạng"
              value={t.tier}
              onChange={(e) => patch({ tier: e.target.value })}
            />
            <ListEditor<Sponsor>
              value={t.sponsors}
              onChange={(sponsors) => patch({ sponsors })}
              addLabel="Thêm nhà tài trợ"
              itemTitle={(s) => s.name}
              newItem={() => ({ name: "Nhà tài trợ", logo: "", url: "", intro: "" })}
              renderItem={(s, patchS) => (
                <div style={{ display: "grid", gap: 8 }}>
                  <Input
                    addonBefore="Tên"
                    value={s.name}
                    onChange={(e) => patchS({ name: e.target.value })}
                  />
                  <Input
                    addonBefore="Logo"
                    value={s.logo}
                    onChange={(e) => patchS({ logo: e.target.value })}
                    placeholder="/sponsors/abc.png"
                  />
                  <Input
                    addonBefore="Website"
                    value={s.url}
                    onChange={(e) => patchS({ url: e.target.value })}
                  />
                  <Input.TextArea
                    autoSize={{ minRows: 2 }}
                    value={s.intro}
                    onChange={(e) => patchS({ intro: e.target.value })}
                    placeholder="Giới thiệu ngắn"
                  />
                </div>
              )}
            />
          </div>
        )}
      />
    </EditorLayout>
  );
}
