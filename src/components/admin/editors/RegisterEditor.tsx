"use client";

// Khối "Đăng ký" ở trang chủ — main.register.
// Gồm phần chữ giới thiệu bên trái, các thẻ vai trò, và toàn bộ cấu hình của
// form đăng ký (thêm/xoá/sửa/sắp xếp trường). Kèm khung xem trước để người
// biên tập thấy ngay form sẽ ra sao trên web.
import { Alert, Input, Select, Switch } from "antd";
import {
  useSectionAutosave,
  SaveStatusTag,
  EditorCard,
  Field,
  ListEditor,
  LinkInput,
} from "../editorKit";
import type {
  RegisterField,
  RegisterFieldType,
  RegisterHighlight,
  RegisterSection,
} from "@/lib/content/schema";

/** Tên gọi dễ hiểu cho từng kiểu ô nhập. */
const FIELD_TYPES: { value: RegisterFieldType; label: string }[] = [
  { value: "text", label: "Chữ ngắn — một dòng" },
  { value: "email", label: "Email — kiểm tra đúng định dạng" },
  { value: "tel", label: "Số điện thoại" },
  { value: "date", label: "Ngày tháng — có lịch để chọn" },
  { value: "textarea", label: "Đoạn văn dài — nhiều dòng" },
  { value: "select", label: "Danh sách chọn sẵn" },
];

const TYPE_LABEL: Record<RegisterFieldType, string> = Object.fromEntries(
  FIELD_TYPES.map((t) => [t.value, t.label])
) as Record<RegisterFieldType, string>;

const INPUT_CLASS =
  "w-full rounded-xl border border-leaf/20 bg-white/80 px-4 py-3 text-forest outline-none placeholder:text-forest/40";

/** Mã trường không trùng nhau, sinh tự động cho trường mới. */
function newFieldName(existing: RegisterField[]): string {
  let i = existing.length + 1;
  const taken = new Set(existing.map((f) => f.name));
  while (taken.has(`truong_${i}`)) i += 1;
  return `truong_${i}`;
}

