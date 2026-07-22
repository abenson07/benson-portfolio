import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";

import { CaseStudyPage } from "@/components/work/case-study/case-study-page";
import { WorkPageShell } from "@/components/work/work-page-shell";
import { getEnrichedWorkPage } from "@/content/enrich-work-page";

type WorkProjectPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Request-time rendering keeps hard navigations from baking
 * `couldBeIntercepted: false` into the RSC payload (Next.js #94533).
 * Static prerenders of these pages poison the client router cache so
 * later soft-navs from the homepage skip the work modal.
 */
export const dynamic = "force-dynamic";

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
  await connection();
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
