"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";
import { HERO_MOBILE_MQ } from "@/lib/motion/use-hero-mobile-viewport";

const CHAR_STAGGER = 0.02;
const LINE_DURATION = 0.5;
const LINE_OVERLAP = 0.05;
const HEADLINE_DURATION = 1;
const HEADLINE_B_START = 0.9;
const SCRIBBLE_DURATION = 0.15;
const SCRIBBLE_OVERLAP = 0.2;

type UseHeadlineScrollArgs = {
  sectionRef: RefObject<HTMLElement | null>;
  headlineARef: RefObject<HTMLElement | null>;
  headlineBRef: RefObject<HTMLElement | null>;
  scribbleRef: RefObject<HTMLElement | null>;
};

function getLineElements(headline: HTMLElement) {
  return Array.from(
    headline.querySelectorAll<HTMLElement>(".headline-scroll__line"),
  );
}

function buildDesktopTimeline(
  section: HTMLElement,
  headlineA: HTMLElement,
  headlineB: HTMLElement,
  scribble: HTMLElement,
) {
  const splitA = new SplitText(headlineA, { type: "chars" });
  const splitB = new SplitText(headlineB, { type: "chars" });

  gsap.set(splitB.chars, { opacity: 0 });
  gsap.set(scribble, { opacity: 0 });

  const scroller =
    section.closest(".page-wrapper--scrolling-home") ?? undefined;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      scroller,
    },
  });

  timeline
    .to(
      splitA.chars,
      {
        opacity: 0,
        stagger: { each: CHAR_STAGGER, from: "end" },
        duration: HEADLINE_DURATION,
        ease: "none",
      },
      0,
    )
    .to(
      splitB.chars,
      {
        opacity: 1,
        stagger: { each: CHAR_STAGGER, from: "end" },
        duration: HEADLINE_DURATION,
        ease: "none",
      },
      HEADLINE_B_START,
    )
    .to(
      scribble,
      {
        opacity: 1,
        duration: SCRIBBLE_DURATION,
        ease: "none",
      },
      `-=${SCRIBBLE_OVERLAP}`,
    );

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    splitA.revert();
    splitB.revert();
  };
}

function buildMobileTimeline(
  section: HTMLElement,
  headlineA: HTMLElement,
  headlineB: HTMLElement,
  scribble: HTMLElement,
) {
  const linesA = getLineElements(headlineA);
  const linesB = getLineElements(headlineB);

  if (linesA.length < 2 || linesB.length < 2) {
    return buildDesktopTimeline(section, headlineA, headlineB, scribble);
  }

  const splitALines = linesA.map(
    (line) => new SplitText(line, { type: "chars" }),
  );
  const splitBLines = linesB.map(
    (line) => new SplitText(line, { type: "chars" }),
  );

  for (const split of splitBLines) {
    gsap.set(split.chars, { opacity: 0 });
  }
  gsap.set(scribble, { opacity: 0 });

  const scroller =
    section.closest(".page-wrapper--scrolling-home") ?? undefined;

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      scroller,
    },
  });

  timeline.to(
    splitALines[0].chars,
    {
      opacity: 0,
      stagger: { each: CHAR_STAGGER, from: "end" },
      duration: LINE_DURATION,
      ease: "none",
    },
    0,
  );

  for (let i = 1; i < splitALines.length; i += 1) {
    timeline.to(
      splitALines[i].chars,
      {
        opacity: 0,
        stagger: { each: CHAR_STAGGER, from: "end" },
        duration: LINE_DURATION,
        ease: "none",
      },
      `>-${LINE_OVERLAP}`,
    );
  }

  timeline.to(
    splitBLines[0].chars,
    {
      opacity: 1,
      stagger: { each: CHAR_STAGGER, from: "end" },
      duration: LINE_DURATION,
      ease: "none",
    },
    HEADLINE_B_START,
  );

  for (let i = 1; i < splitBLines.length; i += 1) {
    timeline.to(
      splitBLines[i].chars,
      {
        opacity: 1,
        stagger: { each: CHAR_STAGGER, from: "end" },
        duration: LINE_DURATION,
        ease: "none",
      },
      `>-${LINE_OVERLAP}`,
    );
  }

  timeline.to(
    scribble,
    {
      opacity: 1,
      duration: SCRIBBLE_DURATION,
      ease: "none",
    },
    `-=${SCRIBBLE_OVERLAP}`,
  );

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
    for (const split of splitALines) {
      split.revert();
    }
    for (const split of splitBLines) {
      split.revert();
    }
  };
}

export function useHeadlineScroll({
  sectionRef,
  headlineARef,
  headlineBRef,
  scribbleRef,
}: UseHeadlineScrollArgs) {
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const headlineA = headlineARef.current;
    const headlineB = headlineBRef.current;
    const scribble = scribbleRef.current;

    if (!section || !headlineA || !headlineB || !scribble) {
      return;
    }

    if (prefersReducedMotion()) {
      gsap.set(headlineA, { opacity: 0 });
      gsap.set(headlineB, { opacity: 1 });
      gsap.set(scribble, { opacity: 1 });
      return;
    }

    gsap.registerPlugin(ScrollTrigger, SplitText);

    const media = window.matchMedia(HERO_MOBILE_MQ);
    let dispose: (() => void) | undefined;

    const setup = () => {
      dispose?.();
      gsap.set(headlineA, { clearProps: "opacity" });
      gsap.set(headlineB, { clearProps: "opacity" });
      gsap.set(scribble, { clearProps: "opacity" });

      dispose = media.matches
        ? buildMobileTimeline(section, headlineA, headlineB, scribble)
        : buildDesktopTimeline(section, headlineA, headlineB, scribble);
    };

    setup();
    media.addEventListener("change", setup);

    return () => {
      media.removeEventListener("change", setup);
      dispose?.();
    };
  }, [sectionRef, headlineARef, headlineBRef, scribbleRef]);
}
