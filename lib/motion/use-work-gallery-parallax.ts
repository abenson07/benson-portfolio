"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { WORK_CARD_PARALLAX_SCALE } from "@/content/work-card";
import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";

const PARALLAX_SCALE = WORK_CARD_PARALLAX_SCALE;

type UseWorkGalleryParallaxArgs = {
  sectionRef: RefObject<HTMLElement | null>;
};

function getParallaxTravel(frame: HTMLElement, scale: number) {
  return frame.offsetHeight * (scale - 1);
}

export function useWorkGalleryParallax({
  sectionRef,
}: UseWorkGalleryParallaxArgs) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const cards = Array.from(
      section.querySelectorAll<HTMLElement>(".work-gallery-card"),
    );
    if (cards.length === 0) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const scroller =
      section.closest(".page-wrapper--scrolling-home") ?? undefined;

    if (prefersReducedMotion()) {
      cards.forEach((card) => {
        const background = card.querySelector<HTMLElement>(
          ".work-gallery-card__background",
        );
        if (background) {
          gsap.set(background, {
            transformOrigin: "center center",
            scale: 1,
            y: 0,
            clearProps: "willChange",
          });
        }
      });
      return;
    }

    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const frame = card.querySelector<HTMLElement>(".work-gallery-card__frame");
      const background = card.querySelector<HTMLElement>(
        ".work-gallery-card__background",
      );

      if (!frame || !background) {
        return;
      }

      const createTween = () => {
        const travel = getParallaxTravel(frame, PARALLAX_SCALE);

        // 1.2× overscale from top: start top-aligned, scrub to bottom-aligned.
        gsap.set(background, {
          transformOrigin: "top center",
          scale: PARALLAX_SCALE,
          y: 0,
          willChange: "transform",
        });

        return gsap.to(background, {
          y: -travel,
          ease: "none",
          scrollTrigger: {
            trigger: card,
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

      const onLoad = () => refresh();
      if (background instanceof HTMLImageElement && !background.complete) {
        background.addEventListener("load", onLoad, { once: true });
      }

      const resizeObserver = new ResizeObserver(refresh);
      resizeObserver.observe(frame);

      cleanups.push(() => {
        resizeObserver.disconnect();
        background.removeEventListener("load", onLoad);
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [sectionRef]);
}
