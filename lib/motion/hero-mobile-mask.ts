const CLIP_HIDDEN = "inset(0 0 100% 0)";
const CLIP_VISIBLE = "inset(0 0 0 0)";

export function getCardClipPaths(
  scrollIndex: number,
  cardCount: number,
): string[] {
  if (cardCount <= 0) {
    return [];
  }

  const maxIndex = cardCount - 1;
  const clamped = Math.max(0, Math.min(maxIndex, scrollIndex));
  const activeIndex = Math.floor(clamped);
  const fraction = clamped - activeIndex;

  return Array.from({ length: cardCount }, (_, index) => {
    if (index < activeIndex) {
      return CLIP_HIDDEN;
    }

    if (index === activeIndex) {
      if (fraction <= 0) {
        return CLIP_VISIBLE;
      }

      return `inset(0 0 ${fraction * 100}% 0)`;
    }

    return CLIP_VISIBLE;
  });
}

export function getScrollTopForIndex(index: number, viewportHeight: number) {
  return index * viewportHeight;
}

export function getScrollIndexFromScrollTop(
  scrollTop: number,
  viewportHeight: number,
) {
  if (viewportHeight <= 0) {
    return 0;
  }

  return scrollTop / viewportHeight;
}
