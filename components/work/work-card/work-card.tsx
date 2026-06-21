import Link from "next/link";
import type { CSSProperties } from "react";

import {
  WORK_CARD_LANDSCAPE_ASPECT,
  type WorkCardContent,
} from "@/content/work-card";

import { WorkCardThumbnail } from "./work-card-thumbnail";

export type WorkCardProps = WorkCardContent & {
  className?: string;
  parallaxEnabled?: boolean;
};

export function WorkCard({
  title,
  href,
  aspect = WORK_CARD_LANDSCAPE_ASPECT,
  background,
  foreground,
  parallax,
  titleTone = "white",
  className,
  parallaxEnabled = true,
}: WorkCardProps) {
  const style = {
    "--aspect-x": aspect.x,
    "--aspect-y": aspect.y,
  } as CSSProperties;

  const cardBody = (
    <>
      <WorkCardThumbnail
        background={background}
        foreground={foreground}
        parallax={parallax}
        parallaxEnabled={parallaxEnabled}
      />
      <div className={`work-card__content work-card__content--${titleTone}`}>
        <div className="work-card__content-inner">
          <h3 className="work-card__title">{title}</h3>
        </div>
      </div>
    </>
  );

  return (
    <div
      className={`work-card-wrapper${className ? ` ${className}` : ""}`}
      style={style}
    >
      {href ? (
        <Link href={href} className="work-card work-card--landscape">
          {cardBody}
        </Link>
      ) : (
        <div className="work-card work-card--landscape">{cardBody}</div>
      )}
    </div>
  );
}
