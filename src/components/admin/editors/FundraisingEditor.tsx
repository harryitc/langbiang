"use client";

import { Alert, Input, Space, Switch, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
  LinkInput,
  ImageField,
} from "../editorKit";
import type { Fundraising, FundraisingChannel } from "@/lib/content/schema";

/** Gợi ý biểu tượng nhanh cho kênh gây quỹ (FR2 – 2.9). */
const ICON_SUGGESTIONS = ["🛒", "💳", "🎁", "🏦", "📦", "🤝", "💝", "📱", "🧧"];

/** Kiểm tra trường bắt buộc của khối gây quỹ (FR2-R3). */
function validateBlock(value: Fundraising) {
  return {
    title: value.title.trim() ? "" : "Chưa nhập tiêu đề.",
    desc: value.desc.trim() ? "" : "Chưa nhập mô tả.",
  };
}

/** Kiểm tra trường bắt buộc của một kênh gây quỹ (FR2-R3). */
function validateChannel(item: FundraisingChannel) {
  return {
    icon: item.icon.trim() ? "" : "Chưa chọn biểu tượng.",
    name: item.name.trim() ? "" : "Chưa nhập tên kênh.",
    cta: item.cta.trim() ? "" : "Chưa nhập chữ trên nút.",
    href: item.href.trim() ? "" : "Chưa nhập liên kết.",
  };
}

