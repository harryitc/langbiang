"use client";

import { Alert, Collapse, Input, InputNumber, Space, Switch, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
  ImageField,
  RichText,
} from "../editorKit";
import type {
  PastYear,
  Photo,
  Sponsor,
  SponsorTier,
  Stat,
  Team,
} from "@/lib/content/schema";

/** Năm mặc định cho mục mới: năm trước năm hiện tại theo lịch. */
function suggestYear(existing: PastYear[]): number {
  const base = new Date().getFullYear() - 1;
  const used = new Set(existing.map((y) => y.year));
  let candidate = base;
  while (used.has(candidate)) candidate -= 1;
  return candidate;
}

/** FR4-R1: năm phải là số 4 chữ số. */
function isValidYear(year: number): boolean {
  return Number.isInteger(year) && year >= 1000 && year <= 9999;
}

/** FR4-R1: năm không được trùng trong danh mục (năm là đường dẫn /{year}). */
function isDuplicateYear(years: PastYear[], index: number): boolean {
  const year = years[index]?.year;
  return years.some((y, i) => i !== index && y.year === year);
}

/** Trường bắt buộc của một năm đã qua: năm hợp lệ + tiêu đề. */
function missingYearFields(item: PastYear): string[] {
  const missing: string[] = [];
  if (!isValidYear(item.year)) missing.push("số năm (4 chữ số)");
  if (!item.title.trim()) missing.push("tiêu đề");
  return missing;
}

/** FR4: ảnh trong "Khoảnh khắc" là bắt buộc. */
function missingPhotoFields(photo: Photo): string[] {
  return photo.src.trim() ? [] : ["ảnh"];
}

/** Như 2.10: tên ban bắt buộc + ít nhất một thành viên. */
function missingTeamFields(team: Team): string[] {
  const missing: string[] = [];
  if (!team.name.trim()) missing.push("tên ban");
  if (team.members.filter((m) => m.trim()).length === 0)
    missing.push("ít nhất một thành viên");
  return missing;
}

/** Như 2.3: nhãn con số là bắt buộc. */
function missingStatFields(stat: Stat): string[] {
  return stat.label.trim() ? [] : ["nhãn"];
}

/** Như 2.11: tên hạng bắt buộc + ít nhất một đơn vị. */
function missingTierFields(tier: SponsorTier): string[] {
  const missing: string[] = [];
  if (!tier.tier.trim()) missing.push("tên hạng tài trợ");
  if (tier.sponsors.length === 0) missing.push("ít nhất một đơn vị");
  return missing;
}

/** Như 2.11: tên đơn vị tài trợ là bắt buộc. */
function missingSponsorFields(sponsor: Sponsor): string[] {
  return sponsor.name.trim() ? [] : ["tên đơn vị"];
}

