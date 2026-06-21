"use client";

import { Fragment } from "react";
import Link from "next/link";

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

type HighlightBulletProps = {
  className?: string;
};

export function HighlightBullet({ className }: HighlightBulletProps) {
  return (
    <span
      className={className ?? "hero-highlights__bullet"}
      data-hero-load-segment
      aria-hidden
    >
      •
    </span>
  );
}

type HighlightSegmentProps = {
  item: HeroHighlight;
  showBullet: boolean;
  onHover: (id: string | null) => void;
};

export function HighlightSegment({
  item,
  showBullet,
  onHover,
}: HighlightSegmentProps) {
  return (
    <span className="hero-highlights__segment">
      {showBullet ? <HighlightBullet /> : null}
      <HighlightLabel item={item} onHover={onHover} />
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
      {items.map((item, index) => (
        <HighlightSegment
          key={item.id}
          item={item}
          showBullet={index > 0}
          onHover={onHover}
        />
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
      {items.map((item, index) => (
        <HighlightSegment
          key={item.id}
          item={item}
          showBullet={index > 0}
          onHover={onHover}
        />
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
      {items.map((item, index) => (
        <Fragment key={item.id}>
          {index > 0 ? (
            <HighlightBullet className="hero-highlights__grid-bullet" />
          ) : null}
          <HighlightLabel item={item} onHover={onHover} />
        </Fragment>
      ))}
    </div>
  );
}
