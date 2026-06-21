"use client";

import Image from "next/image";
import Link from "next/link";

import type { ResolvedHeroMobileCard } from "@/content/hero-mobile-cards";

import { rockSalt } from "@/lib/fonts/rock-salt";

type HeroMobileCardProps = {
  card: ResolvedHeroMobileCard;
  index: number;
  stackSize: number;
  clipPath: string;
};

export function HeroMobileCard({
  card,
  index,
  stackSize,
  clipPath,
}: HeroMobileCardProps) {
  const stackStyle = {
    zIndex: stackSize - index,
    clipPath,
  };

  const content = (
    <>
      <div className="hero-mobile-card__background" aria-hidden>
        <Image
          src={card.backgroundUrl}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className="hero-mobile-card__image"
        />
        <div className="hero-mobile-card__scrim" />
      </div>

      <div className="hero-mobile-card__content">
        <h2 className="hero-mobile-card__title">{card.label}</h2>
      </div>

      {card.scribble ? (
        <p
          className={`hero-mobile-card__scribble ${rockSalt.className}`}
          aria-hidden
        >
          {card.scribble}
        </p>
      ) : null}
    </>
  );

  if (card.type === "highlight") {
    return (
      <section
        className="hero-mobile-card hero-mobile-card--link"
        data-hero-mobile-card
        data-index={index}
        style={stackStyle}
      >
        <Link
          href={`/work/${card.slug}`}
          className="hero-mobile-card__link"
          aria-label={`Open ${card.highlight.label} case study`}
        >
          {content}
        </Link>
      </section>
    );
  }

  return (
    <section
      className="hero-mobile-card"
      data-hero-mobile-card
      data-index={index}
      aria-label={card.label}
      style={stackStyle}
    >
      {content}
    </section>
  );
}
