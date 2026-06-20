"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

import {
  getHighlightBackgroundUrl,
  type HeroHighlight,
} from "@/content/hero-highlights";

import { CustomCursor, useCustomCursorEnabled } from "./custom-cursor";
import { HeroBackground } from "./hero-background";
import { HeroHighlights } from "./hero-highlights";
import { SignatureHeader } from "./signature-header";

type HeroStageProps = {
  highlights: HeroHighlight[];
};

const BACKGROUND_DEBOUNCE_MS = 180;
const PORTRAIT_FADE_DURATION = 0.5;

export function HeroStage({ highlights }: HeroStageProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const prevActiveIdRef = useRef<string | null>(null);
  const cursorEnabled = useCustomCursorEnabled();

  const activeHighlight = highlights.find((item) => item.id === activeId) ?? null;
  const activeLabel = activeHighlight?.label ?? null;

  useEffect(() => {
    if (!activeId) {
      setBackgroundUrl(null);
      prevActiveIdRef.current = null;
      return;
    }

    const highlight = highlights.find((item) => item.id === activeId);
    if (!highlight) return;

    const nextUrl = getHighlightBackgroundUrl(highlight);
    const isSwitch =
      prevActiveIdRef.current !== null && prevActiveIdRef.current !== activeId;
    prevActiveIdRef.current = activeId;

    if (!isSwitch) {
      setBackgroundUrl(nextUrl);
      return;
    }

    const timeout = window.setTimeout(() => {
      setBackgroundUrl(nextUrl);
    }, BACKGROUND_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [activeId, highlights]);

  useEffect(() => {
    const portrait = portraitRef.current;
    if (!portrait) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reducedMotion ? 0 : PORTRAIT_FADE_DURATION;
    const isIdle = activeId === null;

    gsap.to(portrait, {
      opacity: isIdle ? 0.45 : 0,
      duration,
      ease: "power2.inOut",
    });
  }, [activeId]);

  const handleHover = useCallback((id: string | null) => {
    setActiveId(id);
  }, []);

  return (
    <>
      <HeroBackground imageUrl={backgroundUrl} visible={activeId !== null} />

      <div ref={portraitRef} className="hero-portrait" aria-hidden>
        <Image
          src="/alex-bg.png"
          alt=""
          width={1200}
          height={1200}
          className="hero-portrait__image"
          priority
        />
      </div>

      <div
        className={`body-wrapper${cursorEnabled ? " body-wrapper--custom-cursor" : ""}${
          activeId ? " body-wrapper--item-active" : ""
        }`}
      >
        <SignatureHeader />

        <div className="hero-content-wrapper">
          <HeroHighlights highlights={highlights} onHover={handleHover} />
          <div className="hero-title" aria-hidden>
            BENSON
          </div>
        </div>

        <CustomCursor label={activeLabel} enabled={cursorEnabled} />
      </div>
    </>
  );
}
