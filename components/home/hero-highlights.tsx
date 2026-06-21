"use client";

import Link from "next/link";

import type { HeroHighlight } from "@/content/hero-highlights";
import { heroHoverDebug } from "@/lib/debug/hero-hover-debug";

type HeroHighlightsProps = {
  highlights: HeroHighlight[];
  onHover: (id: string | null) => void;
};

export function HeroHighlights({
  highlights,
  onHover,
}: HeroHighlightsProps) {
  const handlePointer = (id: string | null, source: "mouseenter" | "mouseleave" | "focus" | "blur") => {
    heroHoverDebug.logPointer(id, source);
    onHover(id);
  };

  return (
    <div
      className="hero-highlights"
      onMouseLeave={() => handlePointer(null, "mouseleave")}
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
              onMouseEnter={() => handlePointer(item.id, "mouseenter")}
              onFocus={() => handlePointer(item.id, "focus")}
              onBlur={() => handlePointer(null, "blur")}
            >
              {item.label}
            </Link>
          </span>
        ))}
      </p>
    </div>
  );
}
