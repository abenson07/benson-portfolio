export type HomeGalleryImageFit = "wide" | "tall" | "full";

export type HomeGalleryItem = {
  slug: string;
  span: 1 | 2;
  /** Orange year eyebrow shown on the card (e.g. "'19"). */
  year: string;
  title: string;
  categoryLabel: string;
  backgroundSrc: string;
  imageSrc: string;
  /** Foreground device/mock sizing inside the card. */
  imageFit: HomeGalleryImageFit;
  /** When set, the card links to the case study (modal/page). */
  href?: string;
};

export const homeGalleryItems: HomeGalleryItem[] = [
  {
    slug: "analyze",
    span: 2,
    year: "'25",
    title: "Analyze",
    categoryLabel: "STRATEGY, DESIGN, RESEARCH",
    backgroundSrc: "/home/analyze-background.png",
    imageSrc: "/home/analyze-image.png",
    imageFit: "wide",
    href: "/work/analyze",
  },
  {
    slug: "flexcard",
    span: 1,
    year: "'24",
    title: "FlexCard",
    categoryLabel: "DESIGN & STRATEGY",
    backgroundSrc: "/home/spend-better-background.png",
    imageSrc: "/home/spend-better-image.png",
    imageFit: "tall",
  },
  {
    slug: "nutrilyze",
    span: 1,
    year: "'18",
    title: "Nutrilyze",
    categoryLabel: "PRODUCT DESIGN",
    backgroundSrc: "/home/nutrilyze-background.png",
    imageSrc: "/home/nutrilyze-image.png",
    imageFit: "tall",
    href: "/work/nutrilyze",
  },
  {
    slug: "outcome-driven-signals-setup",
    span: 2,
    year: "'20",
    title: "Outcome Driven Signals Setup",
    categoryLabel: "STRATEGY AND DESIGN",
    backgroundSrc: "/home/odss-background.png",
    imageSrc: "/home/odss-image.png",
    imageFit: "wide",
  },
  {
    slug: "eclipse-rx",
    span: 1,
    year: "'17",
    title: "Eclipse RX",
    categoryLabel: "PRODUCT DESIGN",
    backgroundSrc: "/home/eclipse-background.png",
    imageSrc: "/home/eclipse-image.png",
    imageFit: "tall",
    href: "/work/eclipse-rx",
  },
  {
    slug: "flight-pro",
    span: 1,
    year: "'18",
    title: "Flight Pro",
    categoryLabel: "PRODUCT DESIGN",
    backgroundSrc: "/home/flight-pro-background.png",
    imageSrc: "/home/flight-pro-image.png",
    imageFit: "full",
    href: "/work/flight-pro",
  },
  {
    slug: "journey-map",
    span: 2,
    year: "'23",
    title: "Journey Map",
    categoryLabel: "STRATEGY & RESEARCH",
    backgroundSrc: "/home/journey-background.png",
    imageSrc: "/home/journey-image.png",
    imageFit: "wide",
    href: "/work/journey-map",
  },
];
