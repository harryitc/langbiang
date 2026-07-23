"use client";

// Các phần biên tập dùng chung giữa editor trang chính (Thư viện ảnh, Nhà tài
// trợ) và PastYearsEditor. Mỗi phần là 1 ListEditor "controlled"
// (nhận value/onChange) + validator đi kèm — tránh lặp code giữa hai nơi.
import { Button, Input, Modal, Space, Switch, Tag } from "antd";
import { useState } from "react";
import { PictureOutlined } from "@ant-design/icons";
import MediaBrowser from "../MediaBrowser";
import { ListEditor, Field, ImageField, LinkInput, isValidUrl } from "../editorKit";
import { ItemListEditor } from "../itemList";
import type {
  Photo,
  Sponsor,
  SponsorTier,
  SpendingReport,
} from "@/lib/content/schema";

/* ------------------------------------------------------------------
   Validators (FR2/FR4) — dùng chung
   ------------------------------------------------------------------ */
/** FR2-2.6 / FR4: bắt buộc có ảnh. */
export function missingPhotoFields(photo: Photo): string[] {
  return photo.src.trim() ? [] : ["ảnh"];
}

/** FR2-2.11: tên hạng bắt buộc + ít nhất một đơn vị. */
export function missingTierFields(tier: SponsorTier): string[] {
  const missing: string[] = [];
  if (!tier.tier.trim()) missing.push("tên hạng tài trợ");
  if (tier.sponsors.length === 0) missing.push("ít nhất một đơn vị");
  return missing;
}

/** FR2-2.11: tên đơn vị tài trợ là bắt buộc. */
export function missingSponsorFields(sponsor: Sponsor): string[] {
  return sponsor.name.trim() ? [] : ["tên đơn vị"];
}

/**
 * Website tuỳ chọn nhưng nếu nhập thì phải là URL http/https tuyệt đối.
 * Hàm nay ở editorKit để dùng chung; giữ lại chỗ export này cho các nơi
 * đang import từ sections.
 */
export { isValidUrl };

/* ------------------------------------------------------------------
   Báo cáo thu – chi (link Google Sheet) — dùng cho mùa hiện tại và từng năm
   ------------------------------------------------------------------ */
export function SpendingFields({
  value,
  onChange,
}: {
  value: SpendingReport;
  onChange: (next: SpendingReport) => void;
}) {
  const urlOk = isValidUrl(value.url);
  return (
    <>
      <Field
        label="Liên kết Google Sheet"
        hint="Khách bấm nút là mở thẳng bảng thu – chi này. Nhớ đặt quyền chia sẻ “Bất kỳ ai có đường liên kết đều xem được”, nếu không khách sẽ bị chặn."
      >
        <LinkInput
          value={value.url}
          placeholder="https://docs.google.com/spreadsheets/d/..."
          status={urlOk ? "" : "error"}
          onChange={(e) => onChange({ ...value, url: e.target.value })}
        />
        {!urlOk ? (
          <div className="mt-1 text-xs text-red-500">
            Liên kết cần bắt đầu bằng https:// — chép lại từ thanh địa chỉ trình
            duyệt.
          </div>
        ) : null}
      </Field>

      <Field
        label="Ghi chú ngắn"
        hint="Câu giải thích hiện ngay phía trên nút bấm."
      >
        <Input.TextArea
          value={value.note ?? ""}
          rows={3}
          maxLength={300}
          showCount
          placeholder="Toàn bộ khoản thu – chi của mùa này được cập nhật công khai trên Google Sheet."
          onChange={(e) => onChange({ ...value, note: e.target.value })}
        />
      </Field>
    </>
  );
}

/* ------------------------------------------------------------------
   Thư viện ảnh — Photo[]
   ------------------------------------------------------------------ */
