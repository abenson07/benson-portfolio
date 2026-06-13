export type CaseStudySection = {
  title: string;
  content: string;
};

export type WorkCategory = "product-design" | "strategy-research";

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

const placeholderSection: CaseStudySection = {
  title: "Overview",
  content: "Placeholder case study content.",
};

function study(
  slug: string,
  title: string,
  category: WorkCategory,
  categoryLabel: string,
  imageUrl: string,
): CaseStudy {
  return {
    slug,
    title,
    category,
    categoryLabel,
    imageUrl,
    summary: `Case study for ${title}.`,
    role: "Lead Designer",
    timeline: "2024",
    tags: [categoryLabel],
    problem: "Placeholder problem statement.",
    approach: "Placeholder approach.",
    outcome: "Placeholder outcome.",
    sections: [placeholderSection],
  };
}

export const caseStudies: CaseStudy[] = [
  study(
    "setup-quality",
    "Setup Quality",
    "product-design",
    "PRODUCT DESIGN",
    "/work/01.png",
  ),
  study(
    "outcome-driven-signals-setup",
    "Outcome Driven Signals Setup",
    "product-design",
    "PRODUCT DESIGN",
    "/work/02.png",
  ),
  study(
    "contextual-messaging",
    "Contextual Messaging",
    "product-design",
    "PRODUCT DESIGN",
    "/work/03.png",
  ),
  study(
    "event-setup-tool",
    "Event Setup Tool",
    "product-design",
    "PRODUCT DESIGN",
    "/work/04.png",
  ),
  study(
    "conversions-api",
    "Conversions API",
    "product-design",
    "PRODUCT DESIGN",
    "/work/05.png",
  ),
  study(
    "dave-plus-positioning",
    "Dave+ Positioning",
    "strategy-research",
    "STRATEGY & RESEARCH",
    "/work/06.png",
  ),
  study(
    "journey-map",
    "Journey Map",
    "strategy-research",
    "STRATEGY & RESEARCH",
    "/work/07.png",
  ),
  study(
    "payroll-aggregation",
    "Payroll Aggregation",
    "product-design",
    "PRODUCT DESIGN",
    "/work/08.png",
  ),
  study(
    "flexcard",
    "FlexCard",
    "product-design",
    "PRODUCT DESIGN",
    "/work/09.png",
  ),
  study(
    "eclipse-rx",
    "Eclipse RX",
    "product-design",
    "PRODUCT DESIGN",
    "/work/10.png",
  ),
  study(
    "analyze",
    "Analyze",
    "product-design",
    "PRODUCT DESIGN",
    "/work/11.png",
  ),
  study(
    "nutrilyze",
    "Nutrilyze",
    "product-design",
    "PRODUCT DESIGN",
    "/work/12.png",
  ),
];

export function getCaseStudy(slug: string) {
  return caseStudies.find((item) => item.slug === slug);
}

export function getCaseStudySlugs() {
  return caseStudies.map((item) => item.slug);
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
    "strategy-research": caseStudies.filter((item) => item.category === "strategy-research")
      .length,
  };
}
