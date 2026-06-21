"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";

import {
  getCardClipPaths,
  getScrollIndexFromScrollTop,
  getScrollTopForIndex,
} from "@/lib/motion/hero-mobile-mask";

const CARD_TRANSITION_DURATION = 0.5;
const CARD_TRANSITION_EASE = "power2.out";

export type HeroMobileScrollMode = "smooth" | "snap";

type UseHeroMobileMaskScrollOptions = {
  cardCount: number;
  scrollerRef: React.RefObject<HTMLDivElement | null>;
  mode: HeroMobileScrollMode;
};

type UseHeroMobileMaskScrollResult = {
  clipPaths: string[];
};

export function useHeroMobileMaskScroll({
  cardCount,
  scrollerRef,
  mode,
}: UseHeroMobileMaskScrollOptions): UseHeroMobileMaskScrollResult {
  const [clipPaths, setClipPaths] = useState(() => getCardClipPaths(0, cardCount));
  const activeIndexRef = useRef(0);
  const isAnimatingRef = useRef(false);

  const syncFromScroller = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller || cardCount <= 0) {
      return;
    }

    const viewportHeight = scroller.clientHeight;
    const scrollIndex = getScrollIndexFromScrollTop(
      scroller.scrollTop,
      viewportHeight,
    );

    setClipPaths(getCardClipPaths(scrollIndex, cardCount));
  }, [cardCount, scrollerRef]);

  const goToIndex = useCallback(
    (nextIndex: number) => {
      const scroller = scrollerRef.current;
      if (!scroller || cardCount <= 0) {
        return;
      }

      const clamped = Math.max(0, Math.min(cardCount - 1, nextIndex));
      if (clamped === activeIndexRef.current || isAnimatingRef.current) {
        return;
      }

      const viewportHeight = scroller.clientHeight;
      const targetScrollTop = getScrollTopForIndex(clamped, viewportHeight);
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      activeIndexRef.current = clamped;

      if (reducedMotion) {
        scroller.scrollTop = targetScrollTop;
        syncFromScroller();
        return;
      }

      isAnimatingRef.current = true;
      gsap.to(scroller, {
        scrollTop: targetScrollTop,
        duration: CARD_TRANSITION_DURATION,
        ease: CARD_TRANSITION_EASE,
        onUpdate: syncFromScroller,
        onComplete: () => {
          isAnimatingRef.current = false;
          syncFromScroller();
        },
      });
    },
    [cardCount, scrollerRef, syncFromScroller],
  );

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller || cardCount <= 0) {
      return;
    }

    scroller.scrollTop = 0;
    syncFromScroller();

    const handleScroll = () => {
      if (mode === "snap" && isAnimatingRef.current) {
        return;
      }

      syncFromScroller();
    };

    const handleResize = () => {
      scroller.scrollTop = getScrollTopForIndex(
        activeIndexRef.current,
        scroller.clientHeight,
      );
      syncFromScroller();
    };

    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    if (mode !== "snap") {
      return () => {
        scroller.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }

    gsap.registerPlugin(Observer);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      return () => {
        scroller.removeEventListener("scroll", handleScroll);
        window.removeEventListener("resize", handleResize);
      };
    }

    const observer = Observer.create({
      target: scroller,
      type: "wheel,touch,pointer",
      preventDefault: true,
      tolerance: 50,
      onUp: () => goToIndex(activeIndexRef.current + 1),
      onDown: () => goToIndex(activeIndexRef.current - 1),
    });

    return () => {
      observer.kill();
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      gsap.killTweensOf(scroller);
    };
  }, [cardCount, goToIndex, mode, scrollerRef, syncFromScroller]);

  return { clipPaths };
}
