"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

import { BackgroundCrossfade } from "@/components/shared/background-crossfade";
import { heroHoverDebug } from "@/lib/debug/hero-hover-debug";

type HeroBackgroundProps = {
  imageUrl: string | null;
  visible: boolean;
  enterExitDuration?: number;
  crossfadeDuration?: number;
};

const SCRIM_OPACITY = 0.12;

export function HeroBackground({
  imageUrl,
  visible,
  enterExitDuration = 0.75,
  crossfadeDuration = 1.25,
}: HeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(visible);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);

  visibleRef.current = visible;
  heroHoverDebug.setVisible(visible);

  useEffect(() => {
    if (visible && imageUrl) {
      heroHoverDebug.setDisplayUrl(imageUrl);
      setDisplayUrl(imageUrl);
    }
  }, [imageUrl, visible]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !displayUrl) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reducedMotion ? 0 : enterExitDuration;

    gsap.killTweensOf(container);

    heroHoverDebug.logAnimationStart("background-container", {
      visible,
      displayUrl,
      duration,
    });

    if (visible) {
      gsap.to(container, {
        opacity: 1,
        duration,
        ease: "power2.inOut",
        onComplete: () => {
          heroHoverDebug.logAnimationStop("background-container", {
            visible: true,
            displayUrl,
            opacity: 1,
          });
        },
      });
      return;
    }

    gsap.to(container, {
      opacity: 0,
      duration,
      ease: "power2.inOut",
      onComplete: () => {
        heroHoverDebug.logAnimationStop("background-container", {
          visible: false,
          displayUrl,
          opacity: 0,
        });

        if (!visibleRef.current) {
          heroHoverDebug.setDisplayUrl(null);
          setDisplayUrl(null);
        }
      },
    });
  }, [displayUrl, enterExitDuration, visible]);

  if (!displayUrl) {
    return null;
  }

  return (
    <div ref={containerRef} className="hero-background" aria-hidden>
      <BackgroundCrossfade
        imageUrl={displayUrl}
        fadeDuration={crossfadeDuration}
        scrimOpacity={SCRIM_OPACITY}
        className="hero-background__crossfade"
        layerClassName="hero-background__layer"
        scaleClassName="hero-background__scale"
        imageClassName="hero-background__image"
        scrimClassName="hero-background__scrim"
        debugNamespace="hero"
      />
    </div>
  );
}
