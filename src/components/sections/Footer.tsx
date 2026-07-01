import { GrassBorder } from "@/components/Decor";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative bg-forest text-white">
      <GrassBorder className="absolute -top-[70px] left-0 h-[72px] w-full" />

      <div className="mx-auto max-w-7xl px-6 pb-10 pt-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl font-bold text-white">
              Trăng sáng Langbiang
            </p>
            <p className="mt-3 max-w-sm text-white/70">
              Dự án tình nguyện mang Trung thu ấm áp đến các em nhỏ vùng cao
              Langbiang – Đà Lạt, Lâm Đồng.
            </p>
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
              </svg>
              Theo dõi Fanpage
            </a>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">
              Khám phá
            </h3>
            <ul className="mt-4 space-y-2.5 text-white/80">
              {[
                ["#about", "Về dự án"],
                ["#activities", "Hoạt động"],
                ["#timeline", "Lịch trình"],
                ["#gallery", "Khoảnh khắc"],
                ["#register", "Đăng ký"],
              ].map(([h, l]) => (
                <li key={h}>
                  <a href={h} className="transition hover:text-grass">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">
              Liên hệ
            </h3>
            <ul className="mt-4 space-y-2.5 text-white/80">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>{site.location}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📅</span>
                <span>{site.dateLabel}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✉️</span>
                <a href={`mailto:${site.email}`} className="transition hover:text-grass">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row">
          <p>
            © 2026 {site.name}. Được tạo bằng tất cả yêu thương 💚
          </p>
          <p>Langbiang · Đà Lạt · Lâm Đồng</p>
        </div>
      </div>
    </footer>
  );
}
