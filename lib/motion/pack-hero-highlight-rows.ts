import type { HeroHighlight } from "@/content/hero-highlights";

type SegmentMeasurer = {
  measure: (label: string, isFirstInRow: boolean) => number;
  destroy: () => void;
};

export type PackHeroHighlightRowsOptions = {
  /** Pack against a fraction of container width. */
  widthRatio?: number;
};

/** Horizontal flex gap on gap rows (matches CSS). */
export const GAP_ROW_ITEM_GAP_EM = 1.35;

const DEFAULT_WIDTH_RATIO = 1;

function measureLabelWidth(probe: HTMLElement, label: string): number {
  const link = document.createElement("span");
  link.className = "hero-highlights__label";
  link.textContent = label;
  probe.appendChild(link);
  const width = link.getBoundingClientRect().width;
  probe.removeChild(link);
  return width;
}

function createMeasurerProbe(containerEl: HTMLElement): HTMLElement {
  const probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;top:0;left:0;overflow:hidden;height:0;width:0";
  containerEl.appendChild(probe);
  return probe;
}

/** Greedy row pack — breaks lines by measured width. */
export function packHeroHighlightRows(
  highlights: HeroHighlight[],
  containerWidth: number,
  measureSegmentWidth: (label: string, isFirstInRow: boolean) => number,
): HeroHighlight[][] {
  if (containerWidth <= 0 || highlights.length === 0) {
    return [];
  }

  const rows: HeroHighlight[][] = [];
  let currentRow: HeroHighlight[] = [];
  let currentWidth = 0;

  for (const item of highlights) {
    const isFirstInRow = currentRow.length === 0;
    const segmentWidth = measureSegmentWidth(item.label, isFirstInRow);

    if (!isFirstInRow && currentWidth + segmentWidth > containerWidth) {
      rows.push(currentRow);
      currentRow = [item];
      currentWidth = measureSegmentWidth(item.label, true);
      continue;
    }

    currentRow.push(item);
    currentWidth += segmentWidth;
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

export function layoutHeroHighlightRows(
  highlights: HeroHighlight[],
  containerWidth: number,
  measureSegmentWidth: (label: string, isFirstInRow: boolean) => number,
  options: PackHeroHighlightRowsOptions = {},
): HeroHighlight[][] {
  const { widthRatio = DEFAULT_WIDTH_RATIO } = options;

  return packHeroHighlightRows(
    highlights,
    containerWidth * widthRatio,
    measureSegmentWidth,
  );
}

export function createHighlightSegmentMeasurer(
  containerEl: HTMLElement,
): SegmentMeasurer {
  const probe = createMeasurerProbe(containerEl);

  return {
    measure: (label: string) => measureLabelWidth(probe, label),
    destroy: () => {
      probe.remove();
    },
  };
}

export function createHighlightGapRowMeasurer(
  containerEl: HTMLElement,
): SegmentMeasurer {
  const probe = createMeasurerProbe(containerEl);

  return {
    measure: (label: string, isFirstInRow: boolean) => {
      const labelWidth = measureLabelWidth(probe, label);
      if (isFirstInRow) {
        return labelWidth;
      }

      const fontSize = Number.parseFloat(getComputedStyle(containerEl).fontSize);
      return labelWidth + GAP_ROW_ITEM_GAP_EM * fontSize;
    },
    destroy: () => {
      probe.remove();
    },
  };
}

export function isSparseHighlightRow(itemCount: number): boolean {
  return itemCount <= 3;
}

export function buildGridRowTemplateColumns(itemCount: number): string {
  if (itemCount <= 0) return "";

  return Array.from({ length: itemCount }, () => "max-content").join(" ");
}
