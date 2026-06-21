import type { Metadata } from "next";

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
    <html lang="en" className="h-full">
      <body className="min-h-full">
        <WorkOverlayProvider>
          {children}
          {modal}
        </WorkOverlayProvider>
      </body>
    </html>
  );
}
