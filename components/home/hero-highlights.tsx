"use client";

import Link from "next/link";

import type { HeroHighlight } from "@/content/hero-highlights";

type HeroHighlightsProps = {
  highlights: HeroHighlight[];
  onHover: (id: string | null) => void;
};

export function HeroHighlights({
  highlights,
  onHover,
}: HeroHighlightsProps) {
  return (
    <div
      className="hero-highlights"
      onMouseLeave={() => onHover(null)}
    >
      <p className="hero-highlights__flow">
        {highlights.map((item, index) => (
          <span key={item.id} className="hero-highlights__item">
            {index > 0 ? (
              <span className="hero-highlights__bullet" aria-hidden>
                {" "}
                •{" "}
              </span>
            ) : null}
            <Link
              href={`/work/${item.slug}`}
              className="hero-highlights__label"
              onMouseEnter={() => onHover(item.id)}
              onFocus={() => onHover(item.id)}
              onBlur={() => onHover(null)}
            >
              {item.label}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}
