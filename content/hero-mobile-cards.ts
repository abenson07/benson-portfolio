import {
  getHighlightBackgroundUrl,
  heroHighlights,
  type HeroHighlight,
} from "@/content/hero-highlights";

export type HeroMobileIntroCard = {
  type: "intro";
  id: "benson";
  label: string;
  backgroundUrl: string;
  scribble?: string;
};

export type HeroMobileHighlightCard = {
  type: "highlight";
  highlightId: string;
  scribble?: string;
};

export type HeroMobileCard = HeroMobileIntroCard | HeroMobileHighlightCard;

export type ResolvedHeroMobileCard =
  | HeroMobileIntroCard
  | (HeroMobileHighlightCard & {
      highlight: HeroHighlight;
      label: string;
      slug: string;
      backgroundUrl: string;
    });

export const heroMobileCards: HeroMobileCard[] = [
  {
    type: "intro",
    id: "benson",
    label: "BENSON",
    backgroundUrl: "/alex-bg2.png",
    scribble: "scroll down",
  },
  {
    type: "highlight",
    highlightId: "nutrition",
    scribble: "keep going",
  },
  {
    type: "highlight",
    highlightId: "fintech",
    scribble: "tap to open",
  },
];

const highlightById = new Map(heroHighlights.map((item) => [item.id, item]));

export function resolveHeroMobileCards(
  cards: HeroMobileCard[] = heroMobileCards,
): ResolvedHeroMobileCard[] {
  const resolved: ResolvedHeroMobileCard[] = [];

  for (const card of cards) {
    if (card.type === "intro") {
      resolved.push(card);
      continue;
    }

    const highlight = highlightById.get(card.highlightId);
    if (!highlight) {
      continue;
    }

    resolved.push({
      ...card,
      highlight,
      label: highlight.label.toUpperCase(),
      slug: highlight.slug,
      backgroundUrl: getHighlightBackgroundUrl(highlight),
    });
  }

  return resolved;
}
