"use client";

import { useLayoutEffect, type RefObject } from "react";

export function getHeroTitleChars(
  titleEl: HTMLElement,
): NodeListOf<HTMLElement> {
  return titleEl.querySelectorAll<HTMLElement>(".hero-title__char");
}

export function layoutHeroTitle(
  titleEl: HTMLElement,
  containerEl: HTMLElement,
  highlightsEl: HTMLElement | null,
): void {
  syncHighlightsToTitleBounds(titleEl, containerEl, highlightsEl);
}

/** Match highlights horizontal bounds to rendered BENSON letter edges. */
export function syncHighlightsToTitleBounds(
  titleEl: HTMLElement,
  containerEl: HTMLElement,
  highlightsEl: HTMLElement | null,
): void {
  if (!highlightsEl) return;

  const chars = getHeroTitleChars(titleEl);
  if (!chars.length) {
    containerEl.style.removeProperty("--hero-title-inset-left");
    containerEl.style.removeProperty("--hero-title-inset-right");
    return;
  }

  const containerRect = containerEl.getBoundingClientRect();
  const first = chars[0].getBoundingClientRect();
  const last = chars[chars.length - 1].getBoundingClientRect();

  const insetLeft = Math.max(0, first.left - containerRect.left);
  const insetRight = Math.max(0, containerRect.right - last.right);

  containerEl.style.setProperty("--hero-title-inset-left", `${insetLeft}px`);
  containerEl.style.setProperty("--hero-title-inset-right", `${insetRight}px`);
}

export function useFitHeroTitle(
  titleRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>,
  highlightsRef: RefObject<HTMLElement | null>,
): void {
  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    const containerEl = containerRef.current;
    const highlightsEl = highlightsRef.current;
    if (!titleEl || !containerEl) return;

    let cancelled = false;

    const layout = () => {
      if (cancelled) return;
      layoutHeroTitle(titleEl, containerEl, highlightsEl);
    };

    layout();

    const observer = new ResizeObserver(() => {
      layout();
    });
    observer.observe(containerEl);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [titleRef, containerRef, highlightsRef]);
}
