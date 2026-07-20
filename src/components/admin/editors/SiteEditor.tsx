"use client";

import { useMemo } from "react";
import { Alert, Input, Select, Typography } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  ImageField,
} from "../editorKit";
import type { SiteMeta } from "@/lib/content/schema";

const { Text } = Typography;

/** Độ dài mô tả SEO khuyến nghị (FR8 — mô tả quá dài chỉ gợi ý, không chặn). */
const DESC_MAX_GOI_Y = 160;

/** Kiểm tra định dạng email cơ bản. */
function laEmailHopLe(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Kiểm tra liên kết http(s) cơ bản. */
function laUrlHopLe(value: string): boolean {
  return /^https?:\/\/\S+$/i.test(value.trim());
}

/** Lỗi của từng trường (rỗng = hợp lệ) — FR2-R3. */
type Loi = Partial<Record<keyof SiteMeta, string>>;

function kiemTra(value: SiteMeta): Loi {
  const loi: Loi = {};
  if (!value.name.trim()) loi.name = "Cần điền Tên dự án.";
  if (!value.shortName.trim()) loi.shortName = "Cần điền Tên rút gọn.";
  if (!value.tagline.trim()) loi.tagline = "Cần điền Khẩu hiệu.";
  if (!value.description.trim()) loi.description = "Cần điền Mô tả.";
  if (!value.email.trim()) loi.email = "Cần điền Email liên hệ.";
  else if (!laEmailHopLe(value.email)) loi.email = "Email chưa đúng định dạng.";
  if (value.facebook.trim() && !laUrlHopLe(value.facebook))
    loi.facebook = "Liên kết phải bắt đầu bằng http:// hoặc https://";
  if (value.shopee.trim() && !laUrlHopLe(value.shopee))
    loi.shopee = "Liên kết phải bắt đầu bằng http:// hoặc https://";
  return loi;
}

/**
 * Editor "Thương hiệu & liên hệ" (FR2 — 2.1) kiêm "SEO / Metadata" toàn site (FR8).
 * Nhánh nội dung: main.site
 */
export default function SiteEditor({ initial }: { initial: SiteMeta }) {
  const { value, update, status } = useSectionAutosave<SiteMeta>(
    "main.site",
    initial
  );

  const loi = useMemo(() => kiemTra(value), [value]);
  const soLoi = Object.keys(loi).length;

  /** Cập nhật một trường của SiteMeta. */
  const set = <K extends keyof SiteMeta>(key: K, next: SiteMeta[K]) =>
    update({ ...value, [key]: next });

  const moTaDai = value.description.trim().length > DESC_MAX_GOI_Y;

  return (
    <>
      {soLoi > 0 ? (
        <Alert
          className="mb-4"
          type="warning"
          showIcon
          message="Còn trường bắt buộc chưa hợp lệ"
          description="Nội dung vẫn được lưu nháp, nhưng hãy điền đủ trước khi xuất bản."
        />
      ) : null}

      <EditorCard
        title="Thương hiệu & liên hệ"
        extra={<SaveStatusTag status={status} />}
      >
        <div className="grid gap-x-4 md:grid-cols-2">
          <Field
            label="Tên dự án *"
            hint={loi.name ? <Text type="danger">{loi.name}</Text> : "Tên đầy đủ, dùng cho tiêu đề trang."}
          >
            <Input
              value={value.name}
              status={loi.name ? "error" : undefined}
              placeholder="Trăng Sáng Langbiang"
              onChange={(e) => set("name", e.target.value)}
            />
          </Field>

          <Field
            label="Tên rút gọn *"
            hint={
              loi.shortName ? (
                <Text type="danger">{loi.shortName}</Text>
              ) : (
                "Dùng ở header, footer và tên ứng dụng."
              )
            }
          >
            <Input
              value={value.shortName}
              status={loi.shortName ? "error" : undefined}
              placeholder="Trăng Sáng Langbiang"
              onChange={(e) => set("shortName", e.target.value)}
            />
          </Field>

          <Field
            label="Khẩu hiệu (tagline) *"
            hint={
              loi.tagline ? (
                <Text type="danger">{loi.tagline}</Text>
              ) : (
                "Có thể dùng ký hiệu {năm} để tự thay theo số năm hiện tại."
              )
            }
          >
            <Input
              value={value.tagline}
              status={loi.tagline ? "error" : undefined}
              placeholder="Dự án tình nguyện"
              onChange={(e) => set("tagline", e.target.value)}
            />
          </Field>

          <Field
            label="Phụ đề"
            hint="Dòng mô tả ngắn dưới khẩu hiệu. Có thể dùng {năm}."
          >
            <Input
              value={value.subtitle}
              placeholder="Tại phường Langbiang – Đà Lạt, tỉnh Lâm Đồng"
              onChange={(e) => set("subtitle", e.target.value)}
            />
          </Field>
        </div>

        <div className="grid gap-x-4 md:grid-cols-3">
          <Field
            label="Email liên hệ *"
            hint={loi.email ? <Text type="danger">{loi.email}</Text> : undefined}
          >
            <Input
              value={value.email}
              status={loi.email ? "error" : undefined}
              placeholder="trangsanglangbiang@gmail.com"
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>

          <Field
            label="Facebook"
            hint={
              loi.facebook ? (
                <Text type="danger">{loi.facebook}</Text>
              ) : (
                "Liên kết trang Facebook của dự án."
              )
            }
          >
            <Input
              value={value.facebook}
              status={loi.facebook ? "error" : undefined}
              placeholder="https://www.facebook.com/…"
              onChange={(e) => set("facebook", e.target.value)}
            />
          </Field>

          <Field
            label="Gian hàng Shopee"
            hint={
              loi.shopee ? (
                <Text type="danger">{loi.shopee}</Text>
              ) : (
                "Liên kết gian hàng gây quỹ (để trống nếu chưa có)."
              )
            }
          >
            <Input
              value={value.shopee}
              status={loi.shopee ? "error" : undefined}
              placeholder="https://shopee.vn/…"
              onChange={(e) => set("shopee", e.target.value)}
            />
          </Field>
        </div>
      </EditorCard>

      <EditorCard
        title="SEO & chia sẻ mạng xã hội"
        extra={<SaveStatusTag status={status} />}
      >
        <Field
          label="Mô tả *"
          hint={
            loi.description ? (
              <Text type="danger">{loi.description}</Text>
            ) : moTaDai ? (
              <Text type="warning">
                Mô tả dài hơn {DESC_MAX_GOI_Y} ký tự — Google có thể cắt bớt.
              </Text>
            ) : (
              "Mô tả ngắn cho tìm kiếm & khi chia sẻ liên kết. Có thể dùng {năm}."
            )
          }
        >
          <Input.TextArea
            value={value.description}
            status={loi.description ? "error" : undefined}
            autoSize={{ minRows: 3, maxRows: 8 }}
            showCount={{
              formatter: ({ count }) => `${count}/${DESC_MAX_GOI_Y} khuyến nghị`,
            }}
            placeholder="Mô tả ngắn gọn về dự án…"
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>

        <Field
          label="Từ khoá SEO"
          hint="Gõ từ khoá rồi nhấn Enter để thêm; bấm dấu × trên thẻ để xoá."
        >
          <Select
            mode="tags"
            value={value.keywords}
            onChange={(next: string[]) =>
              set(
                "keywords",
                // Bỏ khoảng trắng thừa và trùng lặp.
                Array.from(
                  new Set(next.map((k) => k.trim()).filter(Boolean))
                )
              )
            }
            style={{ width: "100%" }}
            tokenSeparators={[","]}
            open={false}
            suffixIcon={null}
            placeholder="Trăng Sáng Langbiang, tình nguyện Đà Lạt…"
          />
        </Field>

        <Field
          label="Ảnh chia sẻ (OG)"
          hint="Ảnh hiển thị khi chia sẻ liên kết. Khuyến nghị 1200×630px. Để trống sẽ dùng ảnh mặc định."
        >
          <ImageField
            value={value.ogImage ?? ""}
            onChange={(url) => set("ogImage", url || undefined)}
            folder="seo"
          />
        </Field>
      </EditorCard>
    </>
  );
}
