import { GrassBorder } from "@/components/Decor";
import { getContent } from "@/lib/content/store";
import { eventDateLabel, locationFor } from "@/lib/content/year";

export default async function Footer() {
  const { main, currentYear, pastYears } = await getContent();
  const meta = main.site;
  const { event, footer } = main;
  const latestPastYear = [...pastYears].sort((a, b) => b.year - a.year)[0];

  const links: [string, string][] = [
    ["/#about", "Về dự án"],
    ["/#activities", "Hoạt động"],
    // Mục năm đã qua (FR4) — ẩn khi danh mục rỗng.
    ...(latestPastYear
      ? ([[`/${latestPastYear.year}`, `Mùa ${latestPastYear.year}`]] as [string, string][])
      : []),
    ["/tin-tuc", "Tin tức"],
    ["/gay-quy", "Đóng góp"],
    ["/#register", "Đăng ký"],
  ];

  return (
    <footer className="relative bg-forest text-white">
      <GrassBorder className="absolute -top-[70px] left-0 h-[72px] w-full" />

      <div className="mx-auto max-w-7xl px-6 pb-10 pt-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-3xl font-bold text-white">
              {meta.name}
            </p>
            <p className="mt-3 max-w-sm whitespace-pre-line text-white/70">
              {footer.description}
            </p>
            <a
              href={meta.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/20"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
              </svg>
              {footer.facebookLabel}
            </a>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/60">
              {footer.exploreTitle}
            </h3>
            <ul className="mt-4 space-y-2.5 text-white/80">
              {links.map(([h, l]) => (
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
              {footer.contactTitle}
            </h3>
            <ul className="mt-4 space-y-2.5 text-white/80">
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>{locationFor(event, "footer")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>📅</span>
                <span>{eventDateLabel(event.dateLabel, currentYear)}</span>
              </li>
              <li className="flex items-start gap-2">
                <span>✉️</span>
                <a href={`mailto:${meta.email}`} className="transition hover:text-grass">
                  {meta.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/60 sm:flex-row">
          <p>
            © {currentYear} {meta.name}. {footer.copyrightNote}
          </p>
          <p>{footer.bottomNote}</p>
        </div>
      </div>
    </footer>
  );
}
