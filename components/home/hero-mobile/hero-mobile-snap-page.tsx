"use client";

import { useEffect, useRef } from "react";

import {
  heroMobileCards,
  resolveHeroMobileCards,
} from "@/content/hero-mobile-cards";

import "@/app/home/hero-mobile.css";

import { useHeroMobileMaskScroll } from "@/lib/motion/use-hero-mobile-mask-scroll";

import { HeroMobileStack } from "@/components/home/hero-mobile/hero-mobile-stack";

export function HeroMobileSnapPage() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const cardCount = resolveHeroMobileCards(heroMobileCards).length;
  const { clipPaths } = useHeroMobileMaskScroll({
    cardCount,
    scrollerRef,
    mode: "snap",
  });

  useEffect(() => {
    document.documentElement.classList.add("hero-mobile-scroll-enabled");

    return () => {
      document.documentElement.classList.remove("hero-mobile-scroll-enabled");
    };
  }, []);

  return (
    <div className="page-wrapper page-wrapper--hero-mobile">
      <HeroMobileStack
        mode="snap"
        scrollerRef={scrollerRef}
        clipPaths={clipPaths}
      />
    </div>
  );
}
