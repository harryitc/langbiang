"use client";

// Thẻ kính chứa FORM ĐĂNG KÝ — dùng chung cho hai nơi:
//   - khối "Đăng ký" ở trang chủ (components/sections/Register.tsx);
//   - trang chia sẻ riêng /dang-ky/<id>.
// Nhờ vậy sửa form một chỗ là cả hai nơi đổi theo, không lệch nhau.
//
// Khi khách bấm gửi: dữ liệu đi tới server, được lưu lại theo đúng form và gửi
// email báo cho Ban tổ chức. Chỉ khi thật sự thành công mới hiện màn cảm ơn;
// thất bại thì giữ nguyên chữ khách đã gõ và hiện lời nhắn lỗi.
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { submitRegistrationAction } from "@/lib/content/register-actions";
import { uploadRegistrationPhoto } from "@/lib/content/register-upload-client";
import { canCrop } from "@/lib/image/crop";
import RoleCards from "./RoleCards";
import {
  ROLE_SEPARATOR,
  type AmbassadorRole,
  type RegisterField,
  type RegisterForm,
} from "@/lib/content/schema";

// Hộp cắt ảnh chỉ tải về khi khách thật sự chọn ảnh — trang chủ không phải
// gánh thêm thư viện cắt ảnh ngay từ đầu.
const ImageCropperModal = dynamic(
  () => import("@/components/image/ImageCropperModal"),
  { ssr: false }
);

const INPUT_CLASS =
  "w-full rounded-xl border border-leaf/20 bg-white/80 px-4 py-3 text-forest outline-none transition placeholder:text-forest/40 focus:border-leaf focus:ring-2 focus:ring-leaf/30";

/**
 * Khoá ghi nhớ "máy này đã đăng ký form đó rồi" trong localStorage.
 * Tách theo từng form: đăng ký đợt này không làm form đợt khác coi như đã xong.
 */
function khoaDaGui(formId: string): string {
  return `tsl-da-dang-ky:${formId}`;
}

/** Đọc/ghi localStorage an toàn — chế độ ẩn danh hoặc trình duyệt chặn thì bỏ qua. */
const nho = {
  doc(formId: string): boolean {
    try {
      return !!window.localStorage.getItem(khoaDaGui(formId));
    } catch {
      return false;
    }
  },
  ghi(formId: string) {
    try {
      window.localStorage.setItem(khoaDaGui(formId), new Date().toISOString());
    } catch {
      // không lưu được thì thôi, chỉ mất phần ghi nhớ
    }
  },
  xoa(formId: string) {
    try {
      window.localStorage.removeItem(khoaDaGui(formId));
    } catch {
      // như trên
    }
  },
};

