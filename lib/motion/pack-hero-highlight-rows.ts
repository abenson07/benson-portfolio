import type { HeroHighlight } from "@/content/hero-highlights";

type SegmentMeasurer = {
  measure: (label: string, isFirstInRow: boolean) => number;
  destroy: () => void;
};

export type PackHeroHighlightRowsOptions = {
  /** Pack against a fraction of container width to encourage more line breaks. */
  widthRatio?: number;
  /** Steer toward at least this many rows when possible. */
  minRows?: number;
  balance?: boolean;
  sortShortestFirst?: boolean;
};

const DEFAULT_WIDTH_RATIO = 1;
const MIN_ROWS_WIDTH_FLOOR = 0.58;

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

/** Pull items off the previous row so the last line isn't a sparse orphan. */
export function balanceHighlightRows(
  rows: HeroHighlight[][],
): HeroHighlight[][] {
  if (rows.length < 2) {
    return rows;
  }

  const next = rows.map((row) => [...row]);
  const last = next[next.length - 1];
  const prev = next[next.length - 2];
  const total = next.reduce((count, row) => count + row.length, 0);
  const targetLast = Math.max(3, Math.ceil(total / next.length));

  while (last.length < targetLast && prev.length > 4) {
    const moved = prev.pop();
    if (!moved) break;
    last.unshift(moved);
  }

  return next;
}

export function sortRowsShortestFirst(
  rows: HeroHighlight[][],
): HeroHighlight[][] {
  return [...rows].sort((a, b) => a.length - b.length);
}

export function layoutHeroHighlightRows(
  highlights: HeroHighlight[],
  containerWidth: number,
  measureSegmentWidth: (label: string, isFirstInRow: boolean) => number,
  options: PackHeroHighlightRowsOptions = {},
): HeroHighlight[][] {
  const {
    widthRatio = DEFAULT_WIDTH_RATIO,
    minRows = 0,
    balance = false,
    sortShortestFirst = false,
  } = options;

  let ratio = widthRatio;
  let rows = packHeroHighlightRows(
    highlights,
    containerWidth * ratio,
    measureSegmentWidth,
  );

  if (minRows > 1) {
    while (rows.length < minRows && ratio > MIN_ROWS_WIDTH_FLOOR) {
      ratio -= 0.04;
      rows = packHeroHighlightRows(
        highlights,
        containerWidth * ratio,
        measureSegmentWidth,
      );
    }
  }

  if (balance) {
    rows = balanceHighlightRows(rows);
  }

  if (sortShortestFirst) {
    rows = sortRowsShortestFirst(rows);
  }

  return rows;
}

export function createHighlightSegmentMeasurer(
  containerEl: HTMLElement,
): SegmentMeasurer {
  const probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText =
    "position:absolute;visibility:hidden;pointer-events:none;top:0;left:0;overflow:hidden;height:0;width:0";

  containerEl.appendChild(probe);

  const measure = (label: string, isFirstInRow: boolean): number => {
    const segment = document.createElement("span");
    segment.className = "hero-highlights__segment";

    if (!isFirstInRow) {
      const bullet = document.createElement("span");
      bullet.className = "hero-highlights__bullet";
      bullet.textContent = "•";
      segment.appendChild(bullet);
    }

    const link = document.createElement("span");
    link.className = "hero-highlights__label";
    link.textContent = label;
    segment.appendChild(link);

    probe.appendChild(segment);
    const width = segment.getBoundingClientRect().width;
    probe.removeChild(segment);
    return width;
  };

  return {
    measure,
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

  return Array.from({ length: itemCount * 2 - 1 }, (_, index) =>
    index % 2 === 0 ? "max-content" : "var(--hero-grid-bullet-fr, 0.22fr)",
  ).join(" ");
}
