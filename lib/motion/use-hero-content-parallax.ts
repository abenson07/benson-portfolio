"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";

const PARALLAX_Y = 100;
/** Scrub lag — higher = smoother / more delayed follow. */
const SCRUB_LAG = 1.2;

type UseHeroContentParallaxArgs = {
  contentRef: RefObject<HTMLElement | null>;
};

export function useHeroContentParallax({
  contentRef,
}: UseHeroContentParallaxArgs) {
  useLayoutEffect(() => {
    const content = contentRef.current;
    if (!content) {
      return;
    }

    const section = content.closest(".home-hero-section");
    if (!(section instanceof HTMLElement)) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion()) {
      gsap.set(content, { y: 0 });
      return;
    }

    const scroller =
      section.closest(".page-wrapper--scrolling-home") ?? undefined;

    const tween = gsap.fromTo(
      content,
      { y: 0 },
      {
        y: PARALLAX_Y,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          scroller,
          start: "top top",
          end: "bottom top",
          scrub: SCRUB_LAG,
          invalidateOnRefresh: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(content, { clearProps: "transform" });
    };
  }, [contentRef]);
}
