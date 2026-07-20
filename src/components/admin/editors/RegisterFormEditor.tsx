"use client";

// TRANG chi tiết của MỘT form đăng ký (/admin/dang-ky/<đường dẫn>).
//
// Toàn bộ phần nhập nội dung của một form nằm ở đây: tên form, đường dẫn chia
// sẻ, chữ giới thiệu, các ô nhập, email nhận thông báo, mẫu email gửi đi và
// khung xem trước. Mọi thay đổi tự lưu nháp; bấm "Xuất bản" ở thanh trên cùng
// mới hiện ra website.
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  App,
  Alert,
  Button,
  Input,
  Result,
  Select,
  Space,
  Switch,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  CopyOutlined,
  ExportOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  ListEditor,
  LinkInput,
} from "../editorKit";
import {
  activeRegisterForm,
  REGISTER_SLUG_RE,
  toRegisterSlug,
  type RegisterField,
  type RegisterFieldType,
  type RegisterForm,
  type RegisterHighlight,
} from "@/lib/content/schema";
import type { EmailTemplate } from "@/lib/content/email-templates";

/** Tên gọi dễ hiểu cho từng kiểu ô nhập. */
const FIELD_TYPES: { value: RegisterFieldType; label: string }[] = [
  { value: "text", label: "Chữ ngắn — một dòng" },
  { value: "email", label: "Email — kiểm tra đúng định dạng" },
  { value: "tel", label: "Số điện thoại" },
  { value: "date", label: "Ngày tháng — có lịch để chọn" },
  { value: "textarea", label: "Đoạn văn dài — nhiều dòng" },
  { value: "select", label: "Danh sách chọn sẵn" },
  { value: "photo", label: "Ảnh — khách tự tải ảnh lên" },
];

const TYPE_LABEL: Record<RegisterFieldType, string> = Object.fromEntries(
  FIELD_TYPES.map((t) => [t.value, t.label])
) as Record<RegisterFieldType, string>;

const INPUT_CLASS =
  "w-full rounded-xl border border-leaf/20 bg-white/80 px-4 py-3 text-forest outline-none placeholder:text-forest/40";

/** Giá trị trong ô chọn mẫu email khi không muốn gửi gì cả. */
const KHONG_GUI = "khong-gui";

/** Mã trường không trùng nhau, sinh tự động cho ô nhập mới. */
function newFieldName(existing: RegisterField[]): string {
  let i = existing.length + 1;
  const taken = new Set(existing.map((f) => f.name));
  while (taken.has(`truong_${i}`)) i += 1;
  return `truong_${i}`;
}

