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
    "eclipse-rx",
    "Eclipse RX",
    "product-design",
    "PRODUCT DESIGN",
    "/work/eclipse-rx.png",
  ),
  study(
    "contextual-messaging",
    "Contextual Messaging",
    "product-design",
    "PRODUCT DESIGN",
    "/work/contextual-messaging.png",
  ),
  study(
    "dave-plus-positioning",
    "Dave+ Positioning",
    "strategy-research",
    "STRATEGY & RESEARCH",
    "/work/06.png",
  ),
  study(
    "flexcard",
    "FlexCard",
    "product-design",
    "PRODUCT DESIGN",
    "/work/flexcard.png",
  ),
  study(
    "setup-quality",
    "Setup Quality",
    "product-design",
    "PRODUCT DESIGN",
    "/work/setup-quality.png",
  ),
  study(
    "journey-map",
    "Journey Map",
    "strategy-research",
    "STRATEGY & RESEARCH",
    "/work/journey-map.png",
  ),
  study(
    "conversions-api",
    "Conversions API",
    "product-design",
    "PRODUCT DESIGN",
    "/work/conversions-api.png",
  ),
  study(
    "nutrilyze",
    "Nutrilyze",
    "product-design",
    "PRODUCT DESIGN",
    "/work/nutrilyze-cover.png",
  ),
  study(
    "event-setup-tool",
    "Event Setup Tool",
    "product-design",
    "PRODUCT DESIGN",
    "/work/event-setup-tool.png",
  ),
  study(
    "payroll-aggregation",
    "Payroll Aggregation",
    "product-design",
    "PRODUCT DESIGN",
    "/work/payroll-aggregation.png",
  ),
  study(
    "outcome-driven-signals-setup",
    "Outcome Driven Signals Setup",
    "product-design",
    "PRODUCT DESIGN",
    "/work/outcome-driven-signals-setup.png",
  ),
  study(
    "analyze",
    "Analyze",
    "product-design",
    "PRODUCT DESIGN",
    "/work/analyze.png",
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
