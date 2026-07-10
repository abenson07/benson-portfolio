import { getWorkPage } from "@/content/work-pages";

export type HeroHighlight = {
  id: string;
  label: string;
  slug: string;
  backgroundImageUrl?: string;
};

export const heroHighlights: HeroHighlight[] = [
  { id: "design", label: "Design", slug: "eclipse-rx" },
  { id: "strategy", label: "Strategy", slug: "outcome-driven-signals-setup" },
  { id: "research", label: "Research", slug: "journey-map" },
  { id: "code", label: "Code", slug: "conversions-api" },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Distinct gradient placeholder per highlight so backgrounds visibly differ. */
export function getHighlightPlaceholderBg(id: string): string {
  const hash = hashString(id);
  const hue = hash % 360;
  const hue2 = (hue + 48 + (hash % 36)) % 360;
  const hue3 = (hue + 130 + (hash % 48)) % 360;
  const c1 = `hsl(${hue}, 52%, 46%)`;
  const c2 = `hsl(${hue2}, 44%, 30%)`;
  const c3 = `hsl(${hue3}, 48%, 58%)`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="45%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getHighlightBackgroundUrl(highlight: HeroHighlight): string {
  if (highlight.backgroundImageUrl) {
    return highlight.backgroundImageUrl;
  }

  const workPage = getWorkPage(highlight.slug);
  if (workPage?.coverImageUrl) {
    return workPage.coverImageUrl;
  }

  return getHighlightPlaceholderBg(highlight.id);
}
