"use client";

import {
  DEFAULT_WORK_CARD_PARALLAX,
  type WorkCardForeground,
  type WorkCardMedia,
  type WorkCardParallax,
} from "@/content/work-card";

import { WorkCardMediaView } from "./work-card-media";
import { useWorkCardParallax } from "./use-work-card-parallax";

type WorkCardThumbnailProps = {
  background: WorkCardMedia;
  foreground?: WorkCardForeground;
  parallax?: WorkCardParallax;
  parallaxEnabled?: boolean;
};

function ForegroundContent({ foreground }: { foreground: WorkCardForeground }) {
  if (foreground.layout === "phone-grid" && foreground.phones?.length) {
    return (
      <div className="work-card__phone-grid">
        {foreground.phones.map((phone, index) => (
          <div key={index} className="work-card__phone">
            <WorkCardMediaView media={phone} sizes="20vw" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`work-card__foreground work-card__foreground--${foreground.layout}`}>
      <WorkCardMediaView media={foreground.media} sizes="(max-width: 960px) 70vw, 42rem" />
    </div>
  );
}

export function WorkCardThumbnail({
  background,
  foreground,
  parallax = DEFAULT_WORK_CARD_PARALLAX,
  parallaxEnabled = true,
}: WorkCardThumbnailProps) {
  const { wrapperRef, outerRef } = useWorkCardParallax({
    enabled: parallaxEnabled,
    parallax,
  });

  return (
    <div ref={wrapperRef} className="work-card__thumbnail-wrapper">
      <div ref={outerRef} className="work-card__thumbnail-outer">
        <WorkCardMediaView media={background} priority />
      </div>

      {foreground ? (
        <div
          className={`work-card__thumbnail-inner work-card__thumbnail-inner--${foreground.layout}`}
        >
          <ForegroundContent foreground={foreground} />
        </div>
      ) : null}
    </div>
  );
}
