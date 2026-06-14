import type { Metadata } from "next";

import "./experiences.css";

export const metadata: Metadata = {
  title: "Experiences",
};

export default function ExperiencesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="experiences-page">{children}</div>;
}
