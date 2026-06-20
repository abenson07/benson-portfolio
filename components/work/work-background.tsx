"use client";

import { BackgroundCrossfade } from "@/components/shared/background-crossfade";

type WorkBackgroundProps = {
  imageUrl: string;
};

const FADE_DURATION = 0.8;

export function WorkBackground({ imageUrl }: WorkBackgroundProps) {
  return (
    <BackgroundCrossfade
      imageUrl={imageUrl}
      fadeDuration={FADE_DURATION}
      className="work-background"
      layerClassName="work-background__layer"
      scaleClassName="work-background__scale"
      imageClassName="work-background__image"
      scrimClassName="work-background__scrim"
    />
  );
}
