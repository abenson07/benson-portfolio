"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  DEFAULT_WORK_CARD_PARALLAX,
  WORK_CARD_PARALLAX_SCALE,
  type WorkCardParallax,
} from "@/content/work-card";

const SCROLLER_SELECTORS = [".work-modal__panel", ".work-page"] as const;

function getScroller(root: HTMLElement): HTMLElement | Window {
  for (const selector of SCROLLER_SELECTORS) {
    const scroller = root.closest(selector);
    if (scroller instanceof HTMLElement) {
      return scroller;
    }
  }

  return window;
}

function getParallaxTravel(wrapper: HTMLElement, scale: number) {
  return wrapper.offsetHeight * (scale - 1);
}

type UseWorkCardParallaxOptions = {
  enabled?: boolean;
  parallax?: WorkCardParallax;
};

export function useWorkCardParallax({
  enabled = true,
  parallax = DEFAULT_WORK_CARD_PARALLAX,
}: UseWorkCardParallaxOptions = {}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const outer = outerRef.current;

    if (!wrapper || !outer || !enabled) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const scroller = getScroller(wrapper);
    const scale = parallax.scale ?? WORK_CARD_PARALLAX_SCALE;

    const applyStaticState = (activeScale: number, y: number) => {
      gsap.set(outer, {
        transformOrigin: "top center",
        scale: activeScale,
        y,
      });
    };

    if (reducedMotion) {
      applyStaticState(1, 0);
      return;
    }

    const createTween = () => {
      const travel = getParallaxTravel(wrapper, scale);
      applyStaticState(scale, -travel);

      return gsap.to(outer, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          scroller,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    };

    let tween = createTween();

    const refresh = () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      tween = createTween();
      ScrollTrigger.refresh();
    };

    const images = outer.querySelectorAll("img");
    images.forEach((image) => {
      if (!image.complete) {
        image.addEventListener("load", refresh, { once: true });
      }
    });

    const resizeObserver = new ResizeObserver(refresh);
    resizeObserver.observe(wrapper);

    return () => {
      resizeObserver.disconnect();
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [enabled, parallax.scale]);

  return { wrapperRef, outerRef };
}
