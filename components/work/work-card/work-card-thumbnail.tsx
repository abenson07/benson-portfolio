"use client";

import Image from "next/image";

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

  if (
    (foreground.layout === "full" || foreground.layout === "tall") &&
    foreground.media.type === "image"
  ) {
    const isFull = foreground.layout === "full";

    return (
      <div
        className={`work-card__foreground work-card__foreground--${foreground.layout}`}
      >
        <Image
          src={foreground.media.src}
          alt={foreground.media.alt ?? ""}
          width={isFull ? 4223 : 658}
          height={isFull ? 995 : 964}
          className={`work-card__media work-card__media--${foreground.layout}`}
          sizes={
            isFull
              ? "(max-width: 960px) 140vw, 90rem"
              : "(max-width: 960px) 55vw, 28rem"
          }
          draggable={false}
        />
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

  const backgroundStyle =
    background.type === "image"
      ? {
          backgroundImage: `url(${background.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }
      : undefined;

  return (
    <div ref={wrapperRef} className="work-card__thumbnail-wrapper">
      <div
        ref={outerRef}
        className="work-card__thumbnail-outer"
        style={backgroundStyle}
      >
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
