"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

import type { HeroHighlight } from "@/content/hero-highlights";

import {
  createHighlightSegmentMeasurer,
  layoutHeroHighlightRows,
  type PackHeroHighlightRowsOptions,
} from "@/lib/motion/pack-hero-highlight-rows";

export type HeroHighlightRowPreset = "packed" | "gap" | "grid";

const ROW_PRESET_OPTIONS: Record<
  HeroHighlightRowPreset,
  PackHeroHighlightRowsOptions
> = {
  packed: {
    widthRatio: 0.92,
    minRows: 3,
    balance: true,
  },
  gap: {
    widthRatio: 0.92,
    minRows: 3,
    balance: true,
    sortShortestFirst: true,
  },
  grid: {
    widthRatio: 0.92,
    minRows: 3,
    balance: true,
    sortShortestFirst: true,
  },
};

export function useHeroHighlightRows(
  highlights: HeroHighlight[],
  containerRef: RefObject<HTMLElement | null>,
  preset: HeroHighlightRowPreset = "packed",
): HeroHighlight[][] {
  const [rows, setRows] = useState<HeroHighlight[][]>([]);

  useLayoutEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    const options = ROW_PRESET_OPTIONS[preset];
    let cancelled = false;

    const runLayout = () => {
      if (cancelled) return;

      const width = containerEl.clientWidth;
      if (width <= 0) return;

      const measurer = createHighlightSegmentMeasurer(containerEl);
      const nextRows = layoutHeroHighlightRows(
        highlights,
        width,
        measurer.measure,
        options,
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
