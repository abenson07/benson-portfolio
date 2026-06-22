"use client";

import { useSyncExternalStore } from "react";

export const HERO_MOBILE_MQ = "(max-width: 768px)";

function subscribe(onStoreChange: () => void) {
  const media = window.matchMedia(HERO_MOBILE_MQ);
  media.addEventListener("change", onStoreChange);
  return () => media.removeEventListener("change", onStoreChange);
}

function getHeroMobileSnapshot() {
  return window.matchMedia(HERO_MOBILE_MQ).matches;
}

function getHeroMobileServerSnapshot() {
  return false;
}

export function useHeroMobileViewport(): boolean {
  return useSyncExternalStore(
    subscribe,
    getHeroMobileSnapshot,
    getHeroMobileServerSnapshot,
  );
}
