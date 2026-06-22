"use client";

import { useHeroMobileViewport } from "@/lib/motion/use-hero-mobile-viewport";

import { HeroMobileSnapPage } from "./hero-mobile/hero-mobile-snap-page";
import { HomePage } from "./home-page";

export function ResponsiveHomePage() {
  const isMobile = useHeroMobileViewport();

  if (isMobile) {
    return <HeroMobileSnapPage />;
  }

  return <HomePage />;
}
