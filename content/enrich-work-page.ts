import "server-only";

import { loadCaseStudyMarkdown } from "@/content/load-case-study-markdown";
import type { WorkPageContent } from "@/content/work-page-template";
import type { WorkPageCategory } from "@/content/work-pages";
import { getWorkPage } from "@/content/work-pages";

export type WorkPage = WorkPageContent & {
  slug: string;
  summary: string;
  category: WorkPageCategory;
  categoryLabel: string;
};

export function enrichWorkPageFromMarkdown(page: WorkPage): WorkPage {
  const parsed = loadCaseStudyMarkdown(page.slug);

  if (!parsed) {
    return page;
  }

  return {
    ...page,
    summary: parsed.lead,
    lead: parsed.lead,
    paragraphs: parsed.paragraphs.length > 0 ? parsed.paragraphs : [parsed.lead],
    services: parsed.capabilities.length > 0 ? [] : page.services,
    capabilities: parsed.capabilities,
    collaboration: parsed.collaboration,
  };
}

export function getEnrichedWorkPage(slug: string): WorkPage | undefined {
  const page = getWorkPage(slug);
  return page ? enrichWorkPageFromMarkdown(page) : undefined;
}
