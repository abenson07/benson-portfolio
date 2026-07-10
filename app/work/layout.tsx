import type { Metadata } from "next";

import "./case-study.css";
import "./work-card.css";
import "./work.css";
import "./work-index.css";

export const metadata: Metadata = {
  title: "Work",
};

export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
