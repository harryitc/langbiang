"use client";

import { Alert, Input, Space, Switch, Tag } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  ListEditor,
  Field,
} from "../editorKit";
import type { Fundraising, FundraisingChannel } from "@/lib/content/schema";

/** Gợi ý biểu tượng nhanh cho kênh gây quỹ (FR2 – 2.9). */
const ICON_SUGGESTIONS = ["🛒", "💳", "🎁", "🏦", "📦", "🤝", "💝", "📱", "🧧"];

/** Kiểm tra trường bắt buộc của khối gây quỹ (FR2-R3). */
function validateBlock(value: Fundraising) {
  return {
    title: value.title.trim() ? "" : "Vui lòng nhập tiêu đề.",
    desc: value.desc.trim() ? "" : "Vui lòng nhập mô tả.",
  };
}

/** Kiểm tra trường bắt buộc của một kênh gây quỹ (FR2-R3). */
function validateChannel(item: FundraisingChannel) {
  return {
    icon: item.icon.trim() ? "" : "Vui lòng nhập biểu tượng.",
    name: item.name.trim() ? "" : "Vui lòng nhập tên kênh.",
    cta: item.cta.trim() ? "" : "Vui lòng nhập nhãn nút.",
    href: item.href.trim() ? "" : "Vui lòng nhập liên kết.",
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
          message={`Có ${invalidCount} kênh gây quỹ chưa điền đủ trường bắt buộc.`}
          description="Kênh thiếu biểu tượng, tên, nhãn nút hoặc liên kết sẽ không hiển thị đúng trên trang chính."
        />
      ) : null}

      {highlightCount > 1 ? (
        <Alert
          className="mb-4"
          type="info"
          showIcon
          message={`Đang có ${highlightCount} kênh được đánh dấu nổi bật.`}
          description="Nên chỉ để một kênh nổi bật để lời kêu gọi ủng hộ rõ ràng hơn."
        />
      ) : null}

      <Field label="Tiêu đề khối">
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
        hint="Nên giữ 1–2 câu giới thiệu vì sao nên ủng hộ dự án."
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
                label="Biểu tượng (emoji)"
                hint="Dán một emoji, hoặc bấm chọn từ gợi ý bên dưới."
              >
                <Space direction="vertical" size={8} className="w-full">
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

              <Field label="Nhãn nút">
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
                hint="Dán URL đầy đủ (https://…). Dùng “#” nếu nút chỉ để sao chép thông tin."
              >
                <Input
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
                label="Nổi bật"
                hint="Kênh nổi bật được làm nổi trong khối gây quỹ trên trang chính."
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