export default function RegisterFormCard({
  form,
  facebook,
}: {
  form: RegisterForm;
  facebook: string;
}) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Ảnh khách đã tải lên: mã trường -> đường dẫn ảnh.
  const [photos, setPhotos] = useState<Record<string, string>>({});
  // Số ảnh đang tải dở — còn ảnh nào chưa xong thì khoá nút gửi lại.
  const [uploading, setUploading] = useState(0);
  // Vai trò Đại sứ khách đã tích: mã trường -> danh sách tên vai trò.
  // Giữ ở đây (không để trong từng ô) để gửi xong còn xoá sạch cùng lúc —
  // el.reset() của trình duyệt không đụng tới trạng thái React.
  const [roles, setRoles] = useState<Record<string, string[]>>({});

  // Khách đã đăng ký form này ở lần trước -> mở lại trang vẫn thấy màn cảm ơn.
  // Phải đọc trong useEffect chứ không đọc lúc dựng: máy chủ không có
  // localStorage, đọc sớm sẽ khiến nội dung máy chủ và trình duyệt lệch nhau.
  useEffect(() => {
    if (nho.doc(form.id)) setSent(true);
  }, [form.id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending || uploading > 0) return;
    const el = e.currentTarget;
    const data: Record<string, string> = {};
    for (const [key, v] of new FormData(el).entries()) {
      if (typeof v === "string") data[key] = v;
    }

    setSending(true);
    setError(null);
    try {
      const res = await submitRegistrationAction(form.id, data);
      if (res.ok) {
        el.reset();
        setPhotos({});
        setRoles({});
        nho.ghi(form.id);
        setSent(true);
      } else {
        // Không xoá form — khách chỉ cần sửa lại rồi gửi tiếp.
        setError(res.error || "Chưa gửi được đăng ký. Bạn thử lại giúp nhé.");
      }
    } catch {
      setError(
        "Không kết nối được với máy chủ. Bạn kiểm tra mạng rồi thử lại, hoặc nhắn cho tụi mình qua Fanpage nhé."
      );
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="glass rounded-3xl p-7 text-forest shadow-soft sm:p-9">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="text-6xl">💚</span>
          <h3 className="mt-4 text-2xl font-bold text-leaf-deep">
            {form.successTitle}
          </h3>
          <p className="mt-2 text-forest/75">{form.successNote}</p>
          <button
            onClick={() => {
              // Bấm gửi đơn khác -> quên trạng thái cũ, trả form về trống.
              nho.xoa(form.id);
              setSent(false);
              setError(null);
            }}
            className="mt-6 cursor-pointer rounded-full border-2 border-leaf/30 px-6 py-2.5 text-sm font-semibold text-leaf-deep transition hover:bg-leaf/10"
          >
            {form.successAgainLabel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl p-7 text-forest shadow-soft sm:p-9">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-2xl font-bold text-leaf-deep">{form.formTitle}</h3>

        {form.fields.map((field, i) =>
          field.type === "roles" ? (
            <RolesFieldView
              key={field.name || i}
              field={field}
              roles={form.roles}
              value={roles[field.name] ?? []}
              onToggle={(title) =>
                setRoles((prev) => {
                  const dangCo = prev[field.name] ?? [];
                  return {
                    ...prev,
                    [field.name]: dangCo.includes(title)
                      ? dangCo.filter((x) => x !== title)
                      : [...dangCo, title],
                  };
                })
              }
            />
          ) : field.type === "photo" ? (
            <PhotoFieldView
              key={field.name || i}
              field={field}
              value={photos[field.name] ?? ""}
              onValue={(url) =>
                setPhotos((prev) => ({ ...prev, [field.name]: url }))
              }
              onUploadingChange={(dang) =>
                setUploading((n) => Math.max(0, n + (dang ? 1 : -1)))
              }
              onError={setError}
            />
          ) : (
            <RegisterFieldView key={field.name || i} field={field} />
          )
        )}

        {/* Ô ẩn chống spam: người thật không thấy nên luôn để trống,
            bot tự động điền thì đăng ký bị bỏ qua. */}
        <input
          type="text"
          name="_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        {error ? (
          <p
            role="alert"
            className="rounded-xl bg-sunset/10 px-4 py-3 text-sm font-medium text-sunset"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={sending || uploading > 0}
          className="w-full cursor-pointer rounded-full bg-gradient-to-r from-leaf-deep to-leaf py-3.5 text-base font-semibold text-white shadow-soft transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {sending
            ? "Đang gửi…"
            : uploading > 0
              ? "Đang tải ảnh lên…"
              : form.submitLabel}
        </button>
        <p className="text-center text-xs text-forest/60">
          {form.contactNote}{" "}
          <a
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer font-semibold text-leaf-deep underline"
          >
            {form.contactLinkLabel}
          </a>
        </p>
      </form>
    </div>
  );
}

/**
 * Ghi chú "không bắt buộc" nay nằm TRONG ô nhập chứ không treo ở nhãn, cho
 * hàng nhãn gọn và mắt khách đọc thẳng một mạch từ trên xuống.
 *
 * Cắt ngay lúc hiển thị (không chỉ sửa ở defaults.ts) vì cấu hình form đã lưu
 * trong Redis từ trước — sửa mỗi defaults thì form đang chạy không đổi.
 */
const GHI_CHU_TUY_CHON = /\s*\((?:không bắt buộc|tuỳ chọn|tùy chọn)\)\s*$/i;
const KHONG_BAT_BUOC = "không bắt buộc";

function nhanGon(label: string): string {
  return label.replace(GHI_CHU_TUY_CHON, "").trim();
}

/** Gợi ý trong ô, có kèm "(không bắt buộc)" nếu ô đó bỏ trống được. */
function goiY(field: RegisterField, macDinh = ""): string {
  const goc = (field.placeholder ?? "").replace(GHI_CHU_TUY_CHON, "").trim() || macDinh;
  if (field.required) return goc;
  return goc ? `${goc} (${KHONG_BAT_BUOC})` : `Không bắt buộc`;
}

/** Nhãn phía trên một ô nhập (kèm dấu * nếu bắt buộc). */
function FieldLabel({
  field,
}: {
  field: RegisterField;
}) {
  return (
    <label
      className="mb-1.5 block text-sm font-semibold text-forest/80"
    >
      {nhanGon(field.label)}
      {field.required && <span className="text-sunset"> *</span>}
    </label>
  );
}

