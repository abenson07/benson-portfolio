import type { WorkCardContent } from "@/content/work-card";
import type { CaseStudyUpNext } from "@/content/work-page-template";

export function slugFromWorkHref(href: string | undefined): string | undefined {
  if (!href) {
    return undefined;
  }

  const match = href.match(/^\/work\/([^/?#]+)/);
  return match?.[1];
}

export function pickUpNextCard(
  upNext: CaseStudyUpNext,
  visitedSlugs: string[],
  currentSlug: string,
  fallbackSlugs: readonly string[],
  buildCard: (slug: string) => WorkCardContent | undefined,
): WorkCardContent {
  const visited = new Set(visitedSlugs);

  const primarySlug = slugFromWorkHref(upNext.card.href);
  if (primarySlug && primarySlug !== currentSlug && !visited.has(primarySlug)) {
    return upNext.card;
  }

  const secondarySlug = slugFromWorkHref(upNext.secondaryCard?.href);
  if (
    upNext.secondaryCard &&
    secondarySlug &&
    secondarySlug !== currentSlug &&
    !visited.has(secondarySlug)
  ) {
    return upNext.secondaryCard;
  }

  for (const slug of fallbackSlugs) {
    if (slug === currentSlug || visited.has(slug)) {
      continue;
    }

    const fallbackCard = buildCard(slug);
    if (fallbackCard) {
      return fallbackCard;
    }
  }

  return upNext.secondaryCard ?? upNext.card;
}
