"use client";

import { Alert, Input } from "antd";
import { useSectionAutosave, SaveStatusTag, EditorCard, Field } from "../editorKit";
import {
  SponsorTierListEditor,
  missingTierFields,
  missingSponsorFields,
} from "./sections";
import type { SponsorTier, SponsorsHeader } from "@/lib/content/schema";

// Trình biên tập Nhà tài trợ — main.sponsorTiers & main.sponsorsHeader
export default function SponsorsEditor({
  initialTiers,
  initialHeader,
}: {
  initialTiers: SponsorTier[];
  initialHeader?: SponsorsHeader;
}) {
  const {
    value: tiers,
    update: updateTiers,
    status: tiersStatus,
  } = useSectionAutosave<SponsorTier[]>("main.sponsorTiers", initialTiers);

  const {
    value: header,
    update: updateHeader,
    status: headerStatus,
  } = useSectionAutosave<SponsorsHeader>("main.sponsorsHeader", initialHeader ?? {
    eyebrow: "Đơn vị đồng hành",
    title: "Cảm ơn những",
    titleHighlight: "tấm lòng vàng",
    desc: "Sự đồng hành của các đơn vị dưới đây giúp ánh trăng của chúng mình toả sáng hơn.",
  });

  // Tổng hợp cảnh báo cho toàn danh sách (hiện ở đầu thẻ).
  const invalidTiers = tiers.filter(
    (t) =>
      missingTierFields(t).length > 0 ||
      t.sponsors.some((s) => missingSponsorFields(s).length > 0)
  ).length;
  const totalSponsors = tiers.reduce((sum, t) => sum + t.sponsors.length, 0);

  return (
    <>
      <EditorCard
        title="Tiêu đề & Mô tả mục Nhà tài trợ (Trang chủ & Gây quỹ)"
        extra={<SaveStatusTag status={headerStatus} />}
      >
        <Field label="Nhãn phụ" hint="Chữ nhỏ in hoa màu cam phía trên tiêu đề lớn. Vd: Đơn vị đồng hành">
          <Input
            value={header.eyebrow ?? ""}
            placeholder="Vd: Đơn vị đồng hành"
            onChange={(e) => updateHeader({ ...header, eyebrow: e.target.value })}
          />
        </Field>

        <Field label="Tiêu đề chính (Nửa đầu)" hint="Chữ tiêu đề màu mặc định. Vd: Cảm ơn những">
          <Input
            value={header.title ?? ""}
            placeholder="Vd: Cảm ơn những"
            onChange={(e) => updateHeader({ ...header, title: e.target.value })}
          />
        </Field>

        <Field label="Tiêu đề nổi bật (Nửa sau)" hint="Chữ tiêu đề được tô màu gradient cam/vàng. Vd: tấm lòng vàng">
          <Input
            value={header.titleHighlight ?? ""}
            placeholder="Vd: tấm lòng vàng"
            onChange={(e) => updateHeader({ ...header, titleHighlight: e.target.value })}
          />
        </Field>

        <Field label="Mô tả" hint="Đoạn văn giới thiệu ngắn dưới tiêu đề.">
          <Input.TextArea
            value={header.desc ?? ""}
            rows={2}
            showCount
            maxLength={250}
            placeholder="Sự đồng hành của các đơn vị dưới đây giúp ánh trăng của chúng mình toả sáng hơn."
            onChange={(e) => updateHeader({ ...header, desc: e.target.value })}
          />
        </Field>
      </EditorCard>

      <EditorCard
        title="Danh sách Hạng tài trợ"
        extra={<SaveStatusTag status={tiersStatus} />}
      >
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
          Hiện ở mục Nhà tài trợ trên <strong>trang Gây quỹ và Trang chủ</strong>. Đang có {totalSponsors} đơn vị trong{" "}
          {tiers.length} hạng tài trợ — thứ tự các hạng ở đây cũng là thứ tự khách
          nhìn thấy. Chưa có hạng nào thì mục này tự ẩn.
        </div>

        <SponsorTierListEditor value={tiers} onChange={updateTiers} />
      </EditorCard>
    </>
  );
}
