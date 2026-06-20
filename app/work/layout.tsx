import type { Metadata } from "next";

import "./case-study.css";
import "./work.css";

export const metadata: Metadata = {
  title: "Work",
};

export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="work-page">{children}</div>;
}
