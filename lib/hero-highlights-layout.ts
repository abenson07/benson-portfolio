export const HERO_HIGHLIGHT_LAYOUTS = [
  "packed",
  "wrap",
  "justify",
  "manual",
  "gap",
  "grid",
] as const;

export type HeroHighlightLayout = (typeof HERO_HIGHLIGHT_LAYOUTS)[number];

export const DEFAULT_HERO_HIGHLIGHT_LAYOUT: HeroHighlightLayout = "gap";

export function parseHeroHighlightLayout(
  value: string | null | undefined,
): HeroHighlightLayout {
  if (
    value &&
    HERO_HIGHLIGHT_LAYOUTS.includes(value as HeroHighlightLayout)
  ) {
    return value as HeroHighlightLayout;
  }

  return DEFAULT_HERO_HIGHLIGHT_LAYOUT;
}

export const HERO_HIGHLIGHT_LAYOUT_LABELS: Record<
  HeroHighlightLayout,
  string
> = {
  packed: "Measured rows, sparse lines centered",
  wrap: "Single flex wrap + space-between",
  justify: "Inline flow + text justify",
  manual: "Three fixed rows, centered gap",
  gap: "Centered rows, measured wrap",
  grid: "Grid rows, bullets in own fr columns",
};
