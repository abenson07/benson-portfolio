import gsap from "gsap";

import {
  getHeroTitleChars,
  layoutHeroTitle,
} from "@/lib/motion/use-fit-hero-title";
import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";

export const HERO_LOAD_STAGGER = 0.2;
export const HERO_LOAD_DURATION = 0.72;
export const HERO_ROW_DURATION = 1.5;
export const HERO_NAV_DURATION = 0.5;
export const HERO_NAV_LEAD = 1;
export const HERO_LOAD_EASE = "power3.out";

const REVEAL_FROM = {
  opacity: 0,
  yPercent: 100 as number,
  transformOrigin: "50% 100%",
};

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
  highlightsWrapperEl: HTMLElement | null;
};

function getFlowSegments(flowEl: HTMLElement): HTMLElement[] {
  return Array.from(
    flowEl.querySelectorAll<HTMLElement>("[data-hero-load-segment]"),
  );
}

function getFlowRows(flowEl: HTMLElement): HTMLElement[] {
  return Array.from(
    flowEl.querySelectorAll<HTMLElement>("[data-hero-load-row]"),
  );
}

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
  onComplete?: () => void,
) {
  if (titleChars.length) {
    gsap.set(titleChars, { yPercent: 0, opacity: 1, clearProps: "transform" });
  } else {
    gsap.set(targets.titleEl, { opacity: 1 });
  }

  gsap.set(targets.highlightsFlowEl, { yPercent: 0, opacity: 1 });
  gsap.set(getFlowSegments(targets.highlightsFlowEl), {
    yPercent: 0,
    opacity: 1,
  });
  gsap.set(targets.headerEl, { yPercent: 0, opacity: 1 });
  onComplete?.();
}

function addHighlightRowAnimations(
  timeline: gsap.core.Timeline,
  flowEl: HTMLElement,
  position: string | number,
) {
  const rows = getFlowRows(flowEl);
  const rowGroups =
    rows.length > 0
      ? rows
          .map((row) => getRowSegments(row))
          .filter((segments) => segments.length > 0)
      : [getFlowSegments(flowEl)];

  for (const segments of rowGroups) {
    if (segments.length === 0) continue;

    timeline.to(
      segments,
      {
        ...REVEAL_TO,
        ...getRowRevealVars(segments.length),
      },
      position,
    );
  }
}

export function runHeroLoadAnimation(
  targets: HeroLoadTargets,
  onComplete?: () => void,
): () => void {
  let timeline: gsap.core.Timeline | null = null;
  let cancelled = false;

  const cleanup = () => {
    cancelled = true;
    timeline?.kill();
    timeline = null;
  };

  const run = async () => {
    await document.fonts.ready;
    if (cancelled) return;

    layoutHeroTitle(
      targets.titleEl,
      targets.titleContainerEl,
      targets.highlightsWrapperEl,
    );

    const titleChars = Array.from(getHeroTitleChars(targets.titleEl));
    const segments = getFlowSegments(targets.highlightsFlowEl);

    if (prefersReducedMotion()) {
      gsap.set(targets.titleEl, { opacity: 1 });
      gsap.set(targets.headerEl, { yPercent: 0, opacity: 1 });
      commitFinalState(targets, titleChars, onComplete);
      return;
    }

    if (!titleChars.length) {
      commitFinalState(targets, [], onComplete);
      return;
    }

    gsap.set(titleChars, REVEAL_FROM);
    gsap.set(targets.titleEl, { opacity: 1 });
    gsap.set(targets.highlightsFlowEl, { opacity: 1, yPercent: 0 });
    gsap.set(segments, { display: "inline-block", ...REVEAL_FROM });
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

    addHighlightRowAnimations(
      timeline,
      targets.highlightsFlowEl,
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

    timeline.eventCallback("onComplete", () => {
      onComplete?.();
    });
  };

  void run();

  return cleanup;
}
