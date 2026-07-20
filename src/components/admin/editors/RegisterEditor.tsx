"use client";

// Mục "Form đăng ký" — DANH SÁCH tất cả form đăng ký của website.
//
// Mỗi form là một đợt tuyển riêng, có đường dẫn riêng để gửi cho mọi người
// (vd /dang-ky/langbiang-2026) và một danh sách đăng ký riêng. Đúng MỘT form
// được chọn để hiện ở khối "Đăng ký" ngoài trang chủ.
//
// Bấm "Sửa" ở một dòng sẽ mở TRANG chi tiết riêng của form đó
// (/admin/dang-ky/<đường dẫn>), không còn dùng bảng trượt bên hông nữa.
import { useRouter } from "next/navigation";
import { App, Alert, Button, Popconfirm, Space, Table, Tag, Tooltip } from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  ExportOutlined,
  HomeOutlined,
  PlusOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { useSectionAutosave, SaveStatusTag, EditorCard } from "../editorKit";
import {
  activeRegisterForm,
  REGISTER_SLUG_RE,
  toRegisterSlug,
  type RegisterForm,
} from "@/lib/content/schema";

/** Đường dẫn chưa ai dùng (thêm đuôi -2, -3… nếu trùng). */
export function slugChuaDung(goc: string, dangDung: string[]): string {
  const base = toRegisterSlug(goc) || "form-dang-ky";
  if (!dangDung.includes(base)) return base;
  let i = 2;
  while (dangDung.includes(`${base}-${i}`)) i += 1;
  return `${base}-${i}`;
}

/** Form trống cho nút "Thêm form mới". */
function formMoi(dangDung: string[]): RegisterForm {
  return {
    id: slugChuaDung("form-dang-ky", dangDung),
    name: "Form đăng ký mới",
    eyebrow: "Tham gia cùng chúng mình",
    title: "Cùng thắp sáng",
    titleHighlight: "một mùa trăng yêu thương",
    description: "",
    highlights: [],
    formTitle: "Đăng ký đồng hành",
    fields: [
      {
        name: "name",
        label: "Họ và tên",
        type: "text",
        placeholder: "Nguyễn Văn A",
        required: true,
      },
      {
        name: "phone",
        label: "Số điện thoại",
        type: "tel",
        placeholder: "09xx xxx xxx",
        required: true,
      },
    ],
    submitLabel: "Gửi đăng ký 🌙",
    successTitle: "Cảm ơn bạn rất nhiều!",
    successNote: "Ban tổ chức sẽ liên hệ với bạn trong thời gian sớm nhất.",
    successAgainLabel: "Gửi đăng ký khác",
    contactNote: "Hoặc liên hệ trực tiếp qua",
    contactLinkLabel: "Fanpage Facebook",
    recipientEmail: "",
  };
}