// Trình biên tập Gây quỹ — nhánh nội dung main.fundraising
export default function FundraisingEditor({
  initial,
}: {
  initial: Fundraising;
}) {
  const { value, update, status } = useSectionAutosave<Fundraising>(
    "main.fundraising",
    initial
  );

  const blockErrors = validateBlock(value);
  const channels = value.channels ?? [];

  // Số kênh còn thiếu trường bắt buộc → cảnh báo chung ở đầu thẻ.
  const invalidCount = channels.filter((item) =>
    Object.values(validateChannel(item)).some(Boolean)
  ).length;

  // Số kênh đang bật "nổi bật" — nhiều kênh nổi bật sẽ làm loãng lời kêu gọi.
  const highlightCount = channels.filter((item) => item.highlight).length;

  return (
    <EditorCard title="Gây quỹ" extra={<SaveStatusTag status={status} />}>
      {invalidCount > 0 ? (
        <Alert
          className="mb-4"
          type="warning"
          showIcon
          title={`Có ${invalidCount} kênh gây quỹ chưa điền đủ thông tin.`}
          description="Kênh thiếu biểu tượng, tên, chữ trên nút hoặc liên kết sẽ hiển thị lệch lạc trên trang Gây quỹ."
        />
      ) : null}

      {highlightCount > 1 ? (
        <Alert
          className="mb-4"
          type="info"
          showIcon
          title={`Đang có ${highlightCount} kênh được đánh dấu nổi bật.`}
          description="Nên chỉ để một kênh nổi bật để lời kêu gọi ủng hộ rõ ràng hơn."
        />
      ) : null}

      <Field
        label="Tiêu đề khối"
        hint="Hiện làm tiêu đề lớn ở đầu trang Gây quỹ."
      >
        <Input
          value={value.title}
          placeholder="Vd: Gian hàng gây quỹ"
          status={blockErrors.title ? "error" : undefined}
          onChange={(e) => update({ ...value, title: e.target.value })}
        />
        {blockErrors.title ? (
          <div className="mt-1 text-xs text-red-500">{blockErrors.title}</div>
        ) : null}
      </Field>

      <Field
        label="Mô tả"
        hint="Hiện ngay dưới tiêu đề trang Gây quỹ. Nên 1–2 câu nói vì sao nên ủng hộ dự án."
      >
        <Input.TextArea
          value={value.desc}
          rows={3}
          showCount
          maxLength={300}
          placeholder="Mỗi sản phẩm bạn mua tại gian hàng là một phần quà Trung thu gửi đến các em nhỏ Langbiang…"
          status={blockErrors.desc ? "error" : undefined}
          onChange={(e) => update({ ...value, desc: e.target.value })}
        />
        {blockErrors.desc ? (
          <div className="mt-1 text-xs text-red-500">{blockErrors.desc}</div>
        ) : null}
      </Field>

      <ListEditor<FundraisingChannel>
        title="Các kênh gây quỹ"
        value={channels}
        onChange={(next) => update({ ...value, channels: next })}
        addLabel="Thêm kênh gây quỹ"
        newItem={() => ({
          icon: "🛒",
          name: "",
          note: "",
          cta: "",
          href: "",
          highlight: false,
        })}
        getSummary={(item) => `${item.icon ?? ""} ${item.name ?? ""}`.trim() || "(chưa có tên kênh)"}
          renderItem={(item, updateItem, index) => {
          const errors = validateChannel(item);
          return (
            <div className="w-full">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-semibold uppercase opacity-50">
                  Kênh {index + 1}
                </span>
                {item.highlight ? <Tag color="gold">Nổi bật</Tag> : null}
              </div>

              <Field
                label="Biểu tượng"
                hint="Hình vui nhỏ hiện trên thẻ kênh. Bấm chọn một gợi ý bên dưới cho nhanh."
              >
                <Space orientation="vertical" size={8} className="w-full">
                  <Input
                    value={item.icon}
                    maxLength={4}
                    placeholder="🛒"
                    status={errors.icon ? "error" : undefined}
                    className="w-24 text-center text-xl"
                    onChange={(e) =>
                      updateItem({ ...item, icon: e.target.value })
                    }
                  />
                  <div className="flex flex-wrap gap-1">
                    {ICON_SUGGESTIONS.map((icon) => (
                      <Tag
                        key={icon}
                        className="cursor-pointer text-base"
                        color={item.icon === icon ? "gold" : undefined}
                        onClick={() => updateItem({ ...item, icon })}
                      >
                        {icon}
                      </Tag>
                    ))}
                  </div>
                  {errors.icon ? (
                    <div className="text-xs text-red-500">{errors.icon}</div>
                  ) : null}
                </Space>
              </Field>

              <Field label="Tên kênh">
                <Input
                  value={item.name}
                  placeholder="Vd: Gian hàng Shopee"
                  status={errors.name ? "error" : undefined}
                  onChange={(e) => updateItem({ ...item, name: e.target.value })}
                />
                {errors.name ? (
                  <div className="mt-1 text-xs text-red-500">{errors.name}</div>
                ) : null}
              </Field>

              <Field
                label="Ghi chú"
                hint="Không bắt buộc. Vd: số tài khoản, hoặc mô tả ngắn cách ủng hộ."
              >
                <Input.TextArea
                  value={item.note}
                  rows={2}
                  showCount
                  maxLength={160}
                  placeholder="Ủng hộ qua mua sắm sản phẩm gây quỹ"
                  onChange={(e) => updateItem({ ...item, note: e.target.value })}
                />
              </Field>

              <Field label="Chữ trên nút">
                <Input
                  value={item.cta}
                  maxLength={40}
                  placeholder="Vd: Ghé gian hàng"
                  status={errors.cta ? "error" : undefined}
                  onChange={(e) => updateItem({ ...item, cta: e.target.value })}
                />
                {errors.cta ? (
                  <div className="mt-1 text-xs text-red-500">{errors.cta}</div>
                ) : null}
              </Field>

              <Field
                label="Liên kết"
                hint="Nơi khách được đưa tới khi bấm nút. Dán đầy đủ, bắt đầu bằng https://. Gõ dấu # nếu sử dụng Pop-up Mã QR."
              >
                <LinkInput
                  value={item.href}
                  placeholder="https://shopee.vn/…"
                  status={errors.href ? "error" : undefined}
                  onChange={(e) => updateItem({ ...item, href: e.target.value })}
                />
                {errors.href ? (
                  <div className="mt-1 text-xs text-red-500">{errors.href}</div>
                ) : null}
              </Field>

              <Field
                label="Ảnh mã QR chuyển khoản"
                hint="Dành cho kênh chuyển khoản trực tiếp. Khi người dùng bấm nút, pop-up sẽ hiển thị ảnh QR này để quét và tải về."
              >
                <ImageField
                  value={item.qrImage ?? ""}
                  onChange={(url) => updateItem({ ...item, qrImage: url })}
                />
              </Field>

              <Field
                label="Tên Ngân hàng"
                hint="Vd: Vietcombank, Techcombank, MBBank..."
              >
                <Input
                  value={item.bankName ?? ""}
                  placeholder="Vd: Vietcombank"
                  onChange={(e) => updateItem({ ...item, bankName: e.target.value })}
                />
              </Field>

              <Field
                label="Số tài khoản"
                hint="Số tài khoản ngân hàng ủng hộ (khách bấm nút có thể sao chép nhanh)."
              >
                <Input
                  value={item.accountNumber ?? ""}
                  placeholder="Vd: 0123456789"
                  onChange={(e) => updateItem({ ...item, accountNumber: e.target.value })}
                />
              </Field>

              <Field
                label="Tên chủ tài khoản"
                hint="Tên người hoặc tổ chức nhận tiền chuyển khoản."
              >
                <Input
                  value={item.accountName ?? ""}
                  placeholder="Vd: TRANG SANG LANGBIANG"
                  onChange={(e) => updateItem({ ...item, accountName: e.target.value })}
                />
              </Field>

              <Field
                label="Nổi bật"
                hint="Kênh bật mục này được tô nổi hơn các kênh khác trên trang Gây quỹ."
              >
                <Switch
                  checked={item.highlight}
                  checkedChildren="Có"
                  unCheckedChildren="Không"
                  onChange={(checked) =>
                    updateItem({ ...item, highlight: checked })
                  }
                />
              </Field>
            </div>
          );
        }}
      />
    </EditorCard>
  );
}
