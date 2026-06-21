import gsap from "gsap";
import SplitType from "split-type";

import { fitHeroTitle } from "@/lib/motion/use-fit-hero-title";
import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";

export const HERO_LOAD_STAGGER = 0.2;
export const HERO_LOAD_DURATION = 0.72;
export const HERO_ROW_DURATION = 0.85;
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
  titleContainerEl: HTMLElement;
  headerEl: HTMLElement;
  highlightsFlowEl: HTMLElement;
};

function getFlowSegments(flowEl: HTMLElement): HTMLElement[] {
  return Array.from(
    flowEl.querySelectorAll<HTMLElement>("[data-hero-load-segment]"),
  );
}

function getBensonEndTime(charCount: number) {
  if (charCount <= 0) return 0;
  if (charCount === 1) return HERO_LOAD_DURATION;
  return (charCount - 1) * HERO_LOAD_STAGGER + HERO_LOAD_DURATION;
}

function commitFinalState(
  targets: HeroLoadTargets,
  titleChars: HTMLElement[],
) {
  if (titleChars.length) {
    gsap.set(titleChars, { yPercent: 0, opacity: 1 });
  } else {
    gsap.set(targets.titleEl, { opacity: 1 });
  }

  gsap.set(targets.highlightsFlowEl, { yPercent: 0, opacity: 1 });
  gsap.set(getFlowSegments(targets.highlightsFlowEl), {
    yPercent: 0,
    opacity: 1,
  });
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

    fitHeroTitle(targets.titleEl, targets.titleContainerEl);

    titleSplit = new SplitType(targets.titleEl, {
      types: "chars",
      tagName: "span",
    });

    fitHeroTitle(targets.titleEl, targets.titleContainerEl);

    const titleChars = titleSplit.chars ?? [];

    if (prefersReducedMotion()) {
      titleSplit.revert();
      titleSplit = null;
      gsap.set(targets.titleEl, { opacity: 1 });
      gsap.set(targets.headerEl, { yPercent: 0, opacity: 1 });
      commitFinalState(targets, []);
      return;
    }

    if (!titleChars.length) {
      titleSplit.revert();
      titleSplit = null;
      commitFinalState(targets, []);
      return;
    }

    gsap.set(targets.titleEl, { opacity: 1 });
    gsap.set(titleChars, { display: "inline-block", ...REVEAL_FROM });
    gsap.set(targets.highlightsFlowEl, { ...REVEAL_FROM });
    gsap.set(getFlowSegments(targets.highlightsFlowEl), {
      opacity: 1,
      yPercent: 0,
    });
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
      targets.highlightsFlowEl,
      {
        opacity: 1,
        yPercent: 0,
        duration: HERO_ROW_DURATION,
        ease: HERO_LOAD_EASE,
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
