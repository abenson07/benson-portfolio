"use client";

import { useSyncExternalStore } from "react";

const MOBILE_MODAL_MQ = "(max-width: 960px)";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(MOBILE_MODAL_MQ);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getMobileModalSnapshot() {
  return window.matchMedia(MOBILE_MODAL_MQ).matches;
}

function getMobileModalServerSnapshot() {
  return false;
}

export function useCaseStudyMobileModal(enabled: boolean): boolean {
  const matches = useSyncExternalStore(
    subscribe,
    getMobileModalSnapshot,
    getMobileModalServerSnapshot,
  );

  return enabled && matches;
}
