"use client";

import { Alert, Collapse, Input, InputNumber, Space, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  ImageField,
  RichText,
} from "../editorKit";
import {
  PhotoListEditor,
  SponsorTierListEditor,
  SpendingFields,
  missingPhotoFields,
  missingTierFields,
  missingSponsorFields,
} from "./sections";
import { ItemListEditor } from "../itemList";
import { isValidYear } from "@/lib/content/year";
import type { PastYear } from "@/lib/content/schema";

/** Năm mặc định cho mục mới: năm trước năm hiện tại theo lịch. */
function suggestYear(existing: PastYear[]): number {
  const base = new Date().getFullYear() - 1;
  const used = new Set(existing.map((y) => y.year));
  let candidate = base;
  while (used.has(candidate)) candidate -= 1;
  return candidate;
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

/** Đếm mọi lỗi trong một năm (dùng cho nhãn cảnh báo ở đầu mục). */
function countIssues(item: PastYear): number {
  return (
    missingYearFields(item).length +
    item.gallery.filter((p) => missingPhotoFields(p).length > 0).length +
    item.sponsorTiers.filter(
      (t) =>
        missingTierFields(t).length > 0 ||
        t.sponsors.some((s) => missingSponsorFields(s).length > 0)
    ).length
  );
}

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
    <Space orientation="vertical" size={0} style={{ width: "100%" }}>
      <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-[160px_1fr]">
        <Field
          label="Năm"
          hint="Cũng là địa chỉ trang — điền 2025 thì trang mở tại /2025."
        >
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
        <Field
          label="Chữ nhỏ phía trên tiêu đề"
          hint="Tuỳ chọn. Bỏ trống thì trang hiện chữ “Hồi ức”."
        >
          <Input
            value={item.eyebrow ?? ""}
            placeholder="Mùa 2025"
            onChange={(e) => updateItem({ ...item, eyebrow: e.target.value })}
          />
        </Field>
        <Field label="Phụ đề" hint="Tuỳ chọn. Dòng chữ nhỏ ngay dưới tiêu đề.">
          <Input
            value={item.subtitle ?? ""}
            placeholder="Một mùa trăng của yêu thương"
            onChange={(e) => updateItem({ ...item, subtitle: e.target.value })}
          />
        </Field>
      </div>

      <Field
        label="Ảnh nền"
        hint="Tuỳ chọn. Ảnh lớn trải ngang phía sau tiêu đề ở đầu trang."
      >
        <ImageField
          value={item.bgImage ?? ""}
          folder="past-years"
          onChange={(bgImage) => updateItem({ ...item, bgImage })}
        />
      </Field>

      {duplicate ? (
        <div className="text-xs text-red-500">
          Năm {item.year} đã có trong danh mục — chọn số năm khác giúp nhé.
        </div>
      ) : null}
    </Space>
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
        Mỗi năm ở đây là một trang &ldquo;Nhìn lại&rdquo; riêng — ví dụ năm 2025
        mở tại địa chỉ <code>/2025</code>. Các năm cũng hiện trong menu
        &ldquo;Năm&rdquo; ở thanh trên cùng, xếp từ mới tới cũ. Phần nào bỏ
        trống sẽ tự ẩn trên trang. Danh mục này tách riêng với &ldquo;Số năm
        hiện tại&rdquo; của mùa đang tổ chức.
      </p>

      {duplicateYears.length > 0 ? (
        <Alert
          type="error"
          showIcon
          className="mb-3"
          title={`Năm ${duplicateYears.join(", ")} bị trùng trong danh mục. Mỗi năm chỉ được có một trang.`}
        />
      ) : null}

      {invalidCount > 0 ? (
        <Alert
          type="warning"
          showIcon
          className="mb-3"
          title={`Có ${invalidCount} năm chưa điền đủ thông tin.`}
          description="Mỗi năm cần số năm đủ 4 chữ số và một tiêu đề; ảnh trong phần Khoảnh khắc cũng cần được chọn."
        />
      ) : null}

      <ItemListEditor<PastYear>
        value={years}
        onChange={update}
        addLabel="Thêm năm đã qua"
        drawerTitle="Năm đã qua"
        getRow={(item, index) => ({
          title: isValidYear(item.year) ? `Nhìn lại ${item.year}` : "Năm mới",
          subtitle: item.title || undefined,
          thumb: item.bgImage || item.gallery[0]?.src || undefined,
          tags: [
            { text: `${item.gallery.length} ảnh` },
            ...(item.sponsorTiers.length
              ? [{ text: `${item.sponsorTiers.length} hạng tài trợ` }]
              : []),
          ],
          invalid: countIssues(item) > 0 || isDuplicateYear(years, index),
        })}
        newItem={() => ({
          year: suggestYear(years),
          title: "",
          subtitle: "",
          eyebrow: "",
          bgImage: "",
          summaryHtml: "",
          gallery: [],
          sponsorTiers: [],
          spendingReport: { url: "", note: "" },
        })}
        renderForm={(item, updateItem, index) => {
          const duplicate = isDuplicateYear(years, index);
          return (
            <Space orientation="vertical" size={4} style={{ width: "100%" }}>

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
                    extra: item.summaryHtml.trim() ? null : <Tag>Đang trống</Tag>,
                    children: (
                      <Field
                        label="Nội dung tổng kết"
                        hint="Bài viết nhìn lại mùa đó. Bỏ trống thì mục Tổng kết tự ẩn trên trang."
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
                      <PhotoListEditor
                        value={item.gallery}
                        folder="past-years"
                        onChange={(gallery) => updateItem({ ...item, gallery })}
                      />
                    ),
                  },
                  {
                    key: "spending",
                    label: "Báo cáo thu – chi",
                    extra: item.spendingReport?.url?.trim() ? null : (
                      <Tag>Đang trống</Tag>
                    ),
                    children: (
                      <SpendingFields
                        value={item.spendingReport ?? { url: "", note: "" }}
                        onChange={(spendingReport) =>
                          updateItem({ ...item, spendingReport })
                        }
                      />
                    ),
                  },
                  {
                    key: "sponsors",
                    label: `Nhà tài trợ (${item.sponsorTiers.length} hạng)`,
                    children: (
                      <Space orientation="vertical" size={12} style={{ width: "100%" }}>
                        <div className="rounded-xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.02]">
                          <div className="mb-2 text-xs font-bold uppercase opacity-70">
                            Tiêu đề & Mô tả mục Nhà tài trợ
                          </div>
                          <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
                            <Field label="Nhãn phụ" hint="Vd: Đơn vị đồng hành mùa 2025">
                              <Input
                                value={item.sponsorsHeader?.eyebrow ?? ""}
                                placeholder="Vd: Đơn vị đồng hành mùa 2025"
                                onChange={(e) =>
                                  updateItem({
                                    ...item,
                                    sponsorsHeader: {
                                      ...item.sponsorsHeader,
                                      eyebrow: e.target.value,
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field label="Tiêu đề chính" hint="Vd: Cảm ơn những">
                              <Input
                                value={item.sponsorsHeader?.title ?? ""}
                                placeholder="Vd: Cảm ơn những"
                                onChange={(e) =>
                                  updateItem({
                                    ...item,
                                    sponsorsHeader: {
                                      ...item.sponsorsHeader,
                                      title: e.target.value,
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field label="Tiêu đề nổi bật (nối sau tiêu đề)" hint="Vd: tấm lòng vàng">
                              <Input
                                value={item.sponsorsHeader?.titleHighlight ?? ""}
                                placeholder="Vd: tấm lòng vàng"
                                onChange={(e) =>
                                  updateItem({
                                    ...item,
                                    sponsorsHeader: {
                                      ...item.sponsorsHeader,
                                      titleHighlight: e.target.value,
                                    },
                                  })
                                }
                              />
                            </Field>
                            <Field label="Mô tả" hint="Đoạn văn giới thiệu ngắn">
                              <Input
                                value={item.sponsorsHeader?.desc ?? ""}
                                placeholder="Sự sẻ chia quý báu từ các đơn vị..."
                                onChange={(e) =>
                                  updateItem({
                                    ...item,
                                    sponsorsHeader: {
                                      ...item.sponsorsHeader,
                                      desc: e.target.value,
                                    },
                                  })
                                }
                              />
                            </Field>
                          </div>
                        </div>

                        <SponsorTierListEditor
                          value={item.sponsorTiers}
                          onChange={(sponsorTiers) =>
                            updateItem({ ...item, sponsorTiers })
                          }
                        />
                      </Space>
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
