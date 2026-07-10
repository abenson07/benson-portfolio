import type { WorkCardContent } from "@/content/work-card";
import type { WorkPageContent } from "@/content/work-page-template";
import { workPageTemplate } from "@/content/work-page-template";
import { workUpNextPreferences } from "@/content/work-up-next-config";

export type WorkPageCategory = "product-design" | "strategy-research" | "employer";

export type WorkPage = WorkPageContent & {
  slug: string;
  summary: string;
  category: WorkPageCategory;
  categoryLabel: string;
};

type CreateWorkPageInput = {
  slug: string;
  title: string;
  primaryTag: string;
  coverImageUrl: string;
  category: WorkPageCategory;
  summary?: string;
  overrides?: Partial<WorkPageContent>;
};

const CATEGORY_LABELS: Record<WorkPageCategory, string> = {
  "product-design": "PRODUCT DESIGN",
  "strategy-research": "STRATEGY & RESEARCH",
  employer: "EMPLOYER",
};

const DEFAULT_SERVICES = workPageTemplate.services.slice(0, 3);
const DEFAULT_MEDIA = workPageTemplate.media.slice(0, 5);

function placeholderParagraphs(title: string): string[] {
  return [
    `Overview of design work on ${title}.`,
    "Placeholder narrative — replace with project-specific goals, process, and outcomes.",
    "Additional context about constraints, collaborators, and results will live here.",
  ];
}

function createWorkPage({
  slug,
  title,
  primaryTag,
  coverImageUrl,
  category,
  summary,
  overrides,
}: CreateWorkPageInput): WorkPage {
  const defaultSummary = `Case study for ${title}.`;

  return {
    slug,
    category,
    categoryLabel: CATEGORY_LABELS[category],
    summary: summary ?? defaultSummary,
    title,
    websiteUrl: overrides?.websiteUrl ?? "#",
    primaryTag,
    coverImageUrl,
    lead: overrides?.lead ?? defaultSummary,
    paragraphs: overrides?.paragraphs ?? placeholderParagraphs(title),
    services: overrides?.services ?? DEFAULT_SERVICES,
    capabilities: overrides?.capabilities ?? [],
    collaboration: overrides?.collaboration ?? [],
    media: overrides?.media ?? DEFAULT_MEDIA,
    upNext: overrides?.upNext ?? {
      eyebrow: "Up Next",
      card: {
        title: "Next project",
        href: "#",
        background: { type: "placeholder", label: "Next project preview" },
      },
    },
  };
}

const workPageDefinitions: CreateWorkPageInput[] = [
  {
    slug: "eclipse-rx",
    title: "Eclipse RX",
    primaryTag: "Product Design",
    coverImageUrl: "/work/eclipse-rx.png",
    category: "product-design",
  },
  {
    slug: "mwo",
    title: "Midwestern Originals",
    primaryTag: "Employer",
    coverImageUrl: "/work/02.png",
    category: "employer",
  },
  {
    slug: "secure-blueprint",
    title: "Secure Blueprint",
    primaryTag: "Product Design",
    coverImageUrl: "/work/03.png",
    category: "product-design",
  },
  {
    slug: "sociy",
    title: "Sociy",
    primaryTag: "Product Design",
    coverImageUrl: "/work/04.png",
    category: "product-design",
  },
  {
    slug: "flexcard",
    title: "FlexCard",
    primaryTag: "Product Design",
    coverImageUrl: "/work/flexcard.png",
    category: "product-design",
  },
  {
    slug: "nutrilyze",
    title: "Nutrilyze",
    primaryTag: "Product Design",
    coverImageUrl: "/work/nutrilyze-cover.png",
    category: "product-design",
  },
  {
    slug: "contextual-messaging",
    title: "Contextual Messaging",
    primaryTag: "Product Design",
    coverImageUrl: "/work/contextual-messaging.png",
    category: "product-design",
  },
  {
    slug: "outcome-driven-signals-setup",
    title: "Outcome Driven Signals Setup",
    primaryTag: "Product Design",
    coverImageUrl: "/work/outcome-driven-signals-setup.png",
    category: "product-design",
  },
  {
    slug: "boring-app",
    title: "Boring App",
    primaryTag: "Product Design",
    coverImageUrl: "/work/05.png",
    category: "product-design",
  },
  {
    slug: "webflow",
    title: "Webflow",
    primaryTag: "Employer",
    coverImageUrl: "/work/06.png",
    category: "employer",
  },
  {
    slug: "conversions-api",
    title: "Conversions API",
    primaryTag: "Product Design",
    coverImageUrl: "/work/conversions-api.png",
    category: "product-design",
  },
  {
    slug: "crema",
    title: "Crema",
    primaryTag: "Employer",
    coverImageUrl: "/work/07.png",
    category: "employer",
  },
  {
    slug: "analyze",
    title: "Analyze",
    primaryTag: "Product Design",
    coverImageUrl: "/work/analyze.png",
    category: "product-design",
  },
  {
    slug: "agency",
    title: "Agency",
    primaryTag: "Employer",
    coverImageUrl: "/work/08.png",
    category: "employer",
  },
  {
    slug: "flight-pro",
    title: "Flight Pro",
    primaryTag: "Product Design",
    coverImageUrl: "/work/09.png",
    category: "product-design",
  },
  {
    slug: "dave",
    title: "Dave",
    primaryTag: "Employer",
    coverImageUrl: "/work/10.png",
    category: "employer",
  },
  {
    slug: "omnibox",
    title: "Omnibox",
    primaryTag: "Product Design",
    coverImageUrl: "/work/11.png",
    category: "product-design",
  },
  {
    slug: "dave-plus-positioning",
    title: "Dave+ Positioning",
    primaryTag: "Strategy & Research",
    coverImageUrl: "/work/06.png",
    category: "strategy-research",
  },
  {
    slug: "setup-quality",
    title: "Setup Quality",
    primaryTag: "Product Design",
    coverImageUrl: "/work/setup-quality.png",
    category: "product-design",
  },
  {
    slug: "journey-map",
    title: "Journey Map",
    primaryTag: "Strategy & Research",
    coverImageUrl: "/work/journey-map.png",
    category: "strategy-research",
  },
  {
    slug: "event-setup-tool",
    title: "Event Setup Tool",
    primaryTag: "Product Design",
    coverImageUrl: "/work/event-setup-tool.png",
    category: "product-design",
  },
  {
    slug: "payroll-aggregation",
    title: "Payroll Aggregation",
    primaryTag: "Product Design",
    coverImageUrl: "/work/payroll-aggregation.png",
    category: "product-design",
  },
  {
    slug: "meta",
    title: "Meta",
    primaryTag: "Employer",
    coverImageUrl: "/work/12.png",
    category: "employer",
  },
];

