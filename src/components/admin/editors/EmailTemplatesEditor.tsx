"use client";

// Mục "Mẫu email" — DANH SÁCH các mẫu email của website.
//
// Mẫu email là nội dung thư gửi tự động khi có người đăng ký: thư cảm ơn gửi
// cho người vừa điền form, và thư báo tin gửi cho Ban tổ chức. Mỗi form đăng ký
// tự chọn dùng mẫu nào (chọn trong trang chỉnh sửa của form đó).
//
// Bấm "Sửa" để mở TRANG soạn mẫu riêng (/admin/mau-email/<mã mẫu>).
import { useRouter } from "next/navigation";
import { App, Button, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { useSectionAutosave, SaveStatusTag, EditorCard } from "../editorKit";
import { toRegisterSlug } from "@/lib/content/schema";
import type { EmailTemplate } from "@/lib/content/email-templates";

/** Form nào đang dùng mẫu nào — chỉ cần bấy nhiêu để hiển thị & chặn xoá. */
export type FormDungMau = {
  id: string;
  name: string;
  confirmTemplateId?: string;
  notifyTemplateId?: string;
};

/** Nhãn tiếng Việt cho "gửi cho ai". */
export const NHAN_GUI_CHO: Record<EmailTemplate["sendTo"], string> = {
  "nguoi-dang-ky": "Người đăng ký",
  "ban-to-chuc": "Ban tổ chức",
};

/** Mã mẫu chưa ai dùng (thêm đuôi -2, -3… nếu trùng). */
export function maMauChuaDung(goc: string, dangDung: string[]): string {
  const base = toRegisterSlug(goc) || "mau-email";
  if (!dangDung.includes(base)) return base;
  let i = 2;
  while (dangDung.includes(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

/** Mẫu trống cho nút "Thêm mẫu mới". */
function mauMoi(dangDung: string[]): EmailTemplate {
  return {
    id: maMauChuaDung("mau-email-moi", dangDung),
    name: "Mẫu email mới",
    note: "",
    sendTo: "nguoi-dang-ky",
    subject: "Cảm ơn bạn đã đăng ký {{ten_form}}",
    bodyHtml:
      "<p>Chào <strong>{{ho_ten}}</strong>,</p><p>Ban Tổ chức đã nhận được đăng ký của bạn.</p>",
  };
}

export default function EmailTemplatesEditor({
  initialTemplates,
  forms,
}: {
  initialTemplates: EmailTemplate[];
  forms: FormDungMau[];
}) {
  const { message } = App.useApp();
  const router = useRouter();
  const {
    value: templates,
    update: setTemplates,
    status,
  } = useSectionAutosave<EmailTemplate[]>("emailTemplates", initialTemplates);

  /** Các form đang dùng một mẫu (để hiện ở cột cuối và để chặn xoá). */
  const formDangDung = (id: string) =>
    forms.filter(
      (f) => f.confirmTemplateId === id || f.notifyTemplateId === id
    );

  const themMau = () => {
    const moi = mauMoi(templates.map((t) => t.id));
    setTemplates([...templates, moi]);
    message.success("Đã thêm mẫu mới. Soạn nội dung cho mẫu ở trang này nhé.");
    router.push(`/admin/mau-email/${moi.id}`);
  };

  const nhanBan = (index: number) => {
    const goc = templates[index];
    const ban = structuredClone(goc);
    ban.id = maMauChuaDung(
      `${goc.id}-ban-sao`,
      templates.map((t) => t.id)
    );
    ban.name = `${goc.name} (bản sao)`;
    setTemplates([
      ...templates.slice(0, index + 1),
      ban,
      ...templates.slice(index + 1),
    ]);
    message.success("Đã nhân bản mẫu. Nhớ đổi tên cho dễ phân biệt nhé.");
  };

  const xoaMau = (index: number) => {
    const mau = templates[index];
    const dungBoi = formDangDung(mau.id);
    if (dungBoi.length > 0) {
      message.warning(
        `Mẫu này đang được form ${dungBoi
          .map((f) => `“${f.name.trim() || f.id}”`)
          .join(", ")} dùng. Hãy vào form đó chọn mẫu khác (hoặc chọn “Không gửi email nào”) rồi mới xoá.`
      );
      return;
    }
    const arr = templates.slice();
    arr.splice(index, 1);
    setTemplates(arr);
    message.success("Đã xoá mẫu email.");
  };

  return (
    <div>
      <EditorCard
        title="Mẫu email"
        extra={
          <Space orientation="horizontal" size="small">
            <SaveStatusTag status={status} />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="cursor-pointer"
              onClick={themMau}
            >
              Thêm mẫu mới
            </Button>
          </Space>
        }
      >
        <p className="mb-3 text-sm opacity-60">
          Đây là nội dung những lá thư website <strong>tự động gửi đi</strong>{" "}
          mỗi khi có người đăng ký: thư cảm ơn gửi cho{" "}
          <strong>người đăng ký</strong>, và thư báo tin gửi cho{" "}
          <strong>Ban tổ chức</strong>. Mỗi form đăng ký tự chọn dùng mẫu nào —
          chọn ở mục <strong>Form đăng ký</strong>, trong chính form đó.
        </p>

        <Table<EmailTemplate>
          size="small"
          rowKey={(t, i) => `${t.id}-${i}`}
          dataSource={templates}
          pagination={false}
          scroll={{ x: "max-content" }}
          columns={[
            {
              title: "Tên mẫu",
              key: "name",
              render: (_, t) => (
                <div>
                  <div className="font-medium">
                    {t.name.trim() || (
                      <span className="opacity-40">(chưa đặt tên mẫu)</span>
                    )}
                  </div>
                  {t.note?.trim() ? (
                    <div className="text-xs opacity-60">{t.note}</div>
                  ) : null}
                </div>
              ),
            },
            {
              title: "Gửi cho ai",
              key: "sendTo",
              width: 150,
              render: (_, t) => (
                <Tag color={t.sendTo === "nguoi-dang-ky" ? "green" : "blue"}>
                  {NHAN_GUI_CHO[t.sendTo]}
                </Tag>
              ),
            },
            {
              title: "Tiêu đề email",
              key: "subject",
              render: (_, t) =>
                t.subject.trim() ? (
                  <span className="text-xs opacity-70">{t.subject}</span>
                ) : (
                  <Tag color="error">Chưa có tiêu đề</Tag>
                ),
            },
            {
              title: "Form đang dùng mẫu này",
              key: "dungBoi",
              render: (_, t) => {
                const dungBoi = formDangDung(t.id);
                if (dungBoi.length === 0)
                  return (
                    <span className="text-xs opacity-40">
                      Chưa form nào dùng
                    </span>
                  );
                return (
                  <Space orientation="horizontal" size={4} wrap>
                    {dungBoi.map((f) => (
                      <Tag key={f.id}>{f.name.trim() || f.id}</Tag>
                    ))}
                  </Space>
                );
              },
            },
            {
              title: "Thao tác",
              key: "thaoTac",
              render: (_, t, index) => {
                const dungBoi = formDangDung(t.id);
                return (
                  <Space orientation="horizontal" size={4} wrap>
                    <Button
                      size="small"
                      type="primary"
                      icon={<EditOutlined />}
                      className="cursor-pointer"
                      onClick={() => router.push(`/admin/mau-email/${t.id}`)}
                    >
                      Sửa
                    </Button>
                    <Button
                      size="small"
                      icon={<SnippetsOutlined />}
                      className="cursor-pointer"
                      onClick={() => nhanBan(index)}
                    >
                      Nhân bản
                    </Button>
                    {dungBoi.length > 0 ? (
                      <Tooltip
                        title={`Mẫu này đang được form “${dungBoi[0].name.trim() || dungBoi[0].id}” dùng nên chưa xoá được.`}
                      >
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          className="cursor-pointer"
                          onClick={() => xoaMau(index)}
                        >
                          Xoá
                        </Button>
                      </Tooltip>
                    ) : (
                      <Popconfirm
                        title="Xoá mẫu email này?"
                        description="Mẫu sẽ biến mất khỏi danh sách chọn của các form đăng ký."
                        okText="Xoá"
                        cancelText="Huỷ"
                        onConfirm={() => xoaMau(index)}
                      >
                        <Button
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          className="cursor-pointer"
                        >
                          Xoá
                        </Button>
                      </Popconfirm>
                    )}
                  </Space>
                );
              },
            },
          ]}
        />
      </EditorCard>
    </div>
  );
}
