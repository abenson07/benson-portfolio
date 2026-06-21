import type { WorkPageContent } from "@/content/work-page-template";

import { CaseStudyPageClient } from "./case-study-page-client";

type CaseStudyPageProps = {
  content: WorkPageContent;
  variant?: "page" | "modal";
};

export function CaseStudyPage({
  content,
  variant = "page",
}: CaseStudyPageProps) {
  return <CaseStudyPageClient content={content} variant={variant} />;
}
