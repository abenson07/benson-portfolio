"use client";

import { forwardRef, type ReactNode } from "react";

const HERO_MOBILE_TAGLINE_PARTS = [
  { text: "Design", bullet: false },
  { text: "•", bullet: true },
  { text: "Strategy", bullet: false },
  { text: "•", bullet: true },
  { text: "Research", bullet: false },
  { text: "•", bullet: true },
  { text: "Code", bullet: false },
] as const;

type HeroMobileBrandProps = {
  children: ReactNode;
};

export const HeroMobileBrand = forwardRef<HTMLDivElement, HeroMobileBrandProps>(
  function HeroMobileBrand({ children }, ref) {
    return (
      <div ref={ref} className="hero-mobile-brand">
        <span className="hero-mobile-brand__alex" data-hero-mobile-alex>
          Alex
        </span>
        {children}
        <p
          className="hero-mobile-brand__tagline"
          data-hero-mobile-tagline
          data-hero-load-flow
        >
          {HERO_MOBILE_TAGLINE_PARTS.map((part, index) => (
            <span
              key={`${part.text}-${index}`}
              className={
                part.bullet
                  ? "hero-mobile-brand__bullet"
                  : "hero-mobile-brand__word"
              }
              data-hero-load-word
              aria-hidden={part.bullet || undefined}
            >
              {part.text}
              {index < HERO_MOBILE_TAGLINE_PARTS.length - 1 ? "\u00A0" : null}
            </span>
          ))}
        </p>
      </div>
    );
  },
);