export default function RegisterEditor({
  initialForms,
  initialActiveId,
}: {
  initialForms: RegisterForm[];
  initialActiveId: string;
}) {
  const { message } = App.useApp();
  const router = useRouter();
  const {
    value: forms,
    update: setForms,
    status,
  } = useSectionAutosave<RegisterForm[]>("main.registerForms", initialForms);
  const {
    value: activeId,
    update: setActiveId,
    status: activeStatus,
  } = useSectionAutosave<string>("main.activeRegisterFormId", initialActiveId);

  // Đường dẫn đã lưu có thể trỏ vào form đã xoá -> lùi về form đầu tiên như ngoài web.
  const dangHien = activeRegisterForm(forms, activeId)?.id ?? "";

  const slugTrung = forms
    .map((f) => f.id)
    .filter((id, i, arr) => arr.indexOf(id) !== i);
  const slugSai = forms.filter((f) => !REGISTER_SLUG_RE.test(f.id));

  const linkDayDu = (id: string) =>
    typeof window === "undefined"
      ? `/dang-ky/${id}`
      : `${window.location.origin}/dang-ky/${id}`;

  const themForm = () => {
    const moi = formMoi(forms.map((f) => f.id));
    setForms([...forms, moi]);
    message.success("Đã thêm form mới. Điền nội dung cho form ở trang này nhé.");
    router.push(`/admin/dang-ky/${moi.id}`);
  };

  const nhanBan = (index: number) => {
    const goc = forms[index];
    const ban = structuredClone(goc);
    ban.id = slugChuaDung(
      `${goc.id}-ban-sao`,
      forms.map((f) => f.id)
    );
    ban.name = `${goc.name} (bản sao)`;
    setForms([...forms.slice(0, index + 1), ban, ...forms.slice(index + 1)]);
    message.success("Đã nhân bản. Nhớ đổi tên và đường dẫn cho form mới nhé.");
  };

  const xoaForm = (index: number) => {
    if (forms.length <= 1) {
      message.warning(
        "Không xoá được form cuối cùng. Hãy thêm một form mới trước đã."
      );
      return;
    }
    const arr = forms.slice();
    arr.splice(index, 1);
    setForms(arr);
    message.success("Đã xoá form. Bấm Xuất bản để cập nhật ra website.");
  };

  const copyLink = async (id: string) => {
    try {
      await navigator.clipboard.writeText(linkDayDu(id));
      message.success(
        "Đã sao chép link. Dán vào tin nhắn để gửi cho mọi người."
      );
    } catch {
      message.error(
        "Trình duyệt không cho sao chép. Bạn mở form rồi bôi đen link để chép tay nhé."
      );
    }
  };

  return (
    <div>
      <EditorCard
        title="Các form đăng ký"
        extra={
          <Space orientation="horizontal" size="small">
            <SaveStatusTag status={status} />
            <SaveStatusTag status={activeStatus} />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="cursor-pointer"
              onClick={themForm}
            >
              Thêm form mới
            </Button>
          </Space>
        }
      >
        <p className="mb-3 text-sm opacity-60">
          Mỗi dòng là một <strong>form đăng ký</strong> riêng. Form nào cũng có
          đường dẫn riêng để gửi cho mọi người, và một danh sách đăng ký riêng ở
          mục <strong>Đăng ký nhận được</strong>. Ngoài <strong>trang chủ</strong>{" "}
          chỉ hiện đúng một form — form có nhãn{" "}
          <em>Đang hiện ở trang chủ</em>. Bấm <strong>Sửa</strong> để mở trang
          chỉnh sửa của form.
        </p>

        {slugTrung.length > 0 ? (
          <Alert
            className="mb-3"
            type="error"
            showIcon
            title="Có hai form trùng đường dẫn."
            description={`Đường dẫn bị trùng: ${[...new Set(slugTrung)].join(", ")}. Mỗi form cần một đường dẫn riêng, nếu không link chia sẻ sẽ mở nhầm form.`}
          />
        ) : null}
        {slugSai.length > 0 ? (
          <Alert
            className="mb-3"
            type="warning"
            showIcon
            title={`Có ${slugSai.length} form đặt đường dẫn chưa đúng.`}
            description="Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch ngang — ví dụ: langbiang-2026."
          />
        ) : null}

        <Table<RegisterForm>
          size="small"
          rowKey={(f, i) => `${f.id}-${i}`}
          dataSource={forms}
          pagination={false}
          scroll={{ x: "max-content" }}
          columns={[
            {
              title: "Tên form",
              key: "name",
              render: (_, f) => (
                <div>
                  <div className="font-medium">
                    {f.name.trim() || (
                      <span className="opacity-40">(chưa đặt tên form)</span>
                    )}
                  </div>
                  {f.id === dangHien ? (
                    <Tag color="green" className="mt-1">
                      Đang hiện ở trang chủ
                    </Tag>
                  ) : null}
                </div>
              ),
            },
            {
              title: "Đường dẫn chia sẻ",
              key: "id",
              render: (_, f) =>
                REGISTER_SLUG_RE.test(f.id) ? (
                  <span className="text-xs opacity-70">/dang-ky/{f.id}</span>
                ) : (
                  <Tag color="error">Đường dẫn chưa đúng</Tag>
                ),
            },
            {
              title: "Số ô nhập",
              key: "fields",
              width: 100,
              render: (_, f) => `${f.fields.length} ô`,
            },
            {
              title: "Thao tác",
              key: "thaoTac",
              render: (_, f, index) => (
                <Space orientation="horizontal" size={4} wrap>
                  <Button
                    size="small"
                    type="primary"
                    icon={<EditOutlined />}
                    className="cursor-pointer"
                    onClick={() => router.push(`/admin/dang-ky/${f.id}`)}
                  >
                    Sửa
                  </Button>
                  <Tooltip title="Chép link để gửi cho mọi người">
                    <Button
                      size="small"
                      icon={<CopyOutlined />}
                      className="cursor-pointer"
                      disabled={!REGISTER_SLUG_RE.test(f.id)}
                      onClick={() => void copyLink(f.id)}
                    >
                      Sao chép link
                    </Button>
                  </Tooltip>
                  <Tooltip title="Xem form như người được gửi link (mở tab mới)">
                    <Button
                      size="small"
                      icon={<ExportOutlined />}
                      className="cursor-pointer"
                      disabled={!REGISTER_SLUG_RE.test(f.id)}
                      onClick={() =>
                        window.open(`/dang-ky/${f.id}`, "_blank", "noopener")
                      }
                    >
                      Mở thử
                    </Button>
                  </Tooltip>
                  <Tooltip
                    title={
                      f.id === dangHien
                        ? "Trang chủ đang hiện chính form này."
                        : "Khối Đăng ký ngoài trang chủ sẽ chuyển sang hiện form này."
                    }
                  >
                    <Button
                      size="small"
                      icon={<HomeOutlined />}
                      className="cursor-pointer"
                      disabled={f.id === dangHien}
                      onClick={() => {
                        setActiveId(f.id);
                        message.success(
                          "Trang chủ sẽ hiện form này sau khi bấm Xuất bản."
                        );
                      }}
                    >
                      Đặt làm form trang chủ
                    </Button>
                  </Tooltip>
                  <Button
                    size="small"
                    icon={<SnippetsOutlined />}
                    className="cursor-pointer"
                    onClick={() => nhanBan(index)}
                  >
                    Nhân bản
                  </Button>
                  <Popconfirm
                    title="Xoá form này?"
                    description="Link đã gửi cho mọi người sẽ không mở được nữa sau khi bấm Xuất bản. Các đăng ký đã nhận vẫn còn."
                    okText="Xoá"
                    cancelText="Huỷ"
                    onConfirm={() => xoaForm(index)}
                  >
                    <Button
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                      className="cursor-pointer"
                      disabled={forms.length <= 1}
                    >
                      Xoá
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
        />

        {forms.length <= 1 ? (
          <Alert
            className="mt-3"
            type="info"
            showIcon
            title="Website luôn cần ít nhất một form đăng ký."
            description="Muốn bỏ form này thì hãy thêm form mới trước, rồi mới xoá form cũ."
          />
        ) : null}
      </EditorCard>
    </div>
  );
}
