import { notFound } from "next/navigation";

import { CaseStudyPage } from "@/components/work/case-study/case-study-page";
import { WorkModalShell } from "@/components/work/work-modal-shell";
import { getWorkPage } from "@/content/work-pages";

import "@/app/work/case-study.css";
import "@/app/work/work-card.css";

type InterceptedWorkPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InterceptedWorkPage({
  params,
}: InterceptedWorkPageProps) {
  const { slug } = await params;
  const page = getWorkPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <WorkModalShell slug={slug}>
      <CaseStudyPage content={page} variant="modal" />
    </WorkModalShell>
  );
}
