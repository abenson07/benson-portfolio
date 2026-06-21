"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

const SCROLLER_SELECTORS = [".work-modal__panel", ".work-page"] as const;
const SCROLL_START = "top 88%";

const MEDIA_REVEAL_DURATION = 0.85;
const MEDIA_DUO_STAGGER = 0.14;
const MEDIA_REVEAL_Y = 56;

const QUOTE_WORD_DURATION = 0.72;
const QUOTE_WORD_STAGGER = 0.028;
const QUOTE_ATTRIBUTION_DELAY = 0.12;

type CaseStudyScrollMotionProps = {
  children: React.ReactNode;
};

function getScroller(root: HTMLElement): HTMLElement | null {
  for (const selector of SCROLLER_SELECTORS) {
    const scroller = root.closest(selector);
    if (scroller instanceof HTMLElement) {
      return scroller;
    }
  }

  return null;
}

function setupMediaReveals(
  root: HTMLElement,
  scroller: HTMLElement,
  reducedMotion: boolean,
) {
  const singles = root.querySelectorAll<HTMLElement>(
    ".case-study-media > .case-study-media__frame",
  );

  singles.forEach((frame) => {
    if (reducedMotion) {
      gsap.set(frame, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(frame, { opacity: 0, y: MEDIA_REVEAL_Y });

    gsap.to(frame, {
      opacity: 1,
      y: 0,
      duration: MEDIA_REVEAL_DURATION,
      ease: "power3.out",
      scrollTrigger: {
        trigger: frame,
        scroller,
        start: SCROLL_START,
        once: true,
      },
    });
  });

  const duos = root.querySelectorAll<HTMLElement>(".case-study-media__duo");

  duos.forEach((duo) => {
    const frames = duo.querySelectorAll<HTMLElement>(".case-study-media__frame");

    if (reducedMotion) {
      gsap.set(frames, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(frames, { opacity: 0, y: MEDIA_REVEAL_Y });

    gsap.to(frames, {
      opacity: 1,
      y: 0,
      duration: MEDIA_REVEAL_DURATION,
      stagger: MEDIA_DUO_STAGGER,
      ease: "power3.out",
      scrollTrigger: {
        trigger: duo,
        scroller,
        start: SCROLL_START,
        once: true,
      },
    });
  });

  const upNextFrame = root.querySelector<HTMLElement>(".case-study-up-next__frame");

  if (upNextFrame) {
    if (reducedMotion) {
      gsap.set(upNextFrame, { opacity: 1, y: 0 });
      return;
    }

    gsap.set(upNextFrame, { opacity: 0, y: MEDIA_REVEAL_Y });

    gsap.to(upNextFrame, {
      opacity: 1,
      y: 0,
      duration: MEDIA_REVEAL_DURATION,
      ease: "power3.out",
      scrollTrigger: {
        trigger: upNextFrame,
        scroller,
        start: SCROLL_START,
        once: true,
      },
    });
  }
}

function setupQuoteReveal(
  root: HTMLElement,
  scroller: HTMLElement,
  reducedMotion: boolean,
) {
  const quoteText = root.querySelector<HTMLElement>(".case-study-quote__text");
  const attribution = root.querySelector<HTMLElement>(
    ".case-study-quote__attribution",
  );

  if (!quoteText) {
    return () => {};
  }

  let split: SplitType | null = null;
  let timeline: gsap.core.Timeline | null = null;

  const cleanup = () => {
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
    split?.revert();
    split = null;
    timeline = null;
  };

  if (reducedMotion) {
    gsap.set(quoteText, { opacity: 1 });
    if (attribution) {
      gsap.set(attribution, { opacity: 1, y: 0 });
    }
    return cleanup;
  }

  split = new SplitType(quoteText, {
    types: "lines,words",
    tagName: "span",
    lineClass: "case-study-quote__line",
    wordClass: "case-study-quote__word",
  });

  const words = split.words;
  const lines = split.lines;

  if (!words?.length || !lines?.length) {
    return cleanup;
  }

  gsap.set(lines, { overflow: "hidden", display: "block" });
  gsap.set(words, { yPercent: -100, opacity: 0.35, display: "inline-block" });

  if (attribution) {
    gsap.set(attribution, { opacity: 0, y: 16 });
  }

  timeline = gsap.timeline({
    scrollTrigger: {
      trigger: quoteText,
      scroller,
      start: SCROLL_START,
      once: true,
    },
  });

  timeline.to(words, {
    yPercent: 0,
    opacity: 1,
    duration: QUOTE_WORD_DURATION,
    stagger: QUOTE_WORD_STAGGER,
    ease: "power3.out",
  });

  if (attribution) {
    timeline.to(
      attribution,
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      },
      `-=${QUOTE_ATTRIBUTION_DELAY}`,
    );
  }

  return cleanup;
}

export function CaseStudyScrollMotion({ children }: CaseStudyScrollMotionProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const scroller = getScroller(root);
    if (!scroller) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let quoteCleanup = () => {};
    let cancelled = false;

    const init = async () => {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      if (cancelled) {
        return;
      }

      setupMediaReveals(root, scroller, reducedMotion);
      quoteCleanup = setupQuoteReveal(root, scroller, reducedMotion);

      ScrollTrigger.refresh();
    };

    void init();

    const onResize = () => {
      quoteCleanup();
      quoteCleanup = setupQuoteReveal(root, scroller, reducedMotion);
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      quoteCleanup();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={rootRef} className="case-study-scroll-motion">
      {children}
    </div>
  );
}
