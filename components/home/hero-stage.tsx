"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";

import {
  getHighlightBackgroundUrl,
  type HeroHighlight,
} from "@/content/hero-highlights";

import { useWorkOverlay } from "@/components/work/work-overlay-context";

import { runHeroLoadAnimation } from "@/lib/motion/hero-load-animation";
import { useFitHeroTitle } from "@/lib/motion/use-fit-hero-title";

import { CustomCursor, useCustomCursorEnabled } from "./custom-cursor";
import { HeroBackground } from "./hero-background";
import { HeroHighlightsSection } from "./hero-highlights-section";
import { SignatureHeader } from "./signature-header";

type HeroStageProps = {
  highlights: HeroHighlight[];
};

const BACKGROUND_DEBOUNCE_MS = 180;
const HOVER_TRANSITION_DURATION = 0.75;
const BACKGROUND_CROSSFADE_DURATION = 1.25;

export function HeroStage({ highlights }: HeroStageProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const prevActiveIdRef = useRef<string | null>(null);
  const cursorEnabled = useCustomCursorEnabled();
  const { isOpen: isWorkModalOpen } = useWorkOverlay();

  useFitHeroTitle(titleRef, titleContainerRef);

  const activeHighlight = highlights.find((item) => item.id === activeId) ?? null;
  const activeLabel = activeHighlight?.label ?? null;

  useEffect(() => {
    if (!activeId) {
      prevActiveIdRef.current = null;
      setBackgroundUrl(null);
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
    const titleEl = titleRef.current;
    const titleContainerEl = titleContainerRef.current;
    const headerEl = headerRef.current;
    const highlightsEl = highlightsRef.current;
    if (!titleEl || !titleContainerEl || !headerEl || !highlightsEl) return;

    let cleanup: (() => void) | undefined;

    const init = async () => {
      await document.fonts.ready;

      let flowEl: HTMLElement | null = null;
      for (let attempt = 0; attempt < 30; attempt += 1) {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => resolve());
        });

        flowEl = highlightsEl.querySelector<HTMLElement>(
          "[data-hero-load-flow]",
        );
        if (
          flowEl?.querySelector("[data-hero-load-segment]") ||
          flowEl?.querySelector("[data-hero-load-row]")
        ) {
          break;
        }
        flowEl = null;
      }

      if (!flowEl) return;

      cleanup = runHeroLoadAnimation({
        titleEl,
        titleContainerEl,
        headerEl,
        highlightsFlowEl: flowEl,
      });
    };

    void init();

    return () => cleanup?.();
  }, []);

  useEffect(() => {
    const portrait = portraitRef.current;
    if (!portrait) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reducedMotion ? 0 : HOVER_TRANSITION_DURATION;
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
      <HeroBackground
        imageUrl={backgroundUrl}
        visible={activeId !== null}
        enterExitDuration={HOVER_TRANSITION_DURATION}
        crossfadeDuration={BACKGROUND_CROSSFADE_DURATION}
      />

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
        <SignatureHeader ref={headerRef} />

        <div ref={titleContainerRef} className="hero-content-wrapper">
          <div ref={highlightsRef} className="hero-highlights-wrapper">
            <HeroHighlightsSection highlights={highlights} onHover={handleHover} />
          </div>
          <div
            ref={titleRef}
            className="hero-title"
            data-title-text="BENSON"
            aria-hidden
          >
            BENSON
          </div>
        </div>

        <CustomCursor
          label={activeLabel}
          enabled={cursorEnabled && !isWorkModalOpen}
        />
      </div>
    </>
  );
}
