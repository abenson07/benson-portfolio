import type { Metadata } from "next";

import { CaseStudyPage } from "@/components/work/case-study/case-study-page";
import { WorkPageShell } from "@/components/work/work-page-shell";
import { workPageTemplateLongCopy } from "@/content/work-page-template";

export const metadata: Metadata = {
  title: "Work Template — Long Copy",
  description: workPageTemplateLongCopy.lead,
};

export default function WorkTemplateLongCopyPage() {
  return (
    <WorkPageShell>
      <CaseStudyPage content={workPageTemplateLongCopy} />
    </WorkPageShell>
  );
}
