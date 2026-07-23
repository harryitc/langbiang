import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Dancing_Script } from "next/font/google";
import { site } from "@/lib/site";
import { getContent } from "@/lib/content/store";
import { fillYear } from "@/lib/content/year";
import { absoluteUrl } from "@/lib/content/url";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-be-vietnam",
  display: "swap",
});

// Phông tiêu đề (viết tay Dancing Script). Dùng chung cho tiêu đề và dòng ngày tháng.
const displayFont = Dancing_Script({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dancing",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#7cc34a" },
    { media: "(prefers-color-scheme: dark)", color: "#0c1712" },
  ],
  width: "device-width",
  initialScale: 1,
};

/** Metadata đọc từ content store (SEO + OG — FR8, số năm theo FR3). */
export async function generateMetadata(): Promise<Metadata> {
  const { main, currentYear } = await getContent();
  const meta = main.site;
  const title = `${meta.name} — ${fillYear(meta.tagline, currentYear)} ${currentYear}`;
  const description = fillYear(meta.description, currentYear);
  const ogImage = meta.ogImage || "/og.jpg";

  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s | ${meta.name}` },
    description,
    keywords: meta.keywords.map((k) => fillYear(k, currentYear)),
    authors: [{ name: meta.name }],
    creator: meta.name,
    applicationName: meta.name,
    category: "nonprofit",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: site.url,
      siteName: meta.name,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 628, alt: meta.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    icons: {
      icon: [{ url: "/favicon.ico", type: "image/x-icon" }],
      apple: "/favicon.ico",
    },
    verification: {
      google: "XOGtXG7k4uoGXRpKkNHEx8MO0pZh5VieLL3V_7AO8JY",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { main, currentYear } = await getContent();
  const meta = main.site;
  const { event } = main;

  // JSON-LD sự kiện — suy từ event + currentYear (Phụ lục A, nhóm A3).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${meta.name} ${currentYear}`,
    description: fillYear(meta.description, currentYear),
    startDate: event.dateISO,
    endDate: event.dateEndISO || event.dateISO,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Đà Lạt",
        addressRegion: "Lâm Đồng",
        addressCountry: "VN",
      },
    },
    image: [absoluteUrl(meta.ogImage || "/og.jpg")],
    organizer: {
      "@type": "Organization",
      name: meta.name,
      url: meta.facebook,
    },
    isAccessibleForFree: true,
  };

  return (
    <html
      lang="vi"
      suppressHydrationWarning
      className={`${beVietnam.variable} ${displayFont.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
