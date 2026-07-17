"use client";

import { Alert, Input, Space, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
  ImageField,
} from "../editorKit";
import type { Sponsor, SponsorTier } from "@/lib/content/schema";

/** FR2-2.11: tên hạng tài trợ là bắt buộc; mỗi hạng nên có ít nhất 1 đơn vị. */
function missingTierFields(tier: SponsorTier): string[] {
  const missing: string[] = [];
  if (!tier.tier.trim()) missing.push("tên hạng tài trợ");
  if (tier.sponsors.length === 0) missing.push("ít nhất một đơn vị");
  return missing;
}

/** FR2-2.11: tên đơn vị là bắt buộc; logo / website / giới thiệu là tuỳ chọn. */
function missingSponsorFields(sponsor: Sponsor): string[] {
  const missing: string[] = [];
  if (!sponsor.name.trim()) missing.push("tên đơn vị");
  return missing;
}

/** Website phải là URL tuyệt đối (http/https) nếu có nhập. */
function isValidUrl(url: string): boolean {
  if (!url.trim()) return true; // bỏ trống là hợp lệ (trường tuỳ chọn)
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

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
    <EditorCard
      title="Nhà tài trợ"
      extra={<SaveStatusTag status={status} />}
    >
      {invalidTiers > 0 ? (
        <Alert
          type="warning"
          showIcon
          className="mb-3"
          message={`Có ${invalidTiers} hạng tài trợ chưa điền đủ thông tin.`}
        />
      ) : null}

      <div className="mb-3 text-xs opacity-60">
        Đang có {totalSponsors} đơn vị trong {tiers.length} hạng tài trợ. Thứ tự
        các hạng cũng là thứ tự hiển thị trên trang.
      </div>

      <ListEditor<SponsorTier>
        value={tiers}
        onChange={updateTiers}
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
                    onChange={(e) =>
                      updateTier({ ...tier, tier: e.target.value })
                    }
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
                      <Space
                        direction="vertical"
                        size={0}
                        style={{ width: "100%" }}
                      >
                        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                          <Field label="Tên đơn vị">
                            <Input
                              value={sponsor.name}
                              placeholder="Công ty ABC"
                              status={sponsor.name.trim() ? "" : "error"}
                              onChange={(e) =>
                                updateSponsor({
                                  ...sponsor,
                                  name: e.target.value,
                                })
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
                                updateSponsor({
                                  ...sponsor,
                                  url: e.target.value,
                                })
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
                            onChange={(logo) =>
                              updateSponsor({ ...sponsor, logo })
                            }
                          />
                        </Field>

                        <Field
                          label="Giới thiệu ngắn"
                          hint="Tuỳ chọn. Hiển thị khi người xem bấm vào logo."
                        >
                          <Input.TextArea
                            value={sponsor.intro ?? ""}
                            rows={2}
                            maxLength={300}
                            showCount
                            placeholder="Đơn vị đồng hành cùng chương trình từ mùa đầu tiên…"
                            onChange={(e) =>
                              updateSponsor({
                                ...sponsor,
                                intro: e.target.value,
                              })
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
    </EditorCard>
  );
}
