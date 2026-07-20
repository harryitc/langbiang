"use client";

// Thẻ kính chứa FORM ĐĂNG KÝ — dùng chung cho hai nơi:
//   - khối "Đăng ký" ở trang chủ (components/sections/Register.tsx);
//   - trang chia sẻ riêng /dang-ky/<id>.
// Nhờ vậy sửa form một chỗ là cả hai nơi đổi theo, không lệch nhau.
//
// Khi khách bấm gửi: dữ liệu đi tới server, được lưu lại theo đúng form và gửi
// email báo cho Ban tổ chức. Chỉ khi thật sự thành công mới hiện màn cảm ơn;
// thất bại thì giữ nguyên chữ khách đã gõ và hiện lời nhắn lỗi.
import { useRef, useState } from "react";
import { submitRegistrationAction } from "@/lib/content/register-actions";
import { uploadRegistrationPhoto } from "@/lib/content/register-upload-client";
import type { RegisterField, RegisterForm } from "@/lib/content/schema";

const INPUT_CLASS =
  "w-full rounded-xl border border-leaf/20 bg-white/80 px-4 py-3 text-forest outline-none transition placeholder:text-forest/40 focus:border-leaf focus:ring-2 focus:ring-leaf/30";

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
          field.type === "photo" ? (
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

/** Nhãn phía trên một ô nhập (kèm dấu * nếu bắt buộc). */
function FieldLabel({ field }: { field: RegisterField }) {
  return (
    <label className="mb-1.5 block text-sm font-semibold text-forest/80">
      {field.label}
      {field.required && <span className="text-sunset"> *</span>}
    </label>
  );
}

/** Một trường của form, dựng theo cấu hình trong admin. */
function RegisterFieldView({ field }: { field: RegisterField }) {
  return (
    <div>
      <FieldLabel field={field} />

      {field.type === "textarea" ? (
        <textarea
          name={field.name}
          rows={3}
          placeholder={field.placeholder}
          required={field.required}
          className={`${INPUT_CLASS} resize-none`}
        />
      ) : field.type === "select" ? (
        <select
          name={field.name}
          required={field.required}
          className="w-full rounded-xl border border-leaf/20 bg-white/80 px-4 py-3 text-forest outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/30"
        >
          {(field.options ?? []).map((opt, i) => (
            <option key={i}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          className={INPUT_CLASS}
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
  const inputRef = useRef<HTMLInputElement>(null);

  async function chonAnh(file: File) {
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
            {field.placeholder?.trim() ||
              "Ảnh jpg, png hoặc webp, nhẹ hơn 5MB."}
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
          if (f) void chonAnh(f);
        }}
      />
    </div>
  );
}
