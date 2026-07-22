"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

import {
  createLenisScroller,
  prefersReducedMotion,
  type LenisScrollerHandle,
} from "@/lib/motion/lenis-gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type HomePageShellProps = {
  children: ReactNode;
};

export function HomePageShell({ children }: HomePageShellProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<LenisScrollerHandle | null>(null);

  useLayoutEffect(() => {
    const wrapper = pageRef.current;
    if (!wrapper) {
      return;
    }

    const content = wrapper.querySelector(".home-scroll-content");
    if (!(content instanceof HTMLElement)) {
      return;
    }

    if (prefersReducedMotion()) {
      return;
    }

    lenisRef.current = createLenisScroller({ wrapper, content });
    ScrollTrigger.refresh();

    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div ref={pageRef} className="page-wrapper page-wrapper--scrolling-home">
      <div className="home-scroll-content">{children}</div>
    </div>
  );
}
