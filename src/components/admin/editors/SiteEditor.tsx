"use client";

import { useMemo } from "react";
import { Alert, Input, Select, Typography } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  ImageField,
  LinkInput,
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
  if (!value.name.trim()) loi.name = "Chưa điền Tên dự án.";
  if (!value.shortName.trim()) loi.shortName = "Chưa điền Tên rút gọn.";
  if (!value.tagline.trim()) loi.tagline = "Chưa điền Khẩu hiệu.";
  if (!value.description.trim()) loi.description = "Chưa điền Mô tả.";
  if (!value.email.trim()) loi.email = "Chưa điền Email liên hệ.";
  else if (!laEmailHopLe(value.email))
    loi.email = "Email chưa đúng — cần có dạng tenmail@gmail.com.";
  if (value.facebook.trim() && !laUrlHopLe(value.facebook))
    loi.facebook =
      "Liên kết cần bắt đầu bằng https:// — chép lại từ thanh địa chỉ trình duyệt.";
  if (value.shopee.trim() && !laUrlHopLe(value.shopee))
    loi.shopee =
      "Liên kết cần bắt đầu bằng https:// — chép lại từ thanh địa chỉ trình duyệt.";
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
          title="Còn vài ô cần điền lại"
          description="Nội dung vẫn được lưu, nhưng nên điền đủ trước khi bấm Xuất bản."
        />
      ) : null}

      <EditorCard
        title="Thương hiệu & liên hệ"
        extra={<SaveStatusTag status={status} />}
      >
        <div className="grid gap-x-4 md:grid-cols-2">
          <Field
            label="Tên dự án *"
            hint={
              loi.name ? (
                <Text type="danger">{loi.name}</Text>
              ) : (
                "Tên đầy đủ của dự án. Hiện ở tên tab trình duyệt và chân trang."
              )
            }
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
                "Hiện ở thanh menu trên cùng và chân trang của mọi trang."
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
            label="Khẩu hiệu *"
            hint={
              loi.tagline ? (
                <Text type="danger">{loi.tagline}</Text>
              ) : (
                "Câu ngắn đi kèm tên dự án trên kết quả tìm kiếm Google và khi chia sẻ liên kết. Chữ hiện trên trang chủ nhập riêng ở mục Chữ ở đầu trang."
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
        </div>

        <Field
          label="Logo"
          hint="Ảnh logo ở thanh menu trên cùng của mọi trang. Nên dùng ảnh nền trong suốt (PNG). Bỏ trống sẽ dùng logo mặc định."
        >
          <ImageField
            value={value.logo ?? ""}
            onChange={(logo) => set("logo", logo)}
          />
        </Field>

        <div className="grid gap-x-4 md:grid-cols-3">
          <Field
            label="Email liên hệ *"
            hint={
              loi.email ? (
                <Text type="danger">{loi.email}</Text>
              ) : (
                "Hiện ở chân trang để khách liên hệ với Ban Tổ chức."
              )
            }
          >
            <LinkInput
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
                "Fanpage của dự án. Hiện ở chân trang và nút đăng ký tham gia ở trang chủ."
              )
            }
          >
            <LinkInput
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
                "Gian hàng gây quỹ. Hiện ở trang chủ và trang Gây quỹ. Bỏ trống thì phần này tự ẩn."
              )
            }
          >
            <LinkInput
              value={value.shopee}
              status={loi.shopee ? "error" : undefined}
              placeholder="https://shopee.vn/…"
              onChange={(e) => set("shopee", e.target.value)}
            />
          </Field>
        </div>
      </EditorCard>

      <EditorCard
        title="Hiển thị trên Google & khi chia sẻ liên kết"
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
              "Đoạn giới thiệu khách thấy khi tìm dự án trên Google, hoặc khi ai đó chia sẻ liên kết lên Facebook."
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
          label="Từ khoá tìm kiếm"
          hint="Những cụm từ khách có thể gõ để tìm ra dự án. Gõ một cụm rồi nhấn Enter để thêm; bấm dấu × trên thẻ để xoá."
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
          label="Ảnh khi chia sẻ liên kết"
          hint="Ảnh hiện kèm khi ai đó dán liên kết website lên Facebook, Zalo. Ảnh ngang cỡ 1200×630 là đẹp nhất. Bỏ trống thì dùng ảnh mặc định."
        >
          <ImageField
            /* Khung ảnh chia sẻ chuẩn của Facebook/Zalo: 1200×630. */
            aspect={1200 / 630}
            value={value.ogImage ?? ""}
            onChange={(url) => set("ogImage", url || undefined)}
            folder="seo"
          />
        </Field>
      </EditorCard>
    </>
  );
}