export function PhotoListEditor({
  value,
  onChange,
  folder = "gallery",
}: {
  value: Photo[];
  onChange: (next: Photo[]) => void;
  folder?: string;
}) {
  const [pickOpen, setPickOpen] = useState(false);

  /** Thêm hàng loạt ảnh chọn từ kho (bỏ qua ảnh đã có trong danh sách). */
  const addMany = (urls: string[]) => {
    const daCo = new Set(value.map((p) => p.src));
    const them = urls
      .filter((u) => !daCo.has(u))
      .map((src) => ({ src, caption: "", desc: "", tall: false }));
    onChange([...value, ...them]);
    setPickOpen(false);
  };

  return (
    <>
      <Button
        icon={<PictureOutlined />}
        className="mb-3 cursor-pointer"
        onClick={() => setPickOpen(true)}
      >
        Thêm nhiều ảnh từ kho
      </Button>

      <Modal
        open={pickOpen}
        onCancel={() => setPickOpen(false)}
        width={960}
        centered
        maskClosable={false}
        footer={null}
        destroyOnHidden
        title="Chọn ảnh từ kho — có thể chọn nhiều hoặc cả album"
      >
        <MediaBrowser mode="pick" multiple onPickMany={addMany} />
      </Modal>

    <ListEditor<Photo>
      value={value}
      onChange={onChange}
      addLabel="Thêm ảnh"
      newItem={() => ({ src: "", caption: "", desc: "", tall: false })}
      getSummary={(item, i) => item.caption?.trim() || `Ảnh #${i + 1}`}
      renderItem={(item, updateItem, index) => {
        const missing = missingPhotoFields(item);
        return (
          <Space orientation="vertical" size={0} style={{ width: "100%" }}>
            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
              <Field
                label={`Ảnh #${index + 1}`}
                hint="Chọn ảnh từ kho ảnh, hoặc dán đường dẫn ảnh có sẵn."
              >
                <ImageField
                  value={item.src}
                  folder={folder}
                  onChange={(src) => updateItem({ ...item, src })}
                />
              </Field>

              <div>
                <Field label="Chú thích" hint="Dòng chữ ngắn hiện đè trên ảnh.">
                  <Input
                    value={item.caption ?? ""}
                    placeholder="Đêm hội trăng rằm"
                    onChange={(e) => updateItem({ ...item, caption: e.target.value })}
                  />
                </Field>

                <Field
                  label="Mô tả"
                  hint="Tuỳ chọn. Hiện khi khách bấm vào ảnh để xem lớn."
                >
                  <Input.TextArea
                    value={item.desc ?? ""}
                    rows={3}
                    placeholder="Các em nhỏ rước đèn quanh sân trường…"
                    onChange={(e) => updateItem({ ...item, desc: e.target.value })}
                  />
                </Field>

                <Field
                  label="Ảnh cao"
                  hint="Cho ảnh chiếm 2 hàng trong lưới ảnh — hợp với ảnh chụp dọc."
                >
                  <Switch
                    checked={!!item.tall}
                    onChange={(tall) => updateItem({ ...item, tall })}
                  />
                </Field>
              </div>
            </div>

            {missing.length > 0 ? (
              <div className="text-xs text-red-500">Cần chọn ảnh.</div>
            ) : (
              <div className="text-xs opacity-60">
                Hiển thị: {item.caption || "(chưa có chú thích)"}
                {item.tall ? " — ảnh cao" : ""}
              </div>
            )}
          </Space>
        );
      }}
      />
    </>
  );
}

/* ------------------------------------------------------------------
   Nhà tài trợ — SponsorTier[]
   ------------------------------------------------------------------ */
