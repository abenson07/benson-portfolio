"use client";

import { useLayoutEffect, type RefObject } from "react";

/** Reference font size (px) used to measure BENSON before scaling to the container. */
export const HERO_TITLE_REFERENCE_FONT_SIZE = 350;

function getTitlePlainText(titleEl: HTMLElement): string {
  return (
    titleEl.dataset.titleText ??
    titleEl.textContent?.replace(/\s+/g, "") ??
    ""
  );
}

function measureTitleTextWidth(
  titleEl: HTMLElement,
  fontSizePx: number,
): number {
  const text = getTitlePlainText(titleEl);
  if (!text) return 0;

  const style = getComputedStyle(titleEl);
  const probe = document.createElement("span");
  probe.textContent = text;
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;white-space:nowrap;";
  probe.style.fontFamily = style.fontFamily;
  probe.style.fontWeight = style.fontWeight;
  probe.style.fontStyle = style.fontStyle;
  probe.style.fontSize = `${fontSizePx}px`;
  probe.style.letterSpacing = style.letterSpacing;

  document.body.appendChild(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
}

export function fitHeroTitle(
  titleEl: HTMLElement,
  containerEl: HTMLElement,
): void {
  const containerWidth = containerEl.clientWidth;
  if (containerWidth <= 0) return;

  const textWidth = measureTitleTextWidth(
    titleEl,
    HERO_TITLE_REFERENCE_FONT_SIZE,
  );
  if (textWidth <= 0) return;

  const scale = containerWidth / textWidth;
  titleEl.style.fontSize = `${HERO_TITLE_REFERENCE_FONT_SIZE * scale}px`;
}

export function useFitHeroTitle(
  titleRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>,
): void {
  useLayoutEffect(() => {
    const titleEl = titleRef.current;
    const containerEl = containerRef.current;
    if (!titleEl || !containerEl) return;

    let cancelled = false;

    const fit = () => {
      if (cancelled) return;
      fitHeroTitle(titleEl, containerEl);
    };

    const run = async () => {
      await document.fonts.ready;
      if (cancelled) return;
      fit();
    };

    run();

    const observer = new ResizeObserver(() => {
      fit();
    });
    observer.observe(containerEl);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [titleRef, containerRef]);
}
