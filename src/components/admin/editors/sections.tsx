"use client";

// Các phần biên tập dùng chung giữa editor trang chính (Thư viện ảnh, Nhà tài
// trợ) và PastYearsEditor. Mỗi phần là 1 ListEditor "controlled"
// (nhận value/onChange) + validator đi kèm — tránh lặp code giữa hai nơi.
import { Input, Space, Switch, Tag } from "antd";
import { ListEditor, Field, ImageField } from "../editorKit";
import type { Photo, Sponsor, SponsorTier } from "@/lib/content/schema";

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

/** Website tuỳ chọn nhưng nếu nhập thì phải là URL http/https tuyệt đối. */
export function isValidUrl(url: string): boolean {
  if (!url.trim()) return true; // bỏ trống là hợp lệ (trường tuỳ chọn)
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
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
  return (
    <ListEditor<Photo>
      value={value}
      onChange={onChange}
      addLabel="Thêm ảnh"
      newItem={() => ({ src: "", caption: "", desc: "", tall: false })}
      renderItem={(item, updateItem, index) => {
        const missing = missingPhotoFields(item);
        return (
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
              <Field label={`Ảnh #${index + 1}`} hint="Tải ảnh từ máy hoặc dán URL sẵn có.">
                <ImageField
                  value={item.src}
                  folder={folder}
                  onChange={(src) => updateItem({ ...item, src })}
                />
              </Field>

              <div>
                <Field label="Chú thích" hint="Dòng chữ ngắn hiện trên ảnh.">
                  <Input
                    value={item.caption ?? ""}
                    placeholder="Đêm hội trăng rằm"
                    onChange={(e) => updateItem({ ...item, caption: e.target.value })}
                  />
                </Field>

                <Field label="Mô tả" hint="Mô tả chi tiết hơn (tuỳ chọn).">
                  <Input.TextArea
                    value={item.desc ?? ""}
                    rows={3}
                    placeholder="Các em nhỏ rước đèn quanh sân trường…"
                    onChange={(e) => updateItem({ ...item, desc: e.target.value })}
                  />
                </Field>

                <Field label="Ảnh cao" hint="Ảnh chiếm 2 hàng trong lưới masonry.">
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
    <ListEditor<SponsorTier>
      value={value}
      onChange={onChange}
      addLabel="Thêm hạng tài trợ"
      newItem={() => ({ tier: "", sponsors: [] })}
      renderItem={(tier, updateTier) => {
        const missing = missingTierFields(tier);
        return (
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
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
                renderItem={(sponsor, updateSponsor) => {
                  const missingSponsor = missingSponsorFields(sponsor);
                  const url = sponsor.url ?? "";
                  const urlOk = isValidUrl(url);
                  return (
                    <Space direction="vertical" size={0} style={{ width: "100%" }}>
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
                          hint="Tuỳ chọn. Dán đầy đủ, ví dụ https://abc.vn"
                        >
                          <Input
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

                      <Field label="Giới thiệu ngắn" hint="Tuỳ chọn. Hiển thị khi người xem bấm vào logo.">
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
                          Cần điền {missingSponsor.join(", ")}.
                        </div>
                      ) : null}
                      {!urlOk ? (
                        <div className="text-xs text-red-500">
                          Website phải bắt đầu bằng http:// hoặc https://.
                        </div>
                      ) : null}
                    </Space>
                  );
                }}
              />
            </div>

            {missing.length > 0 ? (
              <div className="text-xs text-red-500">
                Cần điền {missing.join(", ")}.
              </div>
            ) : null}
          </Space>
        );
      }}
    />
  );
}
