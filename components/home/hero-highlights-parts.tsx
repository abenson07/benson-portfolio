"use client";

import { useRef, type ReactNode } from "react";

import type { HeroHighlight } from "@/content/hero-highlights";
import {
  buildGridRowTemplateColumns,
  isSparseHighlightRow,
} from "@/lib/motion/pack-hero-highlight-rows";
import { useHeroHighlightLetterHover } from "@/lib/motion/use-hero-highlight-letter-hover";

function splitLetters(text: string): string[] {
  return Array.from(text);
}

type HighlightLabelProps = {
  item: HeroHighlight;
  onHover: (id: string | null) => void;
};

export function HighlightLabel({ item, onHover }: HighlightLabelProps) {
  const wordRef = useRef<HTMLSpanElement>(null);
  const { play, reverse } = useHeroHighlightLetterHover({ wordRef });

  const handleEnter = () => {
    onHover(item.id);
    play();
  };

  const handleLeave = () => {
    onHover(null);
    reverse();
  };

  return (
    <span
      className="hero-highlights__label"
      data-hero-load-segment
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span
        ref={wordRef}
        className="hero-highlights__word"
        data-hero-load-word
      >
        <span className="hero-highlights__word-line">
          {splitLetters(item.label).map((char, index) => (
            <span
              key={`primary-${char}-${index}`}
              className="hero-highlights__letter"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
        <span
          className="hero-highlights__word-line hero-highlights__word-line--alt"
          aria-hidden
        >
          {splitLetters(item.hoverLabel).map((char, index) => (
            <span
              key={`alt-${char}-${index}`}
              className="hero-highlights__letter"
            >
              {char === " " ? "\u00A0" : char}
            </span>
          ))}
        </span>
      </span>
    </span>
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
