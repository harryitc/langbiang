import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Dancing_Script } from "next/font/google";
import { site } from "@/lib/site";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline} 2026`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: site.name }],
  creator: site.name,
  applicationName: site.name,
  category: "nonprofit",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline} 2026`,
    description: site.description,
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 628,
        alt: site.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline} 2026`,
    description: site.description,
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  icons: {
    icon: [{ url: "/logo-mark.png", type: "image/png" }],
    apple: "/logo-mark.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `${site.name} 2026`,
  description: site.description,
  startDate: "2026-09-26",
  endDate: "2026-09-27",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Phường Langbiang, Đà Lạt",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Đà Lạt",
      addressRegion: "Lâm Đồng",
      addressCountry: "VN",
    },
  },
  image: [`${site.url}/og.jpg`],
  organizer: {
    "@type": "Organization",
    name: site.name,
    url: site.facebook,
  },
  isAccessibleForFree: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      </body>
    </html>
  );
}
