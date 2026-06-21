"use client";

import { Suspense } from "react";

import type { HeroHighlight } from "@/content/hero-highlights";

import { HeroHighlights } from "./hero-highlights";
import { HeroLayoutDevBadge } from "./hero-layout-dev-badge";

type HeroHighlightsSectionProps = {
  highlights: HeroHighlight[];
  onHover: (id: string | null) => void;
};

function HeroHighlightsFallback() {
  return (
    <div
      className="hero-highlights hero-highlights--packed"
      data-hero-load-flow
      aria-hidden
    />
  );
}

export function HeroHighlightsSection({
  highlights,
  onHover,
}: HeroHighlightsSectionProps) {
  return (
    <>
      <Suspense fallback={<HeroHighlightsFallback />}>
        <HeroHighlights highlights={highlights} onHover={onHover} />
        <HeroLayoutDevBadge />
      </Suspense>
    </>
  );
}
