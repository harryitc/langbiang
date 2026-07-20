"use client";

// TRANG soạn MỘT mẫu email (/admin/mau-email/<mã mẫu>).
//
// Gồm: tên mẫu, ghi chú, gửi cho ai, tiêu đề thư, thân thư soạn bằng trình
// soạn thảo, bảng các biến chèn được, và khung xem trước đúng như thư sẽ nhận.
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  App,
  Alert,
  Button,
  Input,
  Radio,
  Result,
  Space,
  Table,
  Tag,
} from "antd";
import { ArrowLeftOutlined, CopyOutlined } from "@ant-design/icons";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  RichText,
} from "../editorKit";
import {
  EMAIL_VARS,
  PREVIEW_VARS,
  renderEmailTemplate,
  type EmailTemplate,
} from "@/lib/content/email-templates";
import { NHAN_GUI_CHO, type FormDungMau } from "./EmailTemplatesEditor";

type BienEmail = { key: string; label: string; vd: string };

export default function EmailTemplateEditor({
  initialTemplates,
  templateId,
  forms,
}: {
  initialTemplates: EmailTemplate[];
  /** Mã mẫu đang mở, lấy từ địa chỉ trang. */
  templateId: string;
  forms: FormDungMau[];
}) {
  const { message } = App.useApp();
  const {
    value: templates,
    update: setTemplates,
    status,
  } = useSectionAutosave<EmailTemplate[]>("emailTemplates", initialTemplates);

  // Mã mẫu không sửa được nên tìm một lần là đủ.
  const [index] = useState(() =>
    initialTemplates.findIndex((t) => t.id === templateId)
  );
  const mau = index >= 0 ? templates[index] : undefined;

  // Xem trước dựng bằng ĐÚNG hàm mà máy chủ dùng lúc gửi thật -> thư nhận được
  // không bao giờ khác khung này.
  const xemTruoc = useMemo(
    () => (mau ? renderEmailTemplate(mau, PREVIEW_VARS) : null),
    [mau]
  );

  if (!mau || !xemTruoc) {
    return (
      <Result
        status="404"
        title="Không tìm thấy mẫu email này"
        subTitle={`Không có mẫu nào mang mã “${templateId}”. Có thể mẫu đã bị xoá.`}
        extra={
          <Link href="/admin/mau-email">
            <Button type="primary" className="cursor-pointer">
              Về danh sách mẫu email
            </Button>
          </Link>
        }
      />
    );
  }

  const set = <K extends keyof EmailTemplate>(key: K, v: EmailTemplate[K]) => {
    const arr = templates.slice();
    arr[index] = { ...mau, [key]: v };
    setTemplates(arr);
  };

  const dungBoi = forms.filter(
    (f) => f.confirmTemplateId === mau.id || f.notifyTemplateId === mau.id
  );

  const chepBien = async (key: string) => {
    try {
      await navigator.clipboard.writeText(`{{${key}}}`);
      message.success(
        `Đã chép {{${key}}}. Dán vào tiêu đề hoặc thân thư ở chỗ bạn muốn.`
      );
    } catch {
      message.error(
        `Trình duyệt không cho chép. Bạn gõ tay {{${key}}} vào thư nhé.`
      );
    }
  };

  return (
    <div>
      {/* ---------------- Thanh đầu trang ---------------- */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/admin/mau-email">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="cursor-pointer"
          >
            Về danh sách mẫu email
          </Button>
        </Link>
        <SaveStatusTag status={status} />
      </div>

      {/* ---------------- Thông tin chung ---------------- */}
      <EditorCard title="Mẫu email này dùng khi nào">
        <Field
          label="Tên mẫu"
          hint="Chỉ Ban tổ chức nhìn thấy, dùng để chọn mẫu cho từng form. Vd: Cảm ơn đã đăng ký."
        >
          <Input
            value={mau.name}
            placeholder="Cảm ơn đã đăng ký"
            status={mau.name.trim() ? undefined : "error"}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>

        <Field
          label="Ghi chú"
          hint="Vài chữ nhắc mẫu này dùng cho việc gì. Bỏ trống cũng được."
        >
          <Input
            value={mau.note ?? ""}
            placeholder="Gửi tự động cho người vừa điền form."
            onChange={(e) => set("note", e.target.value)}
          />
        </Field>

        <Field
          label="Gửi cho ai"
          hint="Chọn sai thì form sẽ không tìm thấy mẫu này trong danh sách chọn của nó."
        >
          <Radio.Group
            value={mau.sendTo}
            onChange={(e) => set("sendTo", e.target.value)}
            options={[
              {
                value: "nguoi-dang-ky",
                label: "Người đăng ký — gửi tới email khách vừa điền trong form",
              },
              {
                value: "ban-to-chuc",
                label: "Ban tổ chức — gửi tới hộp thư nội bộ đã đặt trong form",
              },
            ]}
          />
        </Field>

        {dungBoi.length > 0 ? (
          <Alert
            type="info"
            showIcon
            title="Sửa mẫu này là sửa cho tất cả các form đang dùng nó."
            description={
              <Space orientation="horizontal" size={4} wrap>
                <span>Đang được dùng bởi:</span>
                {dungBoi.map((f) => (
                  <Tag key={f.id}>{f.name.trim() || f.id}</Tag>
                ))}
              </Space>
            }
          />
        ) : (
          <Alert
            type="warning"
            showIcon
            title="Chưa form đăng ký nào dùng mẫu này."
            description={
              <>
                Vào mục{" "}
                <Link href="/admin/dang-ky" className="cursor-pointer underline">
                  Form đăng ký
                </Link>
                , mở một form rồi chọn mẫu này ở phần{" "}
                <em>Email tự động gửi khi có người đăng ký</em>.
              </>
            }
          />
        )}
      </EditorCard>

      {/* ---------------- Nội dung thư ---------------- */}
      <EditorCard title="Nội dung lá thư">
        <p className="mb-3 text-sm opacity-60">
          Chỗ nào cần điền thông tin của người đăng ký thì chèn một{" "}
          <strong>biến</strong> (xem bảng phía dưới) — lúc gửi, hệ thống tự thay
          biến bằng thông tin thật. Phần khung xanh, tiêu đề trăng và dòng chân
          thư đã có sẵn, bạn không phải làm gì thêm.
        </p>

        <Field
          label="Tiêu đề email"
          hint="Dòng chữ người nhận thấy đầu tiên trong hộp thư. Chèn biến được, vd: Cảm ơn bạn đã đăng ký {{ten_form}}."
        >
          <Input
            value={mau.subject}
            placeholder="Cảm ơn bạn đã đăng ký {{ten_form}} 🌕"
            status={mau.subject.trim() ? undefined : "error"}
            onChange={(e) => set("subject", e.target.value)}
          />
        </Field>

        <Field
          label="Thân thư"
          hint="Soạn như soạn văn bản bình thường: in đậm, gạch đầu dòng, chèn liên kết…"
        >
          <RichText
            value={mau.bodyHtml}
            onChange={(html) => set("bodyHtml", html)}
            folder="email"
          />
        </Field>
      </EditorCard>

      {/* ---------------- Bảng biến ---------------- */}
      <EditorCard title="Các biến chèn được vào thư">
        <p className="mb-3 text-sm opacity-60">
          Bấm vào một dòng để <strong>chép biến</strong>, rồi dán vào tiêu đề
          hoặc thân thư. Biến nào không có dữ liệu thì lúc gửi sẽ để trống, chứ
          không hiện dấu ngoặc ra ngoài.
        </p>
        <Table<BienEmail>
          size="small"
          rowKey="key"
          pagination={false}
          dataSource={EMAIL_VARS.map((v) => ({ ...v }))}
          onRow={(r) => ({
            className: "cursor-pointer",
            onClick: () => void chepBien(r.key),
          })}
          columns={[
            {
              title: "Biến",
              dataIndex: "key",
              width: 220,
              render: (key: string) => (
                <Space orientation="horizontal" size={4}>
                  <Tag color="green">{`{{${key}}}`}</Tag>
                  <CopyOutlined className="opacity-40" />
                </Space>
              ),
            },
            { title: "Ý nghĩa", dataIndex: "label" },
            {
              title: "Ví dụ hiện ra trong thư",
              dataIndex: "vd",
              render: (vd: string) => (
                <span className="text-xs opacity-70">{vd}</span>
              ),
            },
          ]}
        />
      </EditorCard>

      {/* ---------------- Xem trước ---------------- */}
      <EditorCard title="Xem trước lá thư">
        <p className="mb-3 text-sm opacity-60">
          Đây là <strong>đúng lá thư người nhận sẽ thấy</strong>, với thông tin
          mẫu của một người đăng ký giả định. Khung này tự cập nhật theo nội dung
          bạn đang gõ.
        </p>

        <Field label="Tiêu đề thư (đã thay biến)">
          <Input readOnly value={xemTruoc.subject} />
        </Field>

        <iframe
          title="Xem trước lá thư"
          srcDoc={xemTruoc.html}
          sandbox=""
          className="h-[640px] w-full rounded-xl border border-black/10 bg-white"
        />
      </EditorCard>
    </div>
  );
}
