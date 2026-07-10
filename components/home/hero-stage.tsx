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
import { useHeroMobileViewport } from "@/lib/motion/use-hero-mobile-viewport";
import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";

import {
  useCustomCursorController,
  useCustomCursorEnabled,
} from "./custom-cursor";
import { HeroBackground } from "./hero-background";
import { HeroHighlightsSection } from "./hero-highlights-section";
import { HeroMobileBrand } from "./hero-mobile-brand";
import { HeroTitle } from "./hero-title";
import { SignatureHeader } from "./signature-header";

type HeroStageProps = {
  highlights: HeroHighlight[];
};

const BACKGROUND_DEBOUNCE_MS = 180;
const HOVER_TRANSITION_DURATION = 0.75;
const BACKGROUND_CROSSFADE_DURATION = 1.25;
const MOBILE_ALEX_DURATION = 0.55;

export function HeroStage({ highlights }: HeroStageProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [backgroundUrl, setBackgroundUrl] = useState<string | null>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const titleContainerRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const mobileBrandRef = useRef<HTMLDivElement>(null);
  const prevActiveIdRef = useRef<string | null>(null);
  const cursorEnabled = useCustomCursorEnabled();
  const { setLabel: setCursorLabel, setSuppressed } =
    useCustomCursorController("hero");
  const isMobileHero = useHeroMobileViewport();
  const { isOpen: isWorkModalOpen } = useWorkOverlay();

  useFitHeroTitle(titleRef, titleContainerRef, highlightsRef);

  const activeHighlight = highlights.find((item) => item.id === activeId) ?? null;
  const activeLabel = activeHighlight?.label ?? null;

  useEffect(() => {
    setSuppressed(isMobileHero || isWorkModalOpen);
  }, [isMobileHero, isWorkModalOpen, setSuppressed]);

  useEffect(() => {
    if (isMobileHero) {
      setCursorLabel(null);
      return;
    }
    setCursorLabel(activeLabel);
  }, [activeLabel, isMobileHero, setCursorLabel]);

  useEffect(() => {
    if (isMobileHero || !activeId) {
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
  }, [activeId, highlights, isMobileHero]);

  useEffect(() => {
    const titleEl = titleRef.current;
    const titleContainerEl = titleContainerRef.current;
    const headerEl = headerRef.current;
    if (!titleEl || !titleContainerEl || !headerEl) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const init = async () => {
      await document.fonts.ready;
      if (cancelled) return;

      if (isMobileHero) {
        const brandEl = mobileBrandRef.current;
        const flowEl = brandEl?.querySelector<HTMLElement>("[data-hero-load-flow]");
        const alexEl = brandEl?.querySelector<HTMLElement>("[data-hero-mobile-alex]");
        if (!flowEl || !alexEl || cancelled) return;

        if (prefersReducedMotion()) {
          gsap.set(alexEl, { opacity: 1 });
        } else {
          gsap.set(alexEl, { opacity: 0, yPercent: 40 });
        }

        cleanup = runHeroLoadAnimation({
          titleEl,
          titleContainerEl,
          headerEl,
          highlightsFlowEl: flowEl,
          highlightsWrapperEl: null,
        });

        if (!prefersReducedMotion()) {
          gsap.to(alexEl, {
            opacity: 1,
            yPercent: 0,
            duration: MOBILE_ALEX_DURATION,
            ease: "power3.out",
            delay: 0.15,
          });
        }

        return;
      }

      const highlightsEl = highlightsRef.current;
      if (!highlightsEl) return;

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

      cleanup = runHeroLoadAnimation({
        titleEl,
        titleContainerEl,
        headerEl,
        highlightsFlowEl: flowEl,
        highlightsWrapperEl: highlightsEl,
      });
    };

    void init();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [isMobileHero]);

  useEffect(() => {
    const portrait = portraitRef.current;
    if (!portrait) return;

    if (isMobileHero) {
      gsap.set(portrait, { opacity: 1 });
      return;
    }

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
  }, [activeId, isMobileHero]);

  const handleHover = useCallback((id: string | null) => {
    setActiveId(id);
  }, []);

  const titleBlock = <HeroTitle ref={titleRef} />;

  return (
    <>
      {!isMobileHero ? (
        <HeroBackground
          imageUrl={backgroundUrl}
          visible={activeId !== null}
          enterExitDuration={HOVER_TRANSITION_DURATION}
          crossfadeDuration={BACKGROUND_CROSSFADE_DURATION}
        />
      ) : null}

      <div
        ref={portraitRef}
        className={`hero-portrait${isMobileHero ? " hero-portrait--mobile" : ""}`}
        aria-hidden
      >
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
        className={`body-wrapper${cursorEnabled && !isMobileHero ? " body-wrapper--custom-cursor" : ""}${
          activeId && !isMobileHero ? " body-wrapper--item-active" : ""
        }${isMobileHero ? " body-wrapper--mobile-hero" : ""}`}
      >
        <SignatureHeader ref={headerRef} showStatus={!isMobileHero} />

        <div ref={titleContainerRef} className="hero-content-wrapper">
          {isMobileHero ? (
            <HeroMobileBrand ref={mobileBrandRef}>{titleBlock}</HeroMobileBrand>
          ) : (
            <>
              <div ref={highlightsRef} className="hero-highlights-wrapper">
                <HeroHighlightsSection
                  highlights={highlights}
                  onHover={handleHover}
                />
              </div>
              {titleBlock}
            </>
          )}
        </div>
      </div>
    </>
  );
}
