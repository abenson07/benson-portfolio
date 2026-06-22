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
import { HeroTitle } from "./hero-title";
import { SignatureHeader } from "./signature-header";

type HeroStageProps = {
  highlights: HeroHighlight[];
};

const BACKGROUND_DEBOUNCE_MS = 180;
const HOVER_TRANSITION_DURATION = 0.75;
const CHROME_FADE_DURATION = 0.4;
const BACKGROUND_CROSSFADE_DURATION = 1.25;

export function HeroStage({ highlights }: HeroStageProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loadComplete, setLoadComplete] = useState(false);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const prevActiveIdRef = useRef<string | null>(null);
  const hoverFadeReadyRef = useRef(false);
  const cursorEnabled = useCustomCursorEnabled();
  const { isOpen: isWorkModalOpen } = useWorkOverlay();

  useFitHeroTitle(titleRef, titleContainerRef, highlightsRef);

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
    let cancelled = false;

    const init = async () => {
      await document.fonts.ready;
      if (cancelled) return;

      let flowEl: HTMLElement | null = null;
      for (let attempt = 0; attempt < 30; attempt += 1) {
        if (cancelled) return;

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

      if (!flowEl || cancelled) return;

      cleanup = runHeroLoadAnimation(
        {
          titleEl,
          titleContainerEl,
          headerEl,
          highlightsFlowEl: flowEl,
          highlightsWrapperEl: highlightsEl,
        },
        () => {
          setLoadComplete(true);
        },
      );
    };

    void init();

    return () => {
      cancelled = true;
      cleanup?.();
    };
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

  useEffect(() => {
    if (!loadComplete) return;

    if (!hoverFadeReadyRef.current) {
      hoverFadeReadyRef.current = true;
      if (activeId === null) return;
    }

    const highlightsFlowEl = highlightsRef.current?.querySelector<HTMLElement>(
      "[data-hero-load-flow]",
    );
    const headerEl = headerRef.current;
    const titleEl = titleRef.current;
    if (!highlightsFlowEl || !headerEl || !titleEl) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const duration = reducedMotion ? 0 : CHROME_FADE_DURATION;

    gsap.to([highlightsFlowEl, headerEl, titleEl], {
      opacity: activeId ? 0 : 1,
      duration,
      ease: "power2.inOut",
      overwrite: "auto",
    });
  }, [activeId, loadComplete]);

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
          src="/alex-bg2.png"
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
          <HeroTitle ref={titleRef} />
        </div>

        <CustomCursor
          label={activeLabel}
          enabled={cursorEnabled && !isWorkModalOpen}
        />
      </div>
    </>
  );
}
