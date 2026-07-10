"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";

const HOLD_DURATION = 1.6;
const CROSSFADE_DURATION = 0.9;
const CHAR_STAGGER = 0.02;

type UseFooterHeadlineArgs = {
  wordRefs: RefObject<(HTMLElement | null)[]>;
};

/**
 * Shelved (BEN-641): timed character crossfade across footer headline words.
 * Kept intact so it can be re-enabled without rewriting.
 * Loops on a timer — not tied to scroll.
 */
export function useFooterHeadline({ wordRefs }: UseFooterHeadlineArgs) {
  useLayoutEffect(() => {
    const words = (wordRefs.current ?? []).filter(
      (el): el is HTMLElement => el !== null,
    );

    if (words.length < 2) {
      return;
    }

    gsap.registerPlugin(SplitText);

    if (prefersReducedMotion()) {
      words.forEach((word, index) => {
        gsap.set(word, { opacity: index === 0 ? 1 : 0 });
      });
      return;
    }

    const splits = words.map((word) => new SplitText(word, { type: "chars" }));

    splits.forEach((split, index) => {
      gsap.set(split.chars, { opacity: index === 0 ? 1 : 0 });
    });

    const timeline = gsap.timeline({ repeat: -1 });

    for (let i = 0; i < words.length; i += 1) {
      const next = (i + 1) % words.length;
      const at = i * (HOLD_DURATION + CROSSFADE_DURATION) + HOLD_DURATION;

      timeline
        .to(
          splits[i].chars,
          {
            opacity: 0,
            stagger: { each: CHAR_STAGGER, from: "start" },
            duration: CROSSFADE_DURATION,
            ease: "none",
          },
          at,
        )
        .to(
          splits[next].chars,
          {
            opacity: 1,
            stagger: { each: CHAR_STAGGER, from: "end" },
            duration: CROSSFADE_DURATION,
            ease: "none",
          },
          at,
        );
    }

    return () => {
      timeline.kill();
      splits.forEach((split) => split.revert());
    };
  }, [wordRefs]);
}
