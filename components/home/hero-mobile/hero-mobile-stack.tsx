"use client";

import { useRef, type RefObject } from "react";

import {
  resolveHeroMobileCards,
  type HeroMobileCard as HeroMobileCardData,
} from "@/content/hero-mobile-cards";

import { SignatureHeader } from "@/components/home/signature-header";

import { HeroMobileCard } from "./hero-mobile-card";

export type HeroMobileScrollMode = "smooth" | "snap";

type HeroMobileStackProps = {
  cards?: HeroMobileCardData[];
  mode: HeroMobileScrollMode;
  scrollerRef?: RefObject<HTMLDivElement | null>;
  clipPaths: string[];
};

export function HeroMobileStack({
  cards,
  mode,
  scrollerRef,
  clipPaths,
}: HeroMobileStackProps) {
  const defaultScrollerRef = useRef<HTMLDivElement>(null);
  const resolvedScrollerRef = scrollerRef ?? defaultScrollerRef;
  const resolvedCards = resolveHeroMobileCards(cards);
  const stackSize = resolvedCards.length;

  return (
    <div
      className={`hero-mobile-page hero-mobile-page--${mode}`}
      data-hero-mobile-mode={mode}
    >
      <div className="hero-mobile-page__header">
        <SignatureHeader />
      </div>

      <div ref={resolvedScrollerRef} className="hero-mobile-page__scroller">
        <div className="hero-mobile-page__viewport">
          {resolvedCards.map((card, index) => (
            <HeroMobileCard
              key={card.type === "intro" ? card.id : card.highlightId}
              card={card}
              index={index}
              stackSize={stackSize}
              clipPath={clipPaths[index] ?? "inset(0 0 100% 0)"}
            />
          ))}
        </div>

        {stackSize > 1 ? (
          <div
            className="hero-mobile-page__spacer"
            aria-hidden
            style={{ height: `${(stackSize - 1) * 100}dvh` }}
          />
        ) : null}
      </div>
    </div>
  );
}
