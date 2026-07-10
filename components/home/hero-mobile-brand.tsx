"use client";

import { forwardRef, type ReactNode } from "react";

export const HERO_MOBILE_TAGLINE = "Design • Strategy • Research • Code";

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
          <span data-hero-load-segment>{HERO_MOBILE_TAGLINE}</span>
        </p>
      </div>
    );
  },
);
