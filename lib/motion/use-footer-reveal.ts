"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";

const REVEAL_Y = -100;
/** Scrub lag — higher = smoother / more delayed follow. */
const SCRUB_LAG = 1.2;

type UseFooterRevealArgs = {
  footerRef: RefObject<HTMLElement | null>;
  innerRef: RefObject<HTMLElement | null>;
};

export function useFooterReveal({ footerRef, innerRef }: UseFooterRevealArgs) {
  useLayoutEffect(() => {
    const footer = footerRef.current;
    const inner = innerRef.current;
    if (!footer || !inner) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion()) {
      gsap.set(inner, { y: 0 });
      return;
    }

    const scroller =
      footer.closest(".page-wrapper--scrolling-home") ?? undefined;

    const tween = gsap.fromTo(
      inner,
      { y: REVEAL_Y },
      {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: footer,
          scroller,
          start: "top bottom",
          end: "bottom bottom",
          scrub: SCRUB_LAG,
          invalidateOnRefresh: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(inner, { clearProps: "transform" });
    };
  }, [footerRef, innerRef]);
}
