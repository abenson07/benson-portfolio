"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import type { HeroHighlight } from "@/content/hero-highlights";
import {
  buildGridRowTemplateColumns,
  isSparseHighlightRow,
} from "@/lib/motion/pack-hero-highlight-rows";

type HighlightLabelProps = {
  item: HeroHighlight;
  onHover: (id: string | null) => void;
};

export function HighlightLabel({ item, onHover }: HighlightLabelProps) {
  return (
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
  );
}

type HighlightSegmentProps = {
  item: HeroHighlight;
  onHover: (id: string | null) => void;
  children?: ReactNode;
};

export function HighlightSegment({
  item,
  onHover,
  children,
}: HighlightSegmentProps) {
  return (
    <span className="hero-highlights__segment">
      <HighlightLabel item={item} onHover={onHover} />
      {children}
    </span>
  );
}

type HighlightRowProps = {
  items: HeroHighlight[];
  rowIndex: number;
  onHover: (id: string | null) => void;
};

export function HighlightPackedRow({
  items,
  rowIndex,
  onHover,
}: HighlightRowProps) {
  const sparse = isSparseHighlightRow(items.length);

  return (
    <div
      className={`hero-highlights__row${
        sparse ? " hero-highlights__row--sparse" : ""
      }`}
      data-hero-load-row={rowIndex}
    >
      {items.map((item) => (
        <HighlightSegment key={item.id} item={item} onHover={onHover} />
      ))}
    </div>
  );
}

export function HighlightGapRow({
  items,
  rowIndex,
  onHover,
}: HighlightRowProps) {
  return (
    <div className="hero-highlights__gap-row" data-hero-load-row={rowIndex}>
      {items.map((item) => (
        <HighlightLabel key={item.id} item={item} onHover={onHover} />
      ))}
    </div>
  );
}

export function HighlightGridRow({
  items,
  rowIndex,
  onHover,
}: HighlightRowProps) {
  return (
    <div
      className="hero-highlights__grid-row"
      data-hero-load-row={rowIndex}
      style={{
        gridTemplateColumns: buildGridRowTemplateColumns(items.length),
      }}
    >
      {items.map((item) => (
        <HighlightLabel key={item.id} item={item} onHover={onHover} />
      ))}
    </div>
  );
}
