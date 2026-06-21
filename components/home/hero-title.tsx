"use client";

import { forwardRef } from "react";

import {
  HERO_TITLE_FILL,
  HERO_TITLE_LETTERS,
  HERO_TITLE_VIEWBOX,
} from "@/content/hero-title-asset";

export const HeroTitle = forwardRef<HTMLDivElement>(function HeroTitle(_, ref) {
  const { height } = HERO_TITLE_VIEWBOX;

  return (
    <div ref={ref} className="hero-title" data-title-text="BENSON" aria-hidden>
      <div className="hero-title__track" style={{ columnGap: "1rem" }}>
        {HERO_TITLE_LETTERS.map(({ char, d, x, width }, index) => (
          <div
            key={`${char}-${index}`}
            className="hero-title__char"
            data-char={char}
            style={{ flex: `${width} 1 0` }}
          >
            <svg
              className="hero-title__char-svg"
              viewBox={`${x} 0 ${width} ${height}`}
              preserveAspectRatio="xMidYMax meet"
              role="presentation"
              aria-hidden
            >
              <path d={d} fill={HERO_TITLE_FILL} />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
});
