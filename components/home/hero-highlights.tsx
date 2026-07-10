"use client";

import { useRef } from "react";
import { useSearchParams } from "next/navigation";

import { getHeroHighlightManualRows } from "@/content/hero-highlight-manual-rows";
import type { HeroHighlight } from "@/content/hero-highlights";
import {
  parseHeroHighlightLayout,
  type HeroHighlightLayout,
} from "@/lib/hero-highlights-layout";
import { useHeroHighlightRows } from "@/lib/motion/use-hero-highlight-rows";

import {
  HighlightGapRow,
  HighlightGridRow,
  HighlightLabel,
  HighlightPackedRow,
  HighlightSegment,
} from "./hero-highlights-parts";

type HeroHighlightsProps = {
  highlights: HeroHighlight[];
  onHover: (id: string | null) => void;
  layout?: HeroHighlightLayout;
};

function HeroHighlightsPacked({
  highlights,
  onHover,
}: Omit<HeroHighlightsProps, "layout">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rows = useHeroHighlightRows(highlights, containerRef, "packed");

  return (
    <div
      ref={containerRef}
      className="hero-highlights hero-highlights--packed"
      data-hero-load-flow
      onMouseLeave={() => onHover(null)}
    >
      {rows.map((items, index) => (
        <HighlightPackedRow
          key={`${items.map((item) => item.id).join("-")}-${index}`}
          items={items}
          rowIndex={index}
          onHover={onHover}
        />
      ))}
    </div>
  );
}

function HeroHighlightsGap({
  highlights,
  onHover,
}: Omit<HeroHighlightsProps, "layout">) {
  return (
    <div
      className="hero-highlights hero-highlights--gap"
      data-hero-load-flow
      onMouseLeave={() => onHover(null)}
    >
      {highlights.map((item, index) => (
        <HighlightSegment key={item.id} item={item} onHover={onHover}>
          {index < highlights.length - 1 ? (
            <span className="hero-highlights__bullet" aria-hidden>
              •
            </span>
          ) : null}
        </HighlightSegment>
      ))}
    </div>
  );
}

function HeroHighlightsManual({
  highlights,
  onHover,
}: Omit<HeroHighlightsProps, "layout">) {
  const rows = getHeroHighlightManualRows(highlights);

  return (
    <div
      className="hero-highlights hero-highlights--manual"
      data-hero-load-flow
      onMouseLeave={() => onHover(null)}
    >
      {rows.map((items, index) => (
        <HighlightGapRow
          key={`manual-${index}`}
          items={items}
          rowIndex={index}
          onHover={onHover}
        />
      ))}
    </div>
  );
}

function HeroHighlightsWrap({
  highlights,
  onHover,
}: Omit<HeroHighlightsProps, "layout">) {
  return (
    <div
      className="hero-highlights hero-highlights--wrap"
      data-hero-load-flow
      onMouseLeave={() => onHover(null)}
    >
      {highlights.map((item) => (
        <HighlightLabel key={item.id} item={item} onHover={onHover} />
      ))}
    </div>
  );
}

function HeroHighlightsJustify({
  highlights,
  onHover,
}: Omit<HeroHighlightsProps, "layout">) {
  return (
    <div
      className="hero-highlights hero-highlights--justify"
      data-hero-load-flow
      onMouseLeave={() => onHover(null)}
    >
      <p className="hero-highlights__flow">
        {highlights.map((item) => (
          <span key={item.id} className="hero-highlights__unit">
            <HighlightLabel item={item} onHover={onHover} />
          </span>
        ))}
      </p>
    </div>
  );
}

function HeroHighlightsGrid({
  highlights,
  onHover,
}: Omit<HeroHighlightsProps, "layout">) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rows = useHeroHighlightRows(highlights, containerRef, "grid");

  return (
    <div
      ref={containerRef}
      className="hero-highlights hero-highlights--grid"
      data-hero-load-flow
      onMouseLeave={() => onHover(null)}
    >
      {rows.map((items, index) => (
        <HighlightGridRow
          key={`${items.map((item) => item.id).join("-")}-${index}`}
          items={items}
          rowIndex={index}
          onHover={onHover}
        />
      ))}
    </div>
  );
}

function HeroHighlightsInner({
  highlights,
  onHover,
  layout,
}: HeroHighlightsProps) {
  switch (layout) {
    case "wrap":
      return <HeroHighlightsWrap highlights={highlights} onHover={onHover} />;
    case "gap":
      return <HeroHighlightsGap highlights={highlights} onHover={onHover} />;
    case "justify":
      return (
        <HeroHighlightsJustify highlights={highlights} onHover={onHover} />
      );
    case "manual":
      return (
        <HeroHighlightsManual highlights={highlights} onHover={onHover} />
      );
    case "grid":
      return <HeroHighlightsGrid highlights={highlights} onHover={onHover} />;
    case "packed":
    default:
      return (
        <HeroHighlightsPacked highlights={highlights} onHover={onHover} />
      );
  }
}

export function HeroHighlights({
  highlights,
  onHover,
  layout: layoutProp,
}: HeroHighlightsProps) {
  const searchParams = useSearchParams();
  const layout =
    layoutProp ?? parseHeroHighlightLayout(searchParams.get("hero"));

  return (
    <HeroHighlightsInner
      highlights={highlights}
      onHover={onHover}
      layout={layout}
    />
  );
}
