import {
  getWorkPage,
  getWorkPageSlugs,
  getWorkPagesList,
  type WorkPage,
  type WorkPageCategory,
} from "@/content/work-pages";

export type CaseStudySection = {
  title: string;
  content: string;
};

export type WorkCategory = WorkPageCategory;

export type CaseStudy = {
  slug: string;
  title: string;
  category: WorkCategory;
  categoryLabel: string;
  imageUrl: string;
  summary: string;
  role: string;
  timeline: string;
  tags: string[];
  problem: string;
  approach: string;
  outcome: string;
  sections: CaseStudySection[];
};

export type WorkFilterCategory = "all" | WorkCategory;

function toCaseStudy(page: WorkPage): CaseStudy {
  return {
    slug: page.slug,
    title: page.title,
    category: page.category,
    categoryLabel: page.categoryLabel,
    imageUrl: page.coverImageUrl,
    summary: page.summary,
    role: "Lead Designer",
    timeline: "2024",
    tags: [page.categoryLabel],
    problem: page.lead,
    approach: page.paragraphs[0] ?? page.lead,
    outcome: page.paragraphs.at(-1) ?? page.lead,
    sections: [{ title: "Overview", content: page.lead }],
  };
}

export const caseStudies: CaseStudy[] = getWorkPagesList().map(toCaseStudy);

export function getCaseStudy(slug: string) {
  const page = getWorkPage(slug);
  return page ? toCaseStudy(page) : undefined;
}

export function getCaseStudySlugs() {
  return getWorkPageSlugs();
}

export function filterCaseStudies(category: WorkFilterCategory): CaseStudy[] {
  if (category === "all") return caseStudies;
  return caseStudies.filter((item) => item.category === category);
}

export function getCategoryCounts() {
  return {
    all: caseStudies.length,
    "product-design": caseStudies.filter((item) => item.category === "product-design")
      .length,
    "strategy-research": caseStudies.filter(
      (item) => item.category === "strategy-research",
    ).length,
    employer: caseStudies.filter((item) => item.category === "employer").length,
  };
}
