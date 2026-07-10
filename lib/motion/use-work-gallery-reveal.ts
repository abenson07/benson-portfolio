"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";

const REVEAL_DURATION = 0.7;
const REVEAL_Y = 50;
const SPAN1_STAGGER = 0.2;

type UseWorkGalleryRevealArgs = {
  sectionRef: RefObject<HTMLElement | null>;
};

function getGallerySpan(card: HTMLElement) {
  const fromStyle = Number.parseFloat(
    card.style.getPropertyValue("--gallery-span"),
  );
  if (fromStyle === 1 || fromStyle === 2) {
    return fromStyle;
  }

  const computed = Number.parseFloat(
    getComputedStyle(card).getPropertyValue("--gallery-span"),
  );
  return computed === 2 ? 2 : 1;
}

export function useWorkGalleryReveal({ sectionRef }: UseWorkGalleryRevealArgs) {
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

    if (prefersReducedMotion()) {
      gsap.set(cards, { opacity: 1, y: 0 });
      return;
    }

    const scroller =
      section.closest(
        ".page-wrapper--scrolling-home, .page-wrapper--scrolling-work",
      ) ?? undefined;

    const delays: number[] = [];
    let pendingSpan1Index: number | null = null;

    cards.forEach((card, index) => {
      const span = getGallerySpan(card);

      if (span === 2) {
        delays[index] = 0;
        pendingSpan1Index = null;
        return;
      }

      if (pendingSpan1Index !== null) {
        delays[pendingSpan1Index] = 0;
        delays[index] = SPAN1_STAGGER;
        pendingSpan1Index = null;
        return;
      }

      pendingSpan1Index = index;
      delays[index] = 0;
    });

    gsap.set(cards, { opacity: 0, y: REVEAL_Y });

    const tweens = cards.map((card, index) =>
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: REVEAL_DURATION,
        ease: "power2.inOut",
        delay: delays[index] ?? 0,
        scrollTrigger: {
          trigger: card,
          start: "top 90%",
          scroller,
          once: true,
        },
      }),
    );

    return () => {
      tweens.forEach((tween) => {
        tween.scrollTrigger?.kill();
        tween.kill();
      });
    };
  }, [sectionRef]);
}
