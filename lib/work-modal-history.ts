/** Tracks App Router history so closing a work modal dismisses the whole stack. */

let firstModalHistoryIdx: number | null = null;
let modalStackDepth = 0;
let lastMarkedSlug: string | null = null;

function getHistoryIdx(): number | null {
  if (typeof window === "undefined") {
    return null;
  }

  const state = window.history.state as { idx?: number } | null;
  return typeof state?.idx === "number" ? state.idx : null;
}

/** Call when a work modal opens or soft-navigates to another work slug. */
export function markWorkModalHistoryEntry(slug: string) {
  if (typeof window === "undefined") {
    return;
  }

  // Same slug re-mark (React Strict Mode) should not deepen the stack.
  if (lastMarkedSlug === slug) {
    return;
  }

  lastMarkedSlug = slug;
  modalStackDepth += 1;

  if (firstModalHistoryIdx === null) {
    firstModalHistoryIdx = getHistoryIdx();
  }
}

export function resetWorkModalHistory() {
  firstModalHistoryIdx = null;
  modalStackDepth = 0;
  lastMarkedSlug = null;
}

/**
 * Resolve how far to rewind history to leave the modal stack.
 * Resets tracking so the next open starts fresh.
 */
export function consumeWorkModalHistoryClose():
  | { type: "back" }
  | { type: "go"; delta: number }
  | { type: "push"; href: string } {
  if (typeof window === "undefined") {
    return { type: "push", href: "/" };
  }

  const currentIdx = getHistoryIdx();
  const firstIdx = firstModalHistoryIdx;
  const depth = Math.max(modalStackDepth, 1);

  firstModalHistoryIdx = null;
  modalStackDepth = 0;
  lastMarkedSlug = null;

  let steps = depth;

  if (firstIdx !== null && currentIdx !== null) {
    steps = Math.max(currentIdx - firstIdx + 1, depth);
  }

  if (steps <= 1) {
    return window.history.length > 1
      ? { type: "back" }
      : { type: "push", href: "/" };
  }

  return { type: "go", delta: -steps };
}
