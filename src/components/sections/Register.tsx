"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export default function Register() {
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
            Tham gia cùng chúng mình
          </span>
          <h2 className="text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">
            Cùng thắp sáng
            <br />
            <span className="font-display text-4xl sm:text-5xl md:text-6xl">
              một mùa trăng yêu thương
            </span>
          </h2>
          <p className="mt-5 max-w-md text-lg text-white/85">
            Dù bạn trực tiếp lên đường hay đồng hành từ xa, mỗi tấm lòng đều góp
            phần làm nên điều kỳ diệu cho các em nhỏ Langbiang.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              ["🙋", "Tình nguyện viên", "Trực tiếp tham gia hành trình 19–20/9"],
              ["🎁", "Nhà hảo tâm", "Đóng góp quà, nhu yếu phẩm & kinh phí"],
            ].map(([icon, t, d]) => (
              <div key={t} className="glass rounded-2xl p-4 text-forest">
                <span className="text-2xl">{icon}</span>
                <p className="mt-1 font-bold">{t}</p>
                <p className="text-sm text-forest/70">{d}</p>
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
                  Cảm ơn bạn rất nhiều!
                </h3>
                <p className="mt-2 text-forest/75">
                  Ban tổ chức sẽ liên hệ với bạn trong thời gian sớm nhất qua
                  email hoặc điện thoại.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="mt-6 rounded-full border-2 border-leaf/30 px-6 py-2.5 text-sm font-semibold text-leaf-deep transition hover:bg-leaf/10"
                >
                  Gửi đăng ký khác
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
                  Đăng ký đồng hành
                </h3>
                <Field label="Họ và tên" name="name" placeholder="Nguyễn Văn A" required />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="ban@email.com"
                    required
                  />
                  <Field
                    label="Số điện thoại"
                    name="phone"
                    type="tel"
                    placeholder="09xx xxx xxx"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-forest/80">
                    Bạn muốn tham gia với vai trò
                  </label>
                  <select
                    name="role"
                    className="w-full rounded-xl border border-leaf/20 bg-white/80 px-4 py-3 text-forest outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/30"
                  >
                    <option>Tình nguyện viên</option>
                    <option>Nhà hảo tâm / Nhà tài trợ</option>
                    <option>Cộng tác truyền thông</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-forest/80">
                    Lời nhắn (không bắt buộc)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    placeholder="Chia sẻ mong muốn của bạn..."
                    className="w-full resize-none rounded-xl border border-leaf/20 bg-white/80 px-4 py-3 text-forest outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/30"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-full bg-gradient-to-r from-leaf-deep to-leaf py-3.5 text-base font-semibold text-white shadow-soft transition hover:brightness-110"
                >
                  Gửi đăng ký 🌙
                </button>
                <p className="text-center text-xs text-forest/60">
                  Hoặc liên hệ trực tiếp qua{" "}
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-leaf-deep underline"
                  >
                    Fanpage Facebook
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

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-forest/80">
        {label}
        {required && <span className="text-sunset"> *</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-xl border border-leaf/20 bg-white/80 px-4 py-3 text-forest outline-none transition placeholder:text-forest/40 focus:border-leaf focus:ring-2 focus:ring-leaf/30"
      />
    </div>
  );
}