/** Một trường của form, dựng theo cấu hình trong admin. */
function RegisterFieldView({
  field,
}: {
  field: RegisterField;
}) {
  const o = INPUT_CLASS;
  return (
    <div>
      <FieldLabel field={field} />

      {field.type === "textarea" ? (
        <textarea
          name={field.name}
          rows={3}
          placeholder={goiY(field)}
          required={field.required}
          className={`${o} resize-none`}
        />
      ) : field.type === "select" ? (
        <select
          name={field.name}
          required={field.required}
          className={o}
        >
          {(field.options ?? []).map((opt, i) => (
            <option key={i}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          name={field.name}
          type={field.type}
          placeholder={goiY(field)}
          required={field.required}
          className={o}
        />
      )}
    </div>
  );
}

/**
 * Ô VAI TRÒ ĐẠI SỨ: hiện đúng lưới thẻ như ngoài trang chủ (cùng component
 * RoleCards) nhưng bấm chọn được, và chọn được NHIỀU vai trò cùng lúc.
 *
 * Các vai trò đã tích được gộp thành một chuỗi trong ô ẩn — nhờ vậy nơi lưu
 * trữ, bảng "Đăng ký nhận được", file CSV và email đều nhận đúng một ô như mọi
 * trường khác, không cần biết đây là ô nhiều lựa chọn.
 */
function RolesFieldView({
  field,
  roles,
  value,
  onToggle,
}: {
  field: RegisterField;
  roles: AmbassadorRole[];
  value: string[];
  onToggle: (title: string) => void;
}) {

  // Giữ đúng thứ tự vai trò như admin đã sắp, không theo thứ tự khách bấm.
  const daChon = roles.map((r) => r.title).filter((x) => value.includes(x));

  return (
    <div>
      <FieldLabel field={field} />

      {/* Thứ duy nhất thật sự được gửi đi. */}
      <input
        type="hidden"
        name={field.name}
        value={daChon.join(ROLE_SEPARATOR)}
      />

      {roles.length === 0 ? (
        <p className="text-sm text-forest/60">
          Chưa có vai trò nào để chọn.
        </p>
      ) : (
        <RoleCards
          roles={roles}
          selectable
          value={value}
          onToggle={onToggle}
        />
      )}
    </div>
  );
}

/**
 * Ô ảnh: khách chọn ảnh từ máy, ảnh được tải lên ngay rồi đường dẫn nằm trong
 * một ô ẩn để gửi kèm đăng ký. Ảnh này cũng tự vào kho ảnh của Ban tổ chức
 * (album "Tình nguyện viên") sau khi gửi thành công.
 */
function PhotoFieldView({
  field,
  value,
  onValue,
  onUploadingChange,
  onError,
}: {
  field: RegisterField;
  value: string;
  onValue: (url: string) => void;
  onUploadingChange: (dangTai: boolean) => void;
  onError: (msg: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  // Ảnh vừa chọn, đang chờ khách cắt. Cắt xong mới tải lên.
  const [dangCat, setDangCat] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function taiLen(file: File) {
    setBusy(true);
    onUploadingChange(true);
    try {
      onValue(await uploadRegistrationPhoto(file));
    } catch (err) {
      onError(
        err instanceof Error ? err.message : "Tải ảnh lên không được."
      );
      onValue("");
    } finally {
      setBusy(false);
      onUploadingChange(false);
    }
  }

  /** Ảnh cắt được thì mở hộp cắt trước; SVG/GIF thì tải thẳng. */
  function chonAnh(file: File) {
    if (canCrop(file.type)) setDangCat(file);
    else void taiLen(file);
  }

  return (
    <div>
      <FieldLabel field={field} />

      {/* Đường dẫn ảnh đã tải lên — đây mới là thứ được gửi đi. */}
      <input type="hidden" name={field.name} value={value} />

      <div className="flex items-center gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt="Ảnh bạn vừa chọn"
            className="h-20 w-20 shrink-0 rounded-xl object-cover ring-2 ring-leaf/30"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-leaf/30 text-2xl">
            🖼️
          </div>
        )}

        <div className="min-w-0">
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-full border-2 border-leaf/30 px-4 py-2 text-sm font-semibold text-leaf-deep transition hover:bg-leaf/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? "Đang tải lên…" : value ? "Chọn ảnh khác" : "Chọn ảnh"}
          </button>
          <p className="mt-1 text-xs text-forest/60">
            {goiY(field, "Ảnh jpg, png hoặc webp, nhẹ hơn 5MB.")}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          // Xoá giá trị để chọn lại đúng tệp cũ vẫn kích hoạt onChange.
          e.target.value = "";
          if (f) chonAnh(f);
        }}
      />

      {/* Ảnh chân dung nên ép vuông 1:1 cho khớp ô xem trước và khung ảnh
          tình nguyện viên trên trang. */}
      <ImageCropperModal
        file={dangCat}
        aspect={1}
        title="Cắt ảnh của bạn"
        onCancel={() => setDangCat(null)}
        onDone={(f) => {
          setDangCat(null);
          void taiLen(f);
        }}
      />
    </div>
  );
}
