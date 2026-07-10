import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CaseStudyPage } from "@/components/work/case-study/case-study-page";
import { WorkPageShell } from "@/components/work/work-page-shell";
import { getEnrichedWorkPage } from "@/content/enrich-work-page";
import { getWorkPageSlugs } from "@/content/work-pages";

type WorkProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getWorkPageSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: WorkProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getEnrichedWorkPage(slug);

  if (!page) {
    return { title: "Project not found" };
  }

  return {
    title: page.title,
    description: page.summary,
  };
}

export default async function WorkProjectPage({ params }: WorkProjectPageProps) {
  const { slug } = await params;
  const page = getEnrichedWorkPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <WorkPageShell>
      <CaseStudyPage content={page} />
    </WorkPageShell>
  );
}