/** Website tuỳ chọn nhưng nếu nhập thì phải là URL http/https. */
function isValidUrl(url: string): boolean {
  if (!url.trim()) return true;
  try {
    const parsed = new URL(url.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/** Đếm mọi lỗi trong một năm (dùng cho nhãn cảnh báo ở đầu mục). */
function countIssues(item: PastYear): number {
  return (
    missingYearFields(item).length +
    item.gallery.filter((p) => missingPhotoFields(p).length > 0).length +
    item.volunteerTeams.filter((t) => missingTeamFields(t).length > 0).length +
    item.stats.filter((s) => missingStatFields(s).length > 0).length +
    item.sponsorTiers.filter(
      (t) =>
        missingTierFields(t).length > 0 ||
        t.sponsors.some((s) => missingSponsorFields(s).length > 0)
    ).length
  );
}

/* ------------------------------------------------------------------
   Các phần con của một trang "Nhìn lại"
   ------------------------------------------------------------------ */

/** Phần 1 — Thông tin đầu trang. */
function HeaderSection({
  item,
  updateItem,
  duplicate,
}: {
  item: PastYear;
  updateItem: (next: PastYear) => void;
  duplicate: boolean;
}) {
  const yearOk = isValidYear(item.year) && !duplicate;
  return (
    <Space direction="vertical" size={0} style={{ width: "100%" }}>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[160px_1fr]">
        <Field label="Năm" hint="Là đường dẫn trang, ví dụ /2025.">
          <InputNumber
            value={item.year}
            min={1000}
            max={9999}
            precision={0}
            controls={false}
            style={{ width: "100%" }}
            placeholder="2025"
            status={yearOk ? "" : "error"}
            // Để trống ô số ⇒ quy về 0 (tránh NaN lọt vào bản nháp JSON).
            onChange={(v) =>
              updateItem({ ...item, year: typeof v === "number" ? v : 0 })
            }
          />
        </Field>
        <Field label="Tiêu đề">
          <Input
            value={item.title}
            placeholder="Nhìn lại Trăng Sáng Langbiang 2025"
            status={item.title.trim() ? "" : "error"}
            onChange={(e) => updateItem({ ...item, title: e.target.value })}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
        <Field label="Nhãn eyebrow" hint="Dòng chữ nhỏ phía trên tiêu đề (tuỳ chọn).">
          <Input
            value={item.eyebrow ?? ""}
            placeholder="Mùa 2025"
            onChange={(e) => updateItem({ ...item, eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Phụ đề" hint="Tuỳ chọn.">
          <Input
            value={item.subtitle ?? ""}
            placeholder="Một mùa trăng của yêu thương"
            onChange={(e) => updateItem({ ...item, subtitle: e.target.value })}
          />
        </Field>
      </div>

      <Field label="Ảnh nền" hint="Tuỳ chọn. Ảnh lớn hiển thị ở đầu trang.">
        <ImageField
          value={item.bgImage ?? ""}
          folder="past-years"
          onChange={(bgImage) => updateItem({ ...item, bgImage })}
        />
      </Field>

      {duplicate ? (
        <div className="text-xs text-red-500">
          Năm {item.year} đã tồn tại trong danh mục. Vui lòng đổi số năm khác.
        </div>
      ) : null}
    </Space>
  );
}

/** Phần 3 — Khoảnh khắc (thư viện ảnh). */
function GallerySection({
  item,
  updateItem,
}: {
  item: PastYear;
  updateItem: (next: PastYear) => void;
}) {
  return (
    <ListEditor<Photo>
      value={item.gallery}
      onChange={(gallery) => updateItem({ ...item, gallery })}
      addLabel="Thêm ảnh"
      newItem={() => ({ src: "", caption: "", desc: "", tall: false })}
      renderItem={(photo, updatePhoto, index) => {
        const missing = missingPhotoFields(photo);
        return (
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
              <Field label={`Ảnh #${index + 1}`} hint="Tải ảnh từ máy hoặc dán URL sẵn có.">
                <ImageField
                  value={photo.src}
                  folder="past-years"
                  onChange={(src) => updatePhoto({ ...photo, src })}
                />
              </Field>
              <div>
                <Field label="Chú thích" hint="Dòng chữ ngắn hiện trên ảnh.">
                  <Input
                    value={photo.caption ?? ""}
                    placeholder="Đêm hội trăng rằm"
                    onChange={(e) =>
                      updatePhoto({ ...photo, caption: e.target.value })
                    }
                  />
                </Field>
                <Field label="Mô tả" hint="Tuỳ chọn.">
                  <Input.TextArea
                    value={photo.desc ?? ""}
                    rows={2}
                    placeholder="Các em nhỏ rước đèn quanh sân trường…"
                    onChange={(e) =>
                      updatePhoto({ ...photo, desc: e.target.value })
                    }
                  />
                </Field>
                <Field label="Ảnh cao" hint="Ảnh chiếm 2 hàng trong lưới masonry.">
                  <Switch
                    checked={!!photo.tall}
                    onChange={(tall) => updatePhoto({ ...photo, tall })}
                  />
                </Field>
              </div>
            </div>
            {missing.length > 0 ? (
              <div className="text-xs text-red-500">Cần chọn ảnh.</div>
            ) : null}
          </Space>
        );
      }}
    />
  );
}

/** Phần 4 — Đại gia đình (TNV). */
function TeamsSection({
  item,
  updateItem,
}: {
  item: PastYear;
  updateItem: (next: PastYear) => void;
}) {
  return (
    <ListEditor<Team>
      value={item.volunteerTeams}
      onChange={(volunteerTeams) => updateItem({ ...item, volunteerTeams })}
      addLabel="Thêm ban"
      newItem={() => ({ name: "", members: [] })}
      renderItem={(team, updateTeam) => {
        const missing = missingTeamFields(team);
        return (
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[1fr_auto] sm:items-end">
              <Field label="Tên ban">
                <Input
                  value={team.name}
                  placeholder="Ban Hậu cần"
                  status={team.name.trim() ? "" : "error"}
                  onChange={(e) => updateTeam({ ...team, name: e.target.value })}
                />
              </Field>
              <div className="mb-[14px]">
                <Tag color="blue">{team.members.length} thành viên</Tag>
              </div>
            </div>

            <div className="rounded-lg border border-black/10 p-3">
              <ListEditor<string>
                title="Danh sách thành viên"
                value={team.members}
                onChange={(members) => updateTeam({ ...team, members })}
                addLabel="Thêm thành viên"
                newItem={() => ""}
                renderItem={(member, updateMember, index) => (
                  <Input
                    value={member}
                    placeholder={`Họ và tên thành viên ${index + 1}`}
                    status={member.trim() ? "" : "error"}
                    onChange={(e) => updateMember(e.target.value)}
                  />
                )}
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

/** Phần 5 — Những con số. */
function StatsSection({
  item,
  updateItem,
}: {
  item: PastYear;
  updateItem: (next: PastYear) => void;
}) {
  return (
    <ListEditor<Stat>
      value={item.stats}
      onChange={(stats) => updateItem({ ...item, stats })}
      addLabel="Thêm con số"
      newItem={() => ({ value: 0, suffix: "", label: "" })}
      renderItem={(stat, updateStat) => {
        const missing = missingStatFields(stat);
        return (
          <Space direction="vertical" size={0} style={{ width: "100%" }}>
            <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[140px_140px_1fr]">
              <Field label="Giá trị số">
                <InputNumber
                  value={stat.value}
                  min={0}
                  precision={0}
                  style={{ width: "100%" }}
                  placeholder="200"
                  // Để trống ô số ⇒ quy về 0 (tránh NaN lọt vào bản nháp JSON).
                  onChange={(v) =>
                    updateStat({ ...stat, value: typeof v === "number" ? v : 0 })
                  }
                />
              </Field>
              <Field label="Hậu tố" hint='Ví dụ: "+" hoặc " ngày"'>
                <Input
                  value={stat.suffix}
                  placeholder="+"
                  onChange={(e) => updateStat({ ...stat, suffix: e.target.value })}
                />
              </Field>
              <Field label="Nhãn">
                <Input
                  value={stat.label}
                  placeholder="Em nhỏ nhận quà"
                  status={stat.label.trim() ? "" : "error"}
                  onChange={(e) => updateStat({ ...stat, label: e.target.value })}
                />
              </Field>
            </div>
            {missing.length > 0 ? (
              <div className="text-xs text-red-500">
                Cần điền {missing.join(", ")}.
              </div>
            ) : (
              <div className="text-xs opacity-60">
                Hiển thị: {stat.value}
                {stat.suffix} — {stat.label}
              </div>
            )}
          </Space>
        );
      }}
    />
  );
}

/** Phần 6 — Nhà tài trợ. */
function SponsorsSection({
  item,
  updateItem,
}: {
  item: PastYear;
  updateItem: (next: PastYear) => void;
}) {
  return (
    <ListEditor<SponsorTier>
      value={item.sponsorTiers}
      onChange={(sponsorTiers) => updateItem({ ...item, sponsorTiers })}
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

                      <Field label="Giới thiệu ngắn" hint="Tuỳ chọn.">
                        <Input.TextArea
                          value={sponsor.intro ?? ""}
                          rows={2}
                          maxLength={300}
                          showCount
                          placeholder="Đơn vị đồng hành cùng chương trình…"
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

/* ------------------------------------------------------------------
   Editor chính — Danh mục năm đã qua (pastYears)
   ------------------------------------------------------------------ */
export default function PastYearsEditor({ initial }: { initial: PastYear[] }) {
  const { value: years, update, status } = useSectionAutosave<PastYear[]>(
    "pastYears",
    initial
  );

  // Tổng hợp cảnh báo cho toàn danh mục (hiện ở đầu thẻ).
  const invalidCount = years.filter((y, i) =>
    countIssues(y) > 0 || isDuplicateYear(years, i)
  ).length;
  const duplicateYears = Array.from(
    new Set(
      years
        .filter((_, i) => isDuplicateYear(years, i))
        .map((y) => y.year)
    )
  );

  return (
    <EditorCard
      title="Danh mục năm đã qua"
      extra={
        <Space size={8}>
          <Tag>{years.length} năm</Tag>
          <SaveStatusTag status={status} />
        </Space>
      }
    >
      <p className="mb-3 text-sm opacity-60">
        Mỗi năm là một trang &ldquo;Nhìn lại&rdquo; riêng tại đường dẫn{" "}
        <code>/{"{năm}"}</code>, và xuất hiện trong dropdown &ldquo;Năm&rdquo; ở
        đầu trang (mới → cũ). Phần nào để trống sẽ tự ẩn trên giao diện. Danh
        mục này độc lập với &ldquo;số năm hiện tại&rdquo;.
      </p>

      {duplicateYears.length > 0 ? (
        <Alert
          type="error"
          showIcon
          className="mb-3"
          message={`Năm ${duplicateYears.join(", ")} bị trùng trong danh mục. Mỗi năm chỉ được có một trang.`}
        />
      ) : null}

      {invalidCount > 0 ? (
        <Alert
          type="warning"
          showIcon
          className="mb-3"
          message={`Có ${invalidCount} năm chưa điền đủ thông tin bắt buộc.`}
        />
      ) : null}

      <ListEditor<PastYear>
        value={years}
        onChange={update}
        addLabel="Thêm năm đã qua"
        newItem={() => ({
          year: suggestYear(years),
          title: "",
          subtitle: "",
          eyebrow: "",
          bgImage: "",
          summaryHtml: "",
          gallery: [],
          volunteerTeams: [],
          stats: [],
          sponsorTiers: [],
        })}
        renderItem={(item, updateItem, index) => {
          const duplicate = isDuplicateYear(years, index);
          const issues = countIssues(item) + (duplicate ? 1 : 0);
          return (
            <Space direction="vertical" size={4} style={{ width: "100%" }}>
              <div className="flex flex-wrap items-center gap-2">
                <strong className="text-base">
                  {isValidYear(item.year) ? `Nhìn lại ${item.year}` : "Năm mới"}
                </strong>
                {item.title.trim() ? (
                  <span className="text-xs opacity-60">— {item.title}</span>
                ) : null}
                {issues > 0 ? (
                  <Tag color="error">{issues} chỗ cần sửa</Tag>
                ) : (
                  <Tag color="success">Đầy đủ</Tag>
                )}
              </div>

              <Collapse
                size="small"
                items={[
                  {
                    key: "header",
                    label: "Thông tin đầu trang",
                    children: (
                      <HeaderSection
                        item={item}
                        updateItem={updateItem}
                        duplicate={duplicate}
                      />
                    ),
                  },
                  {
                    key: "summary",
                    label: "Tổng kết",
                    extra: item.summaryHtml.trim() ? null : (
                      <Tag>Đang trống</Tag>
                    ),
                    children: (
                      <Field
                        label="Nội dung tổng kết"
                        hint="Để trống thì phần Tổng kết sẽ được ẩn trên trang."
                      >
                        <RichText
                          value={item.summaryHtml}
                          folder="past-years"
                          onChange={(summaryHtml) =>
                            updateItem({ ...item, summaryHtml })
                          }
                        />
                      </Field>
                    ),
                  },
                  {
                    key: "gallery",
                    label: `Khoảnh khắc (${item.gallery.length} ảnh)`,
                    children: (
                      <GallerySection item={item} updateItem={updateItem} />
                    ),
                  },
                  {
                    key: "teams",
                    label: `Đại gia đình (${item.volunteerTeams.length} ban)`,
                    children: (
                      <TeamsSection item={item} updateItem={updateItem} />
                    ),
                  },
                  {
                    key: "stats",
                    label: `Những con số (${item.stats.length} mục)`,
                    children: (
                      <StatsSection item={item} updateItem={updateItem} />
                    ),
                  },
                  {
                    key: "sponsors",
                    label: `Nhà tài trợ (${item.sponsorTiers.length} hạng)`,
                    children: (
                      <SponsorsSection item={item} updateItem={updateItem} />
                    ),
                  },
                ]}
              />
            </Space>
          );
        }}
      />
    </EditorCard>
  );
}
