"use client";

import { Alert, Collapse, Input, InputNumber, Space, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
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
          sponsorTiers: [],
          spendingReport: { url: "", note: "" },
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
                    extra: item.summaryHtml.trim() ? null : <Tag>Đang trống</Tag>,
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
                      <SponsorTierListEditor
                        value={item.sponsorTiers}
                        onChange={(sponsorTiers) =>
                          updateItem({ ...item, sponsorTiers })
                        }
                      />
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
