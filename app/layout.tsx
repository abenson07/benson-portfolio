import type { Metadata } from "next";

import { ppMigra } from "@/lib/fonts/pp-migra";
import { ppNeueCorpCompact } from "@/lib/fonts/pp-neue-corp-compact";
import { ppNeueCorpCondensed } from "@/lib/fonts/pp-neue-corp-condensed";
import { ppNeueCorpTight } from "@/lib/fonts/pp-neue-corp-tight";
import { rockSalt } from "@/lib/fonts/rock-salt";
import { WorkOverlayProvider } from "@/components/work/work-overlay-context";
import { site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: site.name || "Benson",
    template: site.name ? `%s · ${site.name}` : "%s",
  },
  description: site.description,
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
        <WorkOverlayProvider>
          {children}
          {modal}
        </WorkOverlayProvider>
      </body>
    </html>
  );
}
