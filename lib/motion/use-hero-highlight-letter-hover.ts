"use client";

import { useCallback, useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";

import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";

const LETTER_DURATION = 0.45;
/** Total stagger window across a word's letters (first → last start). */
const LETTER_STAGGER_AMOUNT = 0.5;
const LETTER_EASE = "power2.inOut";
const HIDE_DELAY = 0.5;

type UseHeroHighlightLetterHoverArgs = {
  wordRef: RefObject<HTMLElement | null>;
  enabled?: boolean;
};

/**
 * Opacity crossfade, left → right on both show and hide (hide is not a reverse).
 * On leave: show finishes, then HIDE_DELAY, then hide L→R.
 * Re-enter cancels a pending hide.
 */
export function useHeroHighlightLetterHover({
  wordRef,
  enabled = true,
}: UseHeroHighlightLetterHoverArgs) {
  const showRef = useRef<gsap.core.Timeline | null>(null);
  const hideRef = useRef<gsap.core.Timeline | null>(null);
  const hideDelayRef = useRef<gsap.core.Tween | null>(null);
  const phaseRef = useRef<"primary" | "alt">("primary");
  const hideAfterShowRef = useRef(false);
  const primaryLettersRef = useRef<HTMLElement[]>([]);
  const altLettersRef = useRef<HTMLElement[]>([]);

  useLayoutEffect(() => {
    const word = wordRef.current;
    if (!word || !enabled) {
      return;
    }

    if (prefersReducedMotion()) {
      return;
    }

    const primaryLetters = Array.from(
      word.querySelectorAll<HTMLElement>(
        ".hero-highlights__word-line:not(.hero-highlights__word-line--alt) .hero-highlights__letter",
      ),
    );
    const altLetters = Array.from(
      word.querySelectorAll<HTMLElement>(
        ".hero-highlights__word-line--alt .hero-highlights__letter",
      ),
    );

    if (!primaryLetters.length || !altLetters.length) {
      return;
    }

    primaryLettersRef.current = primaryLetters;
    altLettersRef.current = altLetters;

    const letterCount = Math.max(primaryLetters.length, altLetters.length);
    const stagger =
      letterCount > 1 ? { each: LETTER_STAGGER_AMOUNT / (letterCount - 1) } : 0;

    // Resting state: primary visible, alt hidden. Use .to() only (no fromTo)
    // so paused timelines never snap letter opacity on mount.
    gsap.set(primaryLetters, { opacity: 1 });
    gsap.set(altLetters, { opacity: 0 });
    phaseRef.current = "primary";

    const show = gsap.timeline({
      paused: true,
      onComplete: () => {
        phaseRef.current = "alt";
        if (hideAfterShowRef.current) {
          hideAfterShowRef.current = false;
          hideDelayRef.current?.kill();
          hideDelayRef.current = gsap.delayedCall(HIDE_DELAY, () => {
            hideRef.current?.invalidate().play(0);
            hideDelayRef.current = null;
          });
        }
      },
    });
    show
      .to(
        primaryLetters,
        {
          opacity: 0,
          duration: LETTER_DURATION,
          stagger,
          ease: LETTER_EASE,
        },
        0,
      )
      .to(
        altLetters,
        {
          opacity: 1,
          duration: LETTER_DURATION,
          stagger,
          ease: LETTER_EASE,
        },
        0,
      );

    const hide = gsap.timeline({
      paused: true,
      onComplete: () => {
        phaseRef.current = "primary";
      },
    });
    hide
      .to(
        primaryLetters,
        {
          opacity: 1,
          duration: LETTER_DURATION,
          stagger,
          ease: LETTER_EASE,
        },
        0,
      )
      .to(
        altLetters,
        {
          opacity: 0,
          duration: LETTER_DURATION,
          stagger,
          ease: LETTER_EASE,
        },
        0,
      );

    showRef.current = show;
    hideRef.current = hide;

    return () => {
      hideDelayRef.current?.kill();
      hideDelayRef.current = null;
      hideAfterShowRef.current = false;
      show.kill();
      hide.kill();
      showRef.current = null;
      hideRef.current = null;
      primaryLettersRef.current = [];
      altLettersRef.current = [];
      gsap.set([...primaryLetters, ...altLetters], {
        clearProps: "opacity",
      });
    };
  }, [wordRef, enabled]);

  const clearPendingHide = useCallback(() => {
    hideDelayRef.current?.kill();
    hideDelayRef.current = null;
    hideAfterShowRef.current = false;
  }, []);

  const scheduleHide = useCallback(() => {
    hideDelayRef.current?.kill();
    hideDelayRef.current = gsap.delayedCall(HIDE_DELAY, () => {
      hideRef.current?.invalidate().play(0);
      hideDelayRef.current = null;
    });
  }, []);

  const play = useCallback(() => {
    clearPendingHide();
    hideRef.current?.pause();

    // Ensure we start the crossfade from a known resting primary state when
    // re-entering from primary, while still allowing mid-hide continuation
    // via invalidate() reading current values.
    if (phaseRef.current === "primary") {
      gsap.set(primaryLettersRef.current, { opacity: 1 });
      gsap.set(altLettersRef.current, { opacity: 0 });
    }

    showRef.current?.invalidate().play(0);
  }, [clearPendingHide]);

  const reverse = useCallback(() => {
    const show = showRef.current;
    if (!show) {
      return;
    }

    // Already resting on the primary word.
    if (phaseRef.current === "primary" && !show.isActive()) {
      return;
    }

    clearPendingHide();

    // Finish show before delaying + hiding L→R.
    if (show.progress() < 1) {
      hideAfterShowRef.current = true;
      if (!show.isActive()) {
        show.play();
      }
      return;
    }

    scheduleHide();
  }, [clearPendingHide, scheduleHide]);

  return { play, reverse };
}