export default function RegisterFormEditor({
  initialForms,
  initialActiveId,
  formId,
  templates,
}: {
  initialForms: RegisterForm[];
  initialActiveId: string;
  /** Đường dẫn của form đang mở, lấy từ địa chỉ trang. */
  formId: string;
  templates: EmailTemplate[];
}) {
  const { message } = App.useApp();
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

  // Tìm form theo đường dẫn ĐÚNG MỘT LẦN lúc mở trang: sau đó người dùng có
  // thể tự đổi đường dẫn, nhưng vị trí trong danh sách thì không đổi.
  const [index] = useState(() =>
    initialForms.findIndex((f) => f.id === formId)
  );
  const form = index >= 0 ? forms[index] : undefined;

  // Đổi đường dẫn -> sửa luôn địa chỉ trên thanh trình duyệt để bấm F5 không
  // rơi vào trang "không tìm thấy" (không tải lại trang, không mất chỗ đang gõ).
  useEffect(() => {
    if (!form) return;
    if (!REGISTER_SLUG_RE.test(form.id)) return;
    const dung = `/admin/dang-ky/${form.id}`;
    if (window.location.pathname !== dung) {
      window.history.replaceState(null, "", dung);
    }
  }, [form]);

  if (!form) {
    return (
      <Result
        status="404"
        title="Không tìm thấy form đăng ký này"
        subTitle={`Không có form nào mang đường dẫn “${formId}”. Có thể form đã bị xoá, hoặc đường dẫn vừa được đổi thành tên khác.`}
        extra={
          <Link href="/admin/dang-ky">
            <Button type="primary" className="cursor-pointer">
              Về danh sách form
            </Button>
          </Link>
        }
      />
    );
  }

  const dangHien = (activeRegisterForm(forms, activeId)?.id ?? "") === form.id;
  const slugKhac = forms.filter((_, i) => i !== index).map((f) => f.id);

  /** Ghi đè form đang sửa vào danh sách. */
  const onChange = (next: RegisterForm) => {
    const arr = forms.slice();
    const truoc = arr[index];
    arr[index] = next;
    setForms(arr);
    // Đổi đường dẫn của chính form đang hiện ở trang chủ -> giữ nó vẫn hiện.
    if (truoc.id === activeId && next.id !== truoc.id) setActiveId(next.id);
  };

  const set = <K extends keyof RegisterForm>(key: K, v: RegisterForm[K]) =>
    onChange({ ...form, [key]: v });

  const slugSai = !REGISTER_SLUG_RE.test(form.id);
  const slugTrung = slugKhac.includes(form.id);
  const linkChiaSe =
    typeof window === "undefined"
      ? `/dang-ky/${form.id}`
      : `${window.location.origin}/dang-ky/${form.id}`;

  const missingLabel = form.fields.filter((f) => !f.label.trim()).length;
  const duplicateName =
    new Set(form.fields.map((f) => f.name.trim())).size !== form.fields.length;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(linkChiaSe);
      message.success(
        "Đã sao chép link. Dán vào tin nhắn để gửi cho mọi người."
      );
    } catch {
      message.error(
        "Trình duyệt không cho sao chép. Bạn bôi đen link rồi copy tay nhé."
      );
    }
  };

  /** Danh sách lựa chọn cho một ô chọn mẫu email. */
  const chonMau = (gui: EmailTemplate["sendTo"]) => [
    { value: KHONG_GUI, label: "Không gửi email nào" },
    ...templates
      .filter((t) => t.sendTo === gui)
      .map((t) => ({
        value: t.id,
        label: t.name.trim() || "(mẫu chưa đặt tên)",
      })),
  ];

  return (
    <div>
      {/* ---------------- Thanh đầu trang ---------------- */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/admin/dang-ky">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            className="cursor-pointer"
          >
            Về danh sách form
          </Button>
        </Link>
        <Space orientation="horizontal" size="small">
          <SaveStatusTag status={status} />
          <SaveStatusTag status={activeStatus} />
        </Space>
      </div>

      {/* ---------------- Nhận diện form ---------------- */}
      <EditorCard title="Tên form & đường dẫn chia sẻ">
        <p className="mb-3 text-sm opacity-60">
          Tên form <strong>chỉ Ban tổ chức nhìn thấy</strong> (trong danh sách
          form và trong email báo có người đăng ký). Đường dẫn là phần đuôi của
          link gửi cho mọi người.
        </p>

        <Field
          label="Tên form"
          hint="Đặt tên dễ nhớ để phân biệt các đợt, vd: Langbiang 2026, Tuyển CTV truyền thông."
        >
          <Input
            value={form.name}
            placeholder="Langbiang 2026"
            status={form.name.trim() ? undefined : "error"}
            onChange={(e) => {
              const name = e.target.value;
              // Form còn để đường dẫn mặc định -> gợi ý đường dẫn theo tên.
              const nenGoiY =
                !form.id ||
                form.id.startsWith("form-dang-ky") ||
                form.id === toRegisterSlug(form.name);
              const goiY = toRegisterSlug(name);
              onChange({
                ...form,
                name,
                id: nenGoiY && goiY ? goiY : form.id,
              });
            }}
          />
        </Field>

        <Field
          label="Đường dẫn (phần sau /dang-ky/)"
          hint="Chỉ chữ thường không dấu, số và dấu gạch ngang. Đổi đường dẫn thì link cũ đã gửi cho mọi người sẽ không mở được nữa."
        >
          <Input
            value={form.id}
            addonBefore="/dang-ky/"
            placeholder="langbiang-2026"
            status={slugSai || slugTrung ? "error" : undefined}
            onChange={(e) => set("id", e.target.value.trim())}
          />
        </Field>

        {slugSai ? (
          <Alert
            className="mb-3"
            type="error"
            showIcon
            title="Đường dẫn chưa đúng định dạng."
            description="Chỉ dùng chữ thường không dấu, số và dấu gạch ngang, vd: langbiang-2026."
          />
        ) : null}
        {slugTrung ? (
          <Alert
            className="mb-3"
            type="error"
            showIcon
            title="Đường dẫn này đã có form khác dùng rồi."
            description="Hai form trùng đường dẫn sẽ khiến link chia sẻ mở nhầm form. Hãy đổi thành đường dẫn khác."
          />
        ) : null}

        <Field
          label="Link chia sẻ đầy đủ"
          hint="Đây là link gửi cho tình nguyện viên. Trang này chỉ có mỗi form, mở rất nhẹ."
        >
          <Space orientation="horizontal" size="small" wrap>
            <Input
              readOnly
              value={linkChiaSe}
              style={{ minWidth: 300 }}
              onFocus={(e) => e.currentTarget.select()}
            />
            <Button
              icon={<CopyOutlined />}
              className="cursor-pointer"
              disabled={slugSai}
              onClick={copyLink}
            >
              Sao chép link chia sẻ
            </Button>
            <Button
              icon={<ExportOutlined />}
              className="cursor-pointer"
              disabled={slugSai}
              onClick={() =>
                window.open(`/dang-ky/${form.id}`, "_blank", "noopener")
              }
            >
              Mở thử ở tab mới
            </Button>
          </Space>
        </Field>

        <Tooltip
          title={
            dangHien
              ? "Trang chủ đang hiện chính form này."
              : "Khối Đăng ký ngoài trang chủ sẽ chuyển sang hiện form này."
          }
        >
          <Button
            type={dangHien ? "default" : "primary"}
            icon={<HomeOutlined />}
            className="cursor-pointer"
            disabled={dangHien}
            onClick={() => {
              setActiveId(form.id);
              message.success(
                "Trang chủ sẽ hiện form này sau khi bấm Xuất bản."
              );
            }}
          >
            {dangHien
              ? "Đang hiển thị ở trang chủ"
              : "Đặt làm form hiển thị ở trang chủ"}
          </Button>
        </Tooltip>
      </EditorCard>

      {/* ---------------- Chữ giới thiệu ---------------- */}
      <EditorCard title="Chữ giới thiệu quanh form">
        <p className="mb-3 text-sm opacity-60">
          Ở <strong>trang chủ</strong> phần chữ này nằm bên trái form trên nền
          xanh; ở <strong>trang chia sẻ riêng</strong> nó nằm ngay phía trên
          form.
        </p>

        <Field
          label="Nhãn nhỏ phía trên tiêu đề"
          hint="Dòng chữ in hoa trong viên thuốc mờ, vd: Tham gia cùng chúng mình."
        >
          <Input
            value={form.eyebrow}
            placeholder="Tham gia cùng chúng mình"
            onChange={(e) => set("eyebrow", e.target.value)}
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tiêu đề — dòng trên" hint="Chữ in đậm thường.">
            <Input
              value={form.title}
              placeholder="Cùng thắp sáng"
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>
          <Field
            label="Tiêu đề — dòng dưới"
            hint="Hiện bằng phông chữ viết tay, cỡ to hơn dòng trên."
          >
            <Input
              value={form.titleHighlight}
              placeholder="một mùa trăng yêu thương"
              onChange={(e) => set("titleHighlight", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Đoạn giới thiệu ngắn" hint="2–3 dòng là vừa đẹp.">
          <Input.TextArea
            value={form.description}
            rows={3}
            showCount
            maxLength={400}
            placeholder="Dù bạn trực tiếp lên đường hay đồng hành từ xa…"
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
      </EditorCard>

      {/* ---------------- Thẻ vai trò ---------------- */}
      <EditorCard title="Các thẻ vai trò">
        <p className="mb-3 text-sm opacity-60">
          Những ô vuông nhỏ nằm dưới đoạn giới thiệu ở{" "}
          <strong>trang chủ</strong>, mỗi ô nói về một cách tham gia. Kéo để đổi
          thứ tự. Để trống cũng được.
        </p>
        <ListEditor<RegisterHighlight>
          value={form.highlights}
          onChange={(highlights) => set("highlights", highlights)}
          addLabel="Thêm thẻ vai trò"
          newItem={() => ({ icon: "🌙", title: "", desc: "" })}
          getSummary={(item) =>
            `${item.icon || "•"} ${item.title || "(chưa có tên)"}`
          }
          renderItem={(item, updateItem) => (
            <div className="grid gap-3 md:grid-cols-[110px_1fr]">
              <Field label="Biểu tượng" hint="Một ký tự emoji.">
                <Input
                  value={item.icon}
                  placeholder="🙋"
                  onChange={(e) =>
                    updateItem({ ...item, icon: e.target.value })
                  }
                />
              </Field>
              <div>
                <Field label="Tên vai trò">
                  <Input
                    value={item.title}
                    placeholder="Tình nguyện viên"
                    status={item.title.trim() ? undefined : "error"}
                    onChange={(e) =>
                      updateItem({ ...item, title: e.target.value })
                    }
                  />
                </Field>
                <Field label="Mô tả ngắn">
                  <Input
                    value={item.desc}
                    placeholder="Trực tiếp tham gia hành trình 26–27/9"
                    onChange={(e) =>
                      updateItem({ ...item, desc: e.target.value })
                    }
                  />
                </Field>
              </div>
            </div>
          )}
        />
      </EditorCard>

      {/* ---------------- Các ô nhập ---------------- */}
      <EditorCard title="Các ô nhập của form">
        <p className="mb-3 text-sm opacity-60">
          Đây là những ô mà khách phải điền khi đăng ký. Thêm, xoá hoặc kéo để
          đổi thứ tự — thay đổi hiện ngay ở khung <strong>Xem trước</strong>{" "}
          phía dưới. Mỗi lượt khách gửi đều được lưu lại và xem được ở mục{" "}
          <strong>Đăng ký nhận được</strong> (nhớ chọn đúng form này).
        </p>

        {missingLabel > 0 ? (
          <Alert
            className="mb-3"
            type="warning"
            showIcon
            title={`Có ${missingLabel} ô chưa đặt tên.`}
            description="Ô không có tên sẽ khiến khách không biết cần điền gì."
          />
        ) : null}
        {duplicateName ? (
          <Alert
            className="mb-3"
            type="warning"
            showIcon
            title="Có hai ô trùng mã trường."
            description="Mỗi ô cần một mã riêng để dữ liệu không lẫn vào nhau."
          />
        ) : null}

        <Field label="Tiêu đề phía trên form">
          <Input
            value={form.formTitle}
            placeholder="Đăng ký đồng hành"
            onChange={(e) => set("formTitle", e.target.value)}
          />
        </Field>

        <ListEditor<RegisterField>
          value={form.fields}
          onChange={(fields) => set("fields", fields)}
          addLabel="Thêm ô nhập"
          newItem={() => ({
            name: newFieldName(form.fields),
            label: "",
            type: "text" as RegisterFieldType,
            placeholder: "",
            required: false,
          })}
          getSummary={(item) =>
            `${item.label || "(chưa đặt tên)"} — ${TYPE_LABEL[item.type] ?? item.type}${
              item.required ? " · bắt buộc" : ""
            }`
          }
          renderItem={(item, updateItem) => (
            <div className="w-full">
              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Tên ô (khách nhìn thấy)"
                  hint="Vd: Họ và tên, Số điện thoại."
                >
                  <Input
                    value={item.label}
                    placeholder="Họ và tên"
                    status={item.label.trim() ? undefined : "error"}
                    onChange={(e) =>
                      updateItem({ ...item, label: e.target.value })
                    }
                  />
                </Field>
                <Field
                  label="Kiểu nội dung"
                  hint="Chọn đúng kiểu để khách gõ dễ hơn (bàn phím số, lịch chọn ngày, chọn ảnh từ máy…)."
                >
                  <Select<RegisterFieldType>
                    className="w-full cursor-pointer"
                    value={item.type}
                    options={FIELD_TYPES}
                    onChange={(type) =>
                      updateItem({
                        ...item,
                        type,
                        // Chuyển sang danh sách chọn -> tạo sẵn 1 lựa chọn trống.
                        options:
                          type === "select" ? (item.options ?? [""]) : undefined,
                      })
                    }
                  />
                </Field>
              </div>

              {item.type === "photo" ? (
                <Alert
                  className="mb-3"
                  type="info"
                  showIcon
                  title="Ô ảnh: khách chọn ảnh từ máy và tải lên ngay khi điền form."
                  description="Ảnh chỉ nhận jpg/png/webp và nhẹ hơn 5MB. Gửi xong, ảnh tự vào Kho ảnh — album “Tình nguyện viên”, đặt tên theo tên người đăng ký."
                />
              ) : null}

              {item.type === "select" ? (
                <Field
                  label="Các lựa chọn"
                  hint="Khách sẽ chọn một trong những dòng này."
                >
                  <ListEditor<string>
                    value={item.options ?? []}
                    onChange={(options) => updateItem({ ...item, options })}
                    addLabel="Thêm lựa chọn"
                    newItem={() => ""}
                    getSummary={(opt, i) =>
                      opt.trim() || `(lựa chọn ${i + 1} chưa có chữ)`
                    }
                    renderItem={(opt, updateOpt) => (
                      <Input
                        value={opt}
                        placeholder="Tình nguyện viên"
                        status={opt.trim() ? undefined : "error"}
                        onChange={(e) => updateOpt(e.target.value)}
                      />
                    )}
                  />
                </Field>
              ) : (
                <Field
                  label={
                    item.type === "photo"
                      ? "Dòng nhắc dưới nút chọn ảnh"
                      : "Chữ gợi ý trong ô"
                  }
                  hint={
                    item.type === "photo"
                      ? "Vd: Ảnh chân dung rõ mặt. Bỏ trống thì hiện lời nhắc mặc định."
                      : "Chữ mờ hiện sẵn khi ô còn trống. Bỏ trống cũng được."
                  }
                >
                  <Input
                    value={item.placeholder ?? ""}
                    placeholder={
                      item.type === "photo"
                        ? "Ảnh chân dung rõ mặt"
                        : "Nguyễn Văn A"
                    }
                    onChange={(e) =>
                      updateItem({ ...item, placeholder: e.target.value })
                    }
                  />
                </Field>
              )}

              <div className="grid gap-3 md:grid-cols-2">
                <Field
                  label="Bắt buộc điền"
                  hint="Bật thì khách phải điền mới gửi được, và ô có dấu * màu cam."
                >
                  <Switch
                    className="cursor-pointer"
                    checked={!!item.required}
                    onChange={(required) => updateItem({ ...item, required })}
                  />
                </Field>
                <Field
                  label="Mã trường"
                  hint="Dùng cho hệ thống, khách không nhìn thấy. Không dấu, không khoảng trắng."
                >
                  <Input
                    value={item.name}
                    placeholder="ho_ten"
                    status={item.name.trim() ? undefined : "error"}
                    onChange={(e) =>
                      updateItem({ ...item, name: e.target.value })
                    }
                  />
                </Field>
              </div>
            </div>
          )}
        />

        <div className="mt-4">
          <Field label="Chữ trên nút gửi">
            <Input
              value={form.submitLabel}
              placeholder="Gửi đăng ký 🌙"
              onChange={(e) => set("submitLabel", e.target.value)}
            />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Dòng chữ dưới nút gửi"
              hint="Vd: Hoặc liên hệ trực tiếp qua"
            >
              <Input
                value={form.contactNote}
                placeholder="Hoặc liên hệ trực tiếp qua"
                onChange={(e) => set("contactNote", e.target.value)}
              />
            </Field>
            <Field
              label="Chữ trên liên kết Fanpage"
              hint="Địa chỉ Fanpage lấy từ mục Thương hiệu & SEO nên không sửa ở đây."
            >
              <Input
                value={form.contactLinkLabel}
                placeholder="Fanpage Facebook"
                onChange={(e) => set("contactLinkLabel", e.target.value)}
              />
            </Field>
          </div>
        </div>
      </EditorCard>

      {/* ---------------- Nơi nhận ---------------- */}
      <EditorCard title="Nơi nhận đăng ký">
        <p className="mb-3 text-sm opacity-60">
          Khách bấm gửi xong, thông tin sẽ được <strong>lưu lại</strong> (xem ở
          mục <strong>Đăng ký nhận được</strong>, chọn form{" "}
          <strong>{form.name.trim() || form.id}</strong>) và{" "}
          <strong>gửi một email báo tin</strong> về địa chỉ dưới đây.
        </p>
        <Field
          label="Email nhận thông báo đăng ký"
          hint={
            <>
              Đây là hộp thư <strong>nội bộ của Ban tổ chức</strong> để nhận tin
              mỗi khi có người đăng ký vào <strong>form này</strong> —{" "}
              <strong>khác</strong> với email công khai ở mục{" "}
              <em>Thương hiệu &amp; SEO</em> (email đó in trên website cho khách
              liên hệ). Bỏ trống thì hệ thống gửi tạm về email công khai đó. Bấm
              nút cuối ô để thử soạn thư tới địa chỉ này.
            </>
          }
        >
          <LinkInput
            value={form.recipientEmail ?? ""}
            placeholder="bantochuc@gmail.com"
            onChange={(e) => set("recipientEmail", e.target.value)}
          />
        </Field>
        <Alert
          type="info"
          showIcon
          title="Không nhận được email cũng đừng lo."
          description="Dù email có trục trặc, mọi lượt đăng ký vẫn được lưu đầy đủ trong mục “Đăng ký nhận được”."
        />
      </EditorCard>

      {/* ---------------- Email tự động ---------------- */}
      <EditorCard title="Email tự động gửi khi có người đăng ký">
        <p className="mb-3 text-sm opacity-60">
          Nội dung của các email này soạn ở mục{" "}
          <Link href="/admin/mau-email" className="cursor-pointer underline">
            Mẫu email
          </Link>
          . Ở đây bạn chỉ chọn form này dùng mẫu nào.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Email cảm ơn gửi người đăng ký"
            hint="Gửi tới địa chỉ email khách vừa điền trong form. Form không có ô email thì hệ thống bỏ qua."
          >
            <Select<string>
              className="w-full cursor-pointer"
              value={form.confirmTemplateId || KHONG_GUI}
              options={chonMau("nguoi-dang-ky")}
              onChange={(v) =>
                set("confirmTemplateId", v === KHONG_GUI ? "" : v)
              }
            />
          </Field>
          <Field
            label="Email báo cho Ban tổ chức"
            hint="Gửi tới hộp thư đã điền ở mục “Nơi nhận đăng ký” phía trên."
          >
            <Select<string>
              className="w-full cursor-pointer"
              value={form.notifyTemplateId || KHONG_GUI}
              options={chonMau("ban-to-chuc")}
              onChange={(v) =>
                set("notifyTemplateId", v === KHONG_GUI ? "" : v)
              }
            />
          </Field>
        </div>

        <Alert
          type="info"
          showIcon
          title="Muốn sửa lời văn trong email?"
          description={
            <>
              Vào mục{" "}
              <Link href="/admin/mau-email" className="cursor-pointer underline">
                Mẫu email
              </Link>{" "}
              để soạn lại nội dung, rồi quay về đây chọn mẫu cho form.
            </>
          }
        />
      </EditorCard>

      {/* ---------------- Màn cảm ơn ---------------- */}
      <EditorCard title="Màn hình cảm ơn">
        <p className="mb-3 text-sm opacity-60">
          Hiện lên thay cho form ngay sau khi khách bấm nút gửi.
        </p>
        <Field label="Lời cảm ơn (chữ to)">
          <Input
            value={form.successTitle}
            placeholder="Cảm ơn bạn rất nhiều!"
            onChange={(e) => set("successTitle", e.target.value)}
          />
        </Field>
        <Field label="Dòng giải thích phía dưới">
          <Input.TextArea
            value={form.successNote}
            rows={2}
            showCount
            maxLength={300}
            placeholder="Ban tổ chức sẽ liên hệ với bạn trong thời gian sớm nhất…"
            onChange={(e) => set("successNote", e.target.value)}
          />
        </Field>
        <Field
          label="Chữ trên nút quay lại form"
          hint="Bấm vào sẽ mở lại form trống để đăng ký thêm người khác."
        >
          <Input
            value={form.successAgainLabel}
            placeholder="Gửi đăng ký khác"
            onChange={(e) => set("successAgainLabel", e.target.value)}
          />
        </Field>
      </EditorCard>

      {/* ---------------- Xem trước ---------------- */}
      <EditorCard title="Xem trước form">
        <p className="mb-3 text-sm opacity-60">
          Đây là hình dung gần đúng của form trên web. Khung này{" "}
          <strong>chỉ để xem</strong> — gõ thử vào đây không lưu gì cả.
        </p>
        <div className="rounded-2xl bg-gradient-to-br from-leaf-deep to-grass p-4">
          <div className="rounded-2xl bg-white/85 p-5 text-forest">
            <h3 className="text-xl font-bold text-leaf-deep">
              {form.formTitle || "(chưa có tiêu đề)"}
            </h3>
            <div className="mt-4 space-y-3">
              {form.fields.length === 0 ? (
                <p className="py-6 text-center text-sm text-forest/50">
                  Chưa có ô nhập nào — bấm “Thêm ô nhập” phía trên.
                </p>
              ) : (
                form.fields.map((f, i) => (
                  <FieldPreview key={f.name || i} field={f} index={i} />
                ))
              )}
            </div>
            <div className="mt-4 w-full rounded-full bg-gradient-to-r from-leaf-deep to-leaf py-2.5 text-center text-sm font-semibold text-white">
              {form.submitLabel || "(chưa có chữ trên nút)"}
            </div>
            <p className="mt-2 text-center text-xs text-forest/60">
              {form.contactNote}{" "}
              <span className="font-semibold text-leaf-deep underline">
                {form.contactLinkLabel}
              </span>
            </p>
          </div>
        </div>
      </EditorCard>
    </div>
  );
}

/** Một ô nhập trong khung xem trước — chỉ để nhìn, không bấm được. */
function FieldPreview({
  field,
  index,
}: {
  field: RegisterField;
  index: number;
}) {
  const label = field.label.trim() || `(ô ${index + 1} chưa đặt tên)`;
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-forest/80">
        {label}
        {field.required ? <span className="text-sunset"> *</span> : null}
      </label>
      {field.type === "textarea" ? (
        <textarea
          rows={3}
          disabled
          placeholder={field.placeholder}
          className={`${INPUT_CLASS} resize-none`}
        />
      ) : field.type === "select" ? (
        <select disabled className={INPUT_CLASS}>
          {(field.options ?? []).map((opt, i) => (
            <option key={i}>{opt || `(lựa chọn ${i + 1} chưa có chữ)`}</option>
          ))}
        </select>
      ) : field.type === "photo" ? (
        <div className="flex items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-leaf/40 text-xl">
            🖼️
          </div>
          <div>
            <div className="rounded-full border-2 border-leaf/30 px-4 py-1.5 text-sm font-semibold text-leaf-deep">
              Chọn ảnh
            </div>
            <p className="mt-1 text-xs text-forest/60">
              {field.placeholder?.trim() ||
                "Ảnh jpg, png hoặc webp, nhẹ hơn 5MB."}
            </p>
          </div>
        </div>
      ) : (
        <input
          type={field.type}
          disabled
          placeholder={field.placeholder}
          className={INPUT_CLASS}
        />
      )}
    </div>
  );
}
