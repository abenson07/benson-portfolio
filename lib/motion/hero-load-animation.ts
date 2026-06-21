import gsap from "gsap";
import SplitType from "split-type";

import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";

export const HERO_LOAD_STAGGER = 0.2;
export const HERO_LOAD_DURATION = 0.72;
export const HERO_ROW_DURATION = 1.5;
export const HERO_NAV_DURATION = 0.5;
export const HERO_NAV_LEAD = 1;
export const HERO_LOAD_EASE = "power3.out";

const REVEAL_FROM = { opacity: 0, yPercent: 100 as number };
const REVEAL_TO = {
  opacity: 1,
  yPercent: 0,
  duration: HERO_LOAD_DURATION,
  ease: HERO_LOAD_EASE,
};

const NAV_FROM = { opacity: 0, yPercent: -100 as number };

type HeroLoadTargets = {
  titleEl: HTMLElement;
  headerEl: HTMLElement;
  bottomRowEl: HTMLElement;
  topRowEl: HTMLElement;
};

function getRowSegments(rowEl: HTMLElement): HTMLElement[] {
  return Array.from(
    rowEl.querySelectorAll<HTMLElement>("[data-hero-load-segment]"),
  );
}

function getBensonEndTime(charCount: number) {
  if (charCount <= 0) return 0;
  if (charCount === 1) return HERO_LOAD_DURATION;
  return (charCount - 1) * HERO_LOAD_STAGGER + HERO_LOAD_DURATION;
}

function getRowRevealVars(segmentCount: number) {
  if (segmentCount <= 1) {
    return {
      duration: HERO_ROW_DURATION,
      stagger: 0,
    };
  }

  return {
    duration: HERO_LOAD_DURATION,
    stagger: {
      amount: HERO_ROW_DURATION - HERO_LOAD_DURATION,
      from: "start" as const,
    },
  };
}

function commitFinalState(
  targets: HeroLoadTargets,
  titleChars: HTMLElement[],
  bottomSegments: HTMLElement[],
  topSegments: HTMLElement[],
) {
  if (titleChars.length) {
    gsap.set(titleChars, { yPercent: 0, opacity: 1 });
  } else {
    gsap.set(targets.titleEl, { opacity: 1 });
  }

  gsap.set(bottomSegments, { yPercent: 0, opacity: 1 });
  gsap.set(topSegments, { yPercent: 0, opacity: 1 });
  gsap.set(targets.headerEl, { yPercent: 0, opacity: 1 });
}

export function runHeroLoadAnimation(targets: HeroLoadTargets): () => void {
  let titleSplit: SplitType | null = null;
  let timeline: gsap.core.Timeline | null = null;
  let cancelled = false;

  const cleanup = () => {
    cancelled = true;
    timeline?.kill();
    timeline = null;
    titleSplit?.revert();
    titleSplit = null;
  };

  const run = async () => {
    await document.fonts.ready;
    if (cancelled) return;

    const bottomSegments = getRowSegments(targets.bottomRowEl);
    const topSegments = getRowSegments(targets.topRowEl);

    titleSplit = new SplitType(targets.titleEl, {
      types: "chars",
      tagName: "span",
    });

    const titleChars = titleSplit.chars ?? [];

    if (prefersReducedMotion()) {
      titleSplit.revert();
      titleSplit = null;
      gsap.set(targets.titleEl, { opacity: 1 });
      gsap.set(targets.headerEl, { yPercent: 0, opacity: 1 });
      commitFinalState(targets, [], bottomSegments, topSegments);
      return;
    }

    if (!titleChars.length) {
      titleSplit.revert();
      titleSplit = null;
      commitFinalState(targets, [], bottomSegments, topSegments);
      return;
    }

    gsap.set(targets.titleEl, { opacity: 1 });
    gsap.set(titleChars, { display: "inline-block", ...REVEAL_FROM });
    gsap.set(bottomSegments, { display: "inline-block", ...REVEAL_FROM });
    gsap.set(topSegments, { display: "inline-block", ...REVEAL_FROM });
    gsap.set(targets.headerEl, NAV_FROM);

    timeline = gsap.timeline();

    timeline.addLabel("loadStart", 0);

    timeline.to(
      titleChars,
      {
        ...REVEAL_TO,
        stagger: HERO_LOAD_STAGGER,
      },
      "loadStart",
    );

    timeline.to(
      bottomSegments,
      {
        ...REVEAL_TO,
        ...getRowRevealVars(bottomSegments.length),
      },
      `loadStart+=${HERO_LOAD_STAGGER}`,
    );

    timeline.to(
      topSegments,
      {
        ...REVEAL_TO,
        ...getRowRevealVars(topSegments.length),
      },
      `loadStart+=${HERO_LOAD_STAGGER}`,
    );

    const bensonEnd = getBensonEndTime(titleChars.length);
    const navStart = Math.max(0, bensonEnd - HERO_NAV_LEAD);

    timeline.to(
      targets.headerEl,
      {
        yPercent: 0,
        opacity: 1,
        duration: HERO_NAV_DURATION,
        ease: HERO_LOAD_EASE,
      },
      navStart,
    );
  };

  void run();

  return cleanup;
}