export function SponsorTierListEditor({
  value,
  onChange,
}: {
  value: SponsorTier[];
  onChange: (next: SponsorTier[]) => void;
}) {
  return (
    <ItemListEditor<SponsorTier>
      value={value}
      onChange={onChange}
      addLabel="Thêm hạng tài trợ"
      drawerTitle="Hạng tài trợ"
      newItem={() => ({ tier: "", sponsors: [] })}
      getRow={(tier) => ({
        title: tier.tier || "(chưa đặt tên hạng)",
        subtitle: tier.sponsors.map((s) => s.name).filter(Boolean).join(", ") || undefined,
        thumb: tier.sponsors.find((s) => s.logo)?.logo || undefined,
        tags: [{ text: `${tier.sponsors.length} đơn vị` }],
        invalid:
          missingTierFields(tier).length > 0 ||
          tier.sponsors.some((s) => missingSponsorFields(s).length > 0),
      })}
      renderForm={(tier, updateTier) => {
        const missing = missingTierFields(tier);
        return (
          <Space orientation="vertical" size={4} style={{ width: "100%" }}>
            <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <Field label="Tên hạng tài trợ">
                <Input
                  value={tier.tier}
                  placeholder="Nhà tài trợ Kim cương"
                  status={tier.tier.trim() ? "" : "error"}
                  onChange={(e) => updateTier({ ...tier, tier: e.target.value })}
                />
              </Field>
              <div className="mb-[14px]">
                <Tag color="blue">{tier.sponsors.length} đơn vị</Tag>
              </div>
            </div>

            <div className="rounded-lg border border-black/10 p-3">
              <ListEditor<Sponsor>
                title="Các đơn vị trong hạng"
                value={tier.sponsors}
                onChange={(sponsors) => updateTier({ ...tier, sponsors })}
                addLabel="Thêm đơn vị"
                newItem={() => ({ name: "", logo: "", url: "", intro: "" })}
                getSummary={(s) => s.name || "(chưa có tên đơn vị)"}
                renderItem={(sponsor, updateSponsor) => {
                  const missingSponsor = missingSponsorFields(sponsor);
                  const url = sponsor.url ?? "";
                  const urlOk = isValidUrl(url);
                  return (
                    <Space orientation="vertical" size={0} style={{ width: "100%" }}>
                      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                        <Field label="Tên đơn vị">
                          <Input
                            value={sponsor.name}
                            placeholder="Công ty ABC"
                            status={sponsor.name.trim() ? "" : "error"}
                            onChange={(e) =>
                              updateSponsor({ ...sponsor, name: e.target.value })
                            }
                          />
                        </Field>
                        <Field
                          label="Website"
                          hint="Tuỳ chọn. Dán đầy đủ, vd https://abc.vn — khách bấm logo sẽ mở trang này."
                        >
                          <LinkInput
                            value={url}
                            placeholder="https://abc.vn"
                            status={urlOk ? "" : "error"}
                            onChange={(e) =>
                              updateSponsor({ ...sponsor, url: e.target.value })
                            }
                          />
                        </Field>
                      </div>

                      <Field
                        label="Logo"
                        hint="Tuỳ chọn. Bỏ trống thì trang sẽ hiện chữ viết tắt tên đơn vị."
                      >
                        <ImageField
                          value={sponsor.logo ?? ""}
                          folder="sponsors"
                          onChange={(logo) => updateSponsor({ ...sponsor, logo })}
                        />
                      </Field>

                      <Field
                        label="Giới thiệu ngắn"
                        hint="Tuỳ chọn. Hiện ra khi khách bấm vào logo đơn vị."
                      >
                        <Input.TextArea
                          value={sponsor.intro ?? ""}
                          rows={2}
                          maxLength={300}
                          showCount
                          placeholder="Đơn vị đồng hành cùng chương trình từ mùa đầu tiên…"
                          onChange={(e) =>
                            updateSponsor({ ...sponsor, intro: e.target.value })
                          }
                        />
                      </Field>

                      {missingSponsor.length > 0 ? (
                        <div className="text-xs text-red-500">
                          Còn thiếu: {missingSponsor.join(", ")}.
                        </div>
                      ) : null}
                      {!urlOk ? (
                        <div className="text-xs text-red-500">
                          Website cần bắt đầu bằng https:// — chép lại từ thanh
                          địa chỉ trình duyệt.
                        </div>
                      ) : null}
                    </Space>
                  );
                }}
              />
            </div>

            {missing.length > 0 ? (
              <div className="text-xs text-red-500">
                Còn thiếu: {missing.join(", ")}.
              </div>
            ) : null}
          </Space>
        );
      }}
    />
  );
}
