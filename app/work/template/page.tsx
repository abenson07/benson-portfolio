import type { Metadata } from "next";

import { CaseStudyPage } from "@/components/work/case-study/case-study-page";
import { workPageTemplate } from "@/content/work-page-template";

export const metadata: Metadata = {
  title: "Work Template",
  description: workPageTemplate.lead,
};

export default function WorkTemplatePage() {
  return <CaseStudyPage content={workPageTemplate} />;
}
