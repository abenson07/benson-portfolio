"use client";

import Link from "next/link";

import type { HeroHighlight } from "@/content/hero-highlights";

type HeroHighlightsProps = {
  highlights: HeroHighlight[];
  onHover: (id: string | null) => void;
};

function splitHighlightRows(highlights: HeroHighlight[]) {
  const splitIndex = Math.ceil(highlights.length / 2);
  return {
    topRow: highlights.slice(0, splitIndex),
    bottomRow: highlights.slice(splitIndex),
  };
}

type HighlightRowProps = {
  items: HeroHighlight[];
  row: "top" | "bottom";
  onHover: (id: string | null) => void;
  showLeadingSeparator?: boolean;
};

function HighlightRow({
  items,
  row,
  onHover,
  showLeadingSeparator = false,
}: HighlightRowProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <p
      className="hero-highlights__row"
      data-hero-load-row={row}
    >
      {items.map((item, index) => (
        <span key={item.id} className="hero-highlights__item">
          {index > 0 || showLeadingSeparator ? (
            <span
              className="hero-highlights__bullet"
              data-hero-load-segment
              aria-hidden
            >
              •
            </span>
          ) : null}
          <Link
            href={`/work/${item.slug}`}
            className="hero-highlights__label"
            data-hero-load-segment
            onMouseEnter={() => onHover(item.id)}
            onFocus={() => onHover(item.id)}
            onBlur={() => onHover(null)}
          >
            {item.label}
          </Link>
        </span>
      ))}
    </p>
  );
}

export function HeroHighlights({
  highlights,
  onHover,
}: HeroHighlightsProps) {
  const { topRow, bottomRow } = splitHighlightRows(highlights);

  return (
    <div
      className="hero-highlights"
      onMouseLeave={() => onHover(null)}
    >
      <HighlightRow items={topRow} row="top" onHover={onHover} />
      <HighlightRow
        items={bottomRow}
        row="bottom"
        onHover={onHover}
        showLeadingSeparator
      />
    </div>
  );
}