export default function RegisterEditor({
  initial,
}: {
  initial: RegisterSection;
}) {
  const { value, update, status } = useSectionAutosave<RegisterSection>(
    "main.register",
    initial
  );

  const set = <K extends keyof RegisterSection>(
    key: K,
    v: RegisterSection[K]
  ) => update({ ...value, [key]: v });

  // Trường thiếu nhãn hoặc mã -> khách sẽ thấy ô nhập không có tên.
  const missingLabel = value.fields.filter((f) => !f.label.trim()).length;
  const duplicateName =
    new Set(value.fields.map((f) => f.name.trim())).size !==
    value.fields.length;

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_400px] xl:items-start">
      {/* ---------------- Cột trái: cấu hình ---------------- */}
      <div>
        <EditorCard
          title="Chữ giới thiệu bên trái"
          extra={<SaveStatusTag status={status} />}
        >
          <p className="mb-3 text-sm opacity-60">
            Phần chữ trên nền xanh, nằm bên trái form đăng ký ở{" "}
            <strong>trang chủ</strong>.
          </p>

          <Field
            label="Nhãn nhỏ phía trên tiêu đề"
            hint="Dòng chữ in hoa trong viên thuốc mờ, vd: Tham gia cùng chúng mình."
          >
            <Input
              value={value.eyebrow}
              placeholder="Tham gia cùng chúng mình"
              onChange={(e) => set("eyebrow", e.target.value)}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tiêu đề — dòng trên" hint="Chữ in đậm thường.">
              <Input
                value={value.title}
                placeholder="Cùng thắp sáng"
                onChange={(e) => set("title", e.target.value)}
              />
            </Field>
            <Field
              label="Tiêu đề — dòng dưới"
              hint="Hiện bằng phông chữ viết tay, cỡ to hơn dòng trên."
            >
              <Input
                value={value.titleHighlight}
                placeholder="một mùa trăng yêu thương"
                onChange={(e) => set("titleHighlight", e.target.value)}
              />
            </Field>
          </div>

          <Field label="Đoạn giới thiệu ngắn" hint="2–3 dòng là vừa đẹp.">
            <Input.TextArea
              value={value.description}
              rows={3}
              showCount
              maxLength={400}
              placeholder="Dù bạn trực tiếp lên đường hay đồng hành từ xa…"
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>
        </EditorCard>

        <EditorCard
          title="Các thẻ vai trò"
          extra={<SaveStatusTag status={status} />}
        >
          <p className="mb-3 text-sm opacity-60">
            Những ô vuông nhỏ nằm dưới đoạn giới thiệu, mỗi ô nói về một cách
            tham gia. Kéo để đổi thứ tự.
          </p>
          <ListEditor<RegisterHighlight>
            value={value.highlights}
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

        <EditorCard
          title="Các ô nhập của form"
          extra={<SaveStatusTag status={status} />}
        >
          <p className="mb-3 text-sm opacity-60">
            Đây là những ô mà khách phải điền khi đăng ký. Thêm, xoá hoặc kéo để
            đổi thứ tự — thay đổi hiện ngay ở khung <strong>Xem trước</strong>.
            Mỗi lượt khách gửi đều được lưu lại và xem được ở mục{" "}
            <strong>Đăng ký nhận được</strong>.
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
              value={value.formTitle}
              placeholder="Đăng ký đồng hành"
              onChange={(e) => set("formTitle", e.target.value)}
            />
          </Field>

          <ListEditor<RegisterField>
            value={value.fields}
            onChange={(fields) => set("fields", fields)}
            addLabel="Thêm ô nhập"
            newItem={() => ({
              name: newFieldName(value.fields),
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
                    hint="Chọn đúng kiểu để khách gõ dễ hơn (bàn phím số, lịch chọn ngày…)."
                  >
                    <Select<RegisterFieldType>
                      className="w-full"
                      value={item.type}
                      options={FIELD_TYPES}
                      onChange={(type) =>
                        updateItem({
                          ...item,
                          type,
                          // Chuyển sang danh sách chọn -> tạo sẵn 1 lựa chọn trống.
                          options:
                            type === "select"
                              ? (item.options ?? [""])
                              : undefined,
                        })
                      }
                    />
                  </Field>
                </div>

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
                    label="Chữ gợi ý trong ô"
                    hint="Chữ mờ hiện sẵn khi ô còn trống. Bỏ trống cũng được."
                  >
                    <Input
                      value={item.placeholder ?? ""}
                      placeholder="Nguyễn Văn A"
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
                value={value.submitLabel}
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
                  value={value.contactNote}
                  placeholder="Hoặc liên hệ trực tiếp qua"
                  onChange={(e) => set("contactNote", e.target.value)}
                />
              </Field>
              <Field
                label="Chữ trên liên kết Fanpage"
                hint="Địa chỉ Fanpage lấy từ mục Thương hiệu & SEO nên không sửa ở đây."
              >
                <Input
                  value={value.contactLinkLabel}
                  placeholder="Fanpage Facebook"
                  onChange={(e) => set("contactLinkLabel", e.target.value)}
                />
              </Field>
            </div>
          </div>
        </EditorCard>

        <EditorCard
          title="Nơi nhận đăng ký"
          extra={<SaveStatusTag status={status} />}
        >
          <p className="mb-3 text-sm opacity-60">
            Khách bấm gửi xong, thông tin sẽ được <strong>lưu lại</strong> (xem
            ở mục <strong>Đăng ký nhận được</strong>) và{" "}
            <strong>gửi một email báo tin</strong> về địa chỉ dưới đây.
          </p>
          <Field
            label="Email nhận thông báo đăng ký"
            hint={
              <>
                Đây là hộp thư <strong>nội bộ của Ban tổ chức</strong> để nhận
                tin mỗi khi có người đăng ký — <strong>khác</strong> với email
                công khai ở mục <em>Thương hiệu &amp; SEO</em> (email đó in trên
                website cho khách liên hệ). Bỏ trống thì hệ thống gửi tạm về
                email công khai đó. Bấm nút cuối ô để thử soạn thư tới địa chỉ
                này.
              </>
            }
          >
            <LinkInput
              value={value.recipientEmail ?? ""}
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

        <EditorCard
          title="Màn hình cảm ơn"
          extra={<SaveStatusTag status={status} />}
        >
          <p className="mb-3 text-sm opacity-60">
            Hiện lên thay cho form ngay sau khi khách bấm nút gửi.
          </p>
          <Field label="Lời cảm ơn (chữ to)">
            <Input
              value={value.successTitle}
              placeholder="Cảm ơn bạn rất nhiều!"
              onChange={(e) => set("successTitle", e.target.value)}
            />
          </Field>
          <Field label="Dòng giải thích phía dưới">
            <Input.TextArea
              value={value.successNote}
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
              value={value.successAgainLabel}
              placeholder="Gửi đăng ký khác"
              onChange={(e) => set("successAgainLabel", e.target.value)}
            />
          </Field>
        </EditorCard>
      </div>

      {/* ---------------- Cột phải: xem trước ---------------- */}
      <div className="xl:sticky xl:top-4">
        <EditorCard title="Xem trước form">
          <p className="mb-3 text-sm opacity-60">
            Đây là hình dung gần đúng của form trên trang chủ. Khung này{" "}
            <strong>chỉ để xem</strong> — gõ thử vào đây không lưu gì cả.
          </p>
          <div className="rounded-2xl bg-gradient-to-br from-leaf-deep to-grass p-4">
            <div className="rounded-2xl bg-white/85 p-5 text-forest">
              <h3 className="text-xl font-bold text-leaf-deep">
                {value.formTitle || "(chưa có tiêu đề)"}
              </h3>
              <div className="mt-4 space-y-3">
                {value.fields.length === 0 ? (
                  <p className="py-6 text-center text-sm text-forest/50">
                    Chưa có ô nhập nào — bấm “Thêm ô nhập” bên trái.
                  </p>
                ) : (
                  value.fields.map((f, i) => (
                    <FieldPreview key={f.name || i} field={f} index={i} />
                  ))
                )}
              </div>
              <div className="mt-4 w-full rounded-full bg-gradient-to-r from-leaf-deep to-leaf py-2.5 text-center text-sm font-semibold text-white">
                {value.submitLabel || "(chưa có chữ trên nút)"}
              </div>
              <p className="mt-2 text-center text-xs text-forest/60">
                {value.contactNote}{" "}
                <span className="font-semibold text-leaf-deep underline">
                  {value.contactLinkLabel}
                </span>
              </p>
            </div>
          </div>
        </EditorCard>
      </div>
    </div>
  );
}

/** Một ô nhập trong khung xem trước — chỉ để nhìn, không bấm được. */
function FieldPreview({ field, index }: { field: RegisterField; index: number }) {
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