/** Home highlight order — used for Up Next chaining on mapped projects. */
export const heroWorkSlugOrder = [
  "eclipse-rx",
  "mwo",
  "secure-blueprint",
  "sociy",
  "flexcard",
  "nutrilyze",
  "contextual-messaging",
  "outcome-driven-signals-setup",
  "boring-app",
  "webflow",
  "conversions-api",
  "crema",
  "analyze",
  "agency",
  "flight-pro",
  "dave",
  "omnibox",
] as const;

function buildUpNextCard(page: WorkPage): WorkCardContent {
  return {
    title: page.title,
    href: `/work/${page.slug}`,
    background: {
      type: "image",
      src: page.coverImageUrl,
      alt: `${page.title} preview`,
    },
  };
}

export function buildUpNextCardForSlug(slug: string): WorkCardContent | undefined {
  const page = workPages[slug];
  return page ? buildUpNextCard(page) : undefined;
}

function getCircularNextSlug(
  slug: string,
  heroSlugs: string[],
  allSlugs: string[],
): string | undefined {
  const sequence = heroSlugs.includes(slug) ? heroSlugs : allSlugs;
  const index = sequence.indexOf(slug);
  if (index === -1) {
    return undefined;
  }

  return sequence[(index + 1) % sequence.length];
}

function attachUpNext(pages: WorkPage[]): WorkPage[] {
  const bySlug = new Map(pages.map((page) => [page.slug, page]));
  const heroSlugs = heroWorkSlugOrder.filter((slug) => bySlug.has(slug));
  const allSlugs = pages.map((page) => page.slug);

  return pages.map((page) => {
    const preference = workUpNextPreferences[page.slug];

    if (preference) {
      const primaryPage = bySlug.get(preference.primary);
      if (!primaryPage) {
        return page;
      }

      const secondaryPage = preference.secondary
        ? bySlug.get(preference.secondary)
        : undefined;

      return {
        ...page,
        upNext: {
          eyebrow: "Up Next",
          card: buildUpNextCard(primaryPage),
          ...(secondaryPage
            ? { secondaryCard: buildUpNextCard(secondaryPage) }
            : {}),
        },
      };
    }

    const nextSlug = getCircularNextSlug(page.slug, heroSlugs, allSlugs);
    const nextPage = nextSlug ? bySlug.get(nextSlug) : undefined;

    if (!nextPage) {
      return page;
    }

    return {
      ...page,
      upNext: {
        eyebrow: "Up Next",
        card: buildUpNextCard(nextPage),
      },
    };
  });
}

const workPagesList = attachUpNext(
  workPageDefinitions.map((definition) => createWorkPage(definition)),
);

export const workPages: Record<string, WorkPage> = Object.fromEntries(
  workPagesList.map((page) => [page.slug, page]),
);

export function getWorkPage(slug: string): WorkPage | undefined {
  return workPages[slug];
}

export function getWorkPageSlugs(): string[] {
  return Object.keys(workPages);
}

export function getWorkPagesList(): WorkPage[] {
  return workPagesList;
}
