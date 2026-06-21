"use client";

import { useSearchParams } from "next/navigation";

import {
  HERO_HIGHLIGHT_LAYOUT_LABELS,
  parseHeroHighlightLayout,
} from "@/lib/hero-highlights-layout";

export function HeroLayoutDevBadge() {
  const searchParams = useSearchParams();
  const layout = parseHeroHighlightLayout(searchParams.get("hero"));

  return (
    <div className="hero-layout-dev-badge" aria-live="polite">
      <span className="hero-layout-dev-badge__label">hero={layout}</span>
      <span className="hero-layout-dev-badge__hint">
        {HERO_HIGHLIGHT_LAYOUT_LABELS[layout]}
      </span>
    </div>
  );
}
