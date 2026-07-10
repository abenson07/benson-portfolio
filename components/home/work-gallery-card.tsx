"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import { useComingSoonBanner } from "@/components/coming-soon/coming-soon-banner";
import {
  WORK_CARD_LANDSCAPE_ASPECT,
  WORK_CARD_PORTRAIT_ASPECT,
} from "@/content/work-card";
import type { HomeGalleryItem } from "@/content/homepage-gallery";

type WorkGalleryCardProps = {
  item: HomeGalleryItem;
  onHover: (active: boolean, href?: string) => void;
};

export function WorkGalleryCard({ item, onHover }: WorkGalleryCardProps) {
  const { showComingSoon } = useComingSoonBanner();
  const aspect =
    item.span === 2 ? WORK_CARD_LANDSCAPE_ASPECT : WORK_CARD_PORTRAIT_ASPECT;
  const style = {
    "--aspect-x": aspect.x,
    "--aspect-y": aspect.y,
    "--gallery-span": item.span,
  } as CSSProperties;

  const content = (
    <>
      <div className="work-gallery-card__frame">
        <div className="work-gallery-card__media">
          <Image
            className="work-gallery-card__background"
            src={item.backgroundSrc}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
          <div className="work-gallery-card__foreground">
            <Image
              className={`work-gallery-card__image work-gallery-card__image--${item.imageFit}`}
              src={item.imageSrc}
              alt=""
              width={1600}
              height={1200}
              sizes="(max-width: 768px) 90vw, 40vw"
              unoptimized
            />
          </div>
        </div>
        <div className="work-gallery-card__scrim" aria-hidden />
        <div className="work-gallery-card__overlay">
          <div className="work-gallery-card__meta">
            <span className="work-gallery-card__year">{item.year}</span>
            <span className="work-gallery-card__title">{item.title}</span>
          </div>
          <span className="work-gallery-card__category">{item.categoryLabel}</span>
        </div>
      </div>

      <div className="work-gallery-card__caption">
        <div className="work-gallery-card__caption-row">
          <h3 className="work-gallery-card__caption-title">{item.title}</h3>
          <span className="work-gallery-card__caption-year">{item.year}</span>
        </div>
        <p className="work-gallery-card__caption-category">{item.categoryLabel}</p>
      </div>
    </>
  );

  if (item.href) {
    return (
      <Link
        className="work-gallery-card"
        style={style}
        data-figma-node={item.slug}
        href={item.href}
        scroll={false}
        aria-label={`Open ${item.title} case study`}
        onMouseEnter={() => onHover(true, item.href)}
        onMouseLeave={() => onHover(false)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="work-gallery-card"
      style={style}
      data-figma-node={item.slug}
      aria-label={`${item.title} — coming soon`}
      onClick={showComingSoon}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {content}
    </button>
  );
}
