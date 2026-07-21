import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";

import { ppMigra } from "@/lib/fonts/pp-migra";
import { ppNeueCorpCompact } from "@/lib/fonts/pp-neue-corp-compact";
import { ppNeueCorpCondensed } from "@/lib/fonts/pp-neue-corp-condensed";
import { ppNeueCorpTight } from "@/lib/fonts/pp-neue-corp-tight";
import { rockSalt } from "@/lib/fonts/rock-salt";
import { ComingSoonBannerProvider } from "@/components/coming-soon/coming-soon-banner";
import { WorkOverlayProvider } from "@/components/work/work-overlay-context";
import { site } from "@/lib/site";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  icons: {
    icon: [{ url: "/favicon.png", sizes: "32x32", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: site.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: [site.ogImage],
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full ${ppMigra.variable} ${ppNeueCorpCompact.variable} ${ppNeueCorpCondensed.variable} ${ppNeueCorpTight.variable} ${rockSalt.variable}`}
    >
      <body className="min-h-full">
        <ComingSoonBannerProvider>
          <WorkOverlayProvider>
            {children}
            {modal}
          </WorkOverlayProvider>
        </ComingSoonBannerProvider>
        <Analytics />
      </body>
    </html>
  );
}
