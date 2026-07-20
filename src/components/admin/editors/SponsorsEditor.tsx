"use client";

import { Alert } from "antd";
import { useSectionAutosave, SaveStatusTag, EditorCard } from "../editorKit";
import {
  SponsorTierListEditor,
  missingTierFields,
  missingSponsorFields,
} from "./sections";
import type { SponsorTier } from "@/lib/content/schema";

// Nhà tài trợ — main.sponsorTiers
export default function SponsorsEditor({ initial }: { initial: SponsorTier[] }) {
  const {
    value: tiers,
    update: updateTiers,
    status,
  } = useSectionAutosave<SponsorTier[]>("main.sponsorTiers", initial);

  // Tổng hợp cảnh báo cho toàn danh sách (hiện ở đầu thẻ).
  const invalidTiers = tiers.filter(
    (t) =>
      missingTierFields(t).length > 0 ||
      t.sponsors.some((s) => missingSponsorFields(s).length > 0)
  ).length;
  const totalSponsors = tiers.reduce((sum, t) => sum + t.sponsors.length, 0);

  return (
    <EditorCard title="Nhà tài trợ" extra={<SaveStatusTag status={status} />}>
      {invalidTiers > 0 ? (
        <Alert
          type="warning"
          showIcon
          className="mb-3"
          title={`Có ${invalidTiers} hạng tài trợ chưa điền đủ thông tin.`}
          description="Mỗi hạng cần có tên và ít nhất một đơn vị; mỗi đơn vị cần có tên."
        />
      ) : null}

      <div className="mb-3 text-xs opacity-60">
        Hiện ở mục &ldquo;Cảm ơn những tấm lòng vàng&rdquo; trên{" "}
        <strong>trang Gây quỹ</strong>. Đang có {totalSponsors} đơn vị trong{" "}
        {tiers.length} hạng tài trợ — thứ tự các hạng ở đây cũng là thứ tự khách
        nhìn thấy. Chưa có hạng nào thì mục này tự ẩn.
      </div>

      <SponsorTierListEditor value={tiers} onChange={updateTiers} />
    </EditorCard>
  );
}
