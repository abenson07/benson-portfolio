"use client";

import { BackgroundCrossfade } from "@/components/shared/background-crossfade";

type HeroBackgroundProps = {
  imageUrl: string | null;
  visible: boolean;
};

const FADE_DURATION = 1.25;
const SCRIM_OPACITY = 0.12;

export function HeroBackground({ imageUrl, visible }: HeroBackgroundProps) {
  if (!imageUrl || !visible) {
    return null;
  }

  return (
    <BackgroundCrossfade
      imageUrl={imageUrl}
      fadeDuration={FADE_DURATION}
      scrimOpacity={SCRIM_OPACITY}
      className="hero-background"
      layerClassName="hero-background__layer"
      scaleClassName="hero-background__scale"
      imageClassName="hero-background__image"
      scrimClassName="hero-background__scrim"
    />
  );
}
