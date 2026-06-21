import type { Metadata } from "next";

import { WorkPageShell } from "@/components/work/work-page-shell";

import "./case-study.css";
import "./work-card.css";
import "./work.css";

export const metadata: Metadata = {
  title: "Work",
};

export default function WorkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <WorkPageShell>{children}</WorkPageShell>;
}
