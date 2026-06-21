import type { HeroHighlight } from "@/content/hero-highlights";

/** Fixed three-row layout for the `manual` hero variant. */
export const heroHighlightManualRowIds: string[][] = [
  [
    "healthcare",
    "midwestern-originals",
    "cybersecurity",
    "code-koalas",
    "fintech",
    "nutrition",
    "big-tech",
  ],
  ["meta", "transit", "webflow", "adtech", "skincare", "crema", "analytics"],
  ["nuclear-plumbing", "agency", "aviation", "dave", "streaming"],
];

export function getHeroHighlightManualRows(
  highlights: HeroHighlight[],
): HeroHighlight[][] {
  const byId = new Map(highlights.map((item) => [item.id, item]));

  return heroHighlightManualRowIds
    .map((rowIds) =>
      rowIds
        .map((id) => byId.get(id))
        .filter((item): item is HeroHighlight => item !== undefined),
    )
    .filter((row) => row.length > 0);
}
