"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

import type { HeroHighlight } from "@/content/hero-highlights";

import {
  createHighlightGapRowMeasurer,
  createHighlightSegmentMeasurer,
  layoutHeroHighlightRows,
} from "@/lib/motion/pack-hero-highlight-rows";

export type HeroHighlightRowPreset = "packed" | "gap" | "grid";

export function useHeroHighlightRows(
  highlights: HeroHighlight[],
  containerRef: RefObject<HTMLElement | null>,
  preset: HeroHighlightRowPreset = "packed",
): HeroHighlight[][] {
  const [rows, setRows] = useState<HeroHighlight[][]>([]);

  useLayoutEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    let cancelled = false;

    const runLayout = () => {
      if (cancelled) return;

      const width = containerEl.clientWidth;
      if (width <= 0) return;

      const measurer =
        preset === "gap"
          ? createHighlightGapRowMeasurer(containerEl)
          : createHighlightSegmentMeasurer(containerEl);

      const nextRows = layoutHeroHighlightRows(
        highlights,
        width,
        measurer.measure,
      );
      measurer.destroy();

      if (nextRows.length > 0) {
        setRows(nextRows);
      }
    };

    runLayout();

    void document.fonts.ready.then(() => {
      runLayout();
    });

    const observer = new ResizeObserver(() => {
      runLayout();
    });
    observer.observe(containerEl);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [highlights, containerRef, preset]);

  return rows;
}
