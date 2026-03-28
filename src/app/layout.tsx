import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "../components/ClientLayout";
import type { Metadata, Viewport } from "next";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

const SITE_URL = "https://casex.uz";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CaseX — CS2 skinlar bozori | O'zbekistonda #1",
    template: "%s | CaseX",
  },
  description:
    "O'zbekistondagi birinchi CS2 skin marketplace. CS2 skinlarni arzon narxda sotib oling va soting. Xavfsiz tranzaksiyalar, tez yetkazib berish, so'mda to'lov.",
  keywords: [
    "CS2 skin", "CS2 skinlar", "CS2 skin sotib olish", "CS2 skin sotish",
    "CS2 marketplace", "CS2 bozor", "Counter-Strike 2 skin",
    "CS2 skin arzon", "CS2 knife", "CS2 pichoq",
    "CS2 skin O'zbekiston", "CS2 skin UZS", "CS2 skin so'mda",
    "casex", "casex.uz", "CS2 trade", "CS2 skin market",
    "купить скин CS2", "CS2 скины", "CS2 маркетплейс",
    "CS2 skin narxi", "CS2 inventory", "CS2 skin bozori",
  ],
  authors: [{ name: "CaseX", url: SITE_URL }],
  creator: "CaseX",
  publisher: "CaseX",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
    url: SITE_URL,
    siteName: "CaseX",
    title: "CaseX — CS2 skinlar bozori | O'zbekistonda #1",
    description:
      "O'zbekistondagi birinchi CS2 skin marketplace. Skinlarni arzon narxda sotib oling va soting.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CaseX — CS2 Skins Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CaseX — CS2 skinlar bozori",
    description:
      "O'zbekistondagi birinchi CS2 skin marketplace. Xavfsiz tranzaksiyalar, arzon narxlar.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "uz-UZ": SITE_URL,
      "ru-RU": SITE_URL,
      "en-US": SITE_URL,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  verification: {
    google: "rIYsK_Doo0FV9ZMTQx3UIGKB7El5UaumXiZ4Pr30Vp8",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "CaseX",
              "url": "https://casex.uz",
              "description": "O'zbekistondagi birinchi CS2 skin marketplace",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://casex.uz/marketplace?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "CaseX",
              "url": "https://casex.uz",
              "logo": "https://casex.uz/logo-casex.png",
              "description": "CS2 skinlar marketplace — O'zbekiston",
              "sameAs": [
                "https://t.me/casex_uz"
              ]
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t!=='light')document.documentElement.classList.add('dark')})()`,
          }}
        />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
