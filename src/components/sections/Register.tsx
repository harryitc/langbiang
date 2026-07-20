"use client";

// Khối "Đăng ký" ở trang chủ. Toàn bộ chữ và danh sách trường của form đều do
// admin cấu hình (main.register) — form không có backend, gửi xong chỉ hiện
// màn cảm ơn như trước.
import { useState } from "react";
import Reveal from "@/components/Reveal";
import type { RegisterField, RegisterSection } from "@/lib/content/schema";

const INPUT_CLASS =
  "w-full rounded-xl border border-leaf/20 bg-white/80 px-4 py-3 text-forest outline-none transition placeholder:text-forest/40 focus:border-leaf focus:ring-2 focus:ring-leaf/30";

export default function Register({
  facebook,
  content,
}: {
  facebook: string;
  content: RegisterSection;
}) {
  const [sent, setSent] = useState(false);

  return (
    <section
      id="register"
      className="relative overflow-hidden bg-gradient-to-br from-leaf-deep via-leaf to-grass py-24 text-white sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <div className="absolute -left-10 top-10 h-64 w-64 rounded-full bg-white blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-sun blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
        <Reveal childrenStagger>
          <span className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest">
            {content.eyebrow}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            {content.title}
            <br />
            <span className="font-display text-4xl sm:text-5xl md:text-6xl">
              {content.titleHighlight}
            </span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-white/85">
            {content.description}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {content.highlights.map((h, i) => (
              <div key={i} className="glass rounded-2xl p-4 text-forest">
                <span className="text-2xl">{h.icon}</span>
                <p className="mt-1 font-bold">{h.title}</p>
                <p className="text-sm text-forest/70">{h.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="glass rounded-3xl p-7 text-forest shadow-soft sm:p-9">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <span className="text-6xl">💚</span>
                <h3 className="mt-4 text-2xl font-bold text-leaf-deep">
                  {content.successTitle}
                </h3>
                <p className="mt-2 text-forest/75">{content.successNote}</p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 cursor-pointer rounded-full border-2 border-leaf/30 px-6 py-2.5 text-sm font-semibold text-leaf-deep transition hover:bg-leaf/10"
                >
                  {content.successAgainLabel}
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-bold text-leaf-deep">
                  {content.formTitle}
                </h3>

                {content.fields.map((field, i) => (
                  <RegisterFieldView key={field.name || i} field={field} />
                ))}

                <button
                  type="submit"
                  className="w-full cursor-pointer rounded-full bg-gradient-to-r from-leaf-deep to-leaf py-3.5 text-base font-semibold text-white shadow-soft transition hover:brightness-110"
                >
                  {content.submitLabel}
                </button>
                <p className="text-center text-xs text-forest/60">
                  {content.contactNote}{" "}
                  <a
                    href={facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer font-semibold text-leaf-deep underline"
                  >
                    {content.contactLinkLabel}
                  </a>
                </p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Một trường của form, dựng theo cấu hình trong admin. */
function RegisterFieldView({ field }: { field: RegisterField }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-forest/80">
        {field.label}
        {field.required && <span className="text-sunset"> *</span>}
      </label>

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
