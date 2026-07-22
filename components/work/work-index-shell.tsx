"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  createLenisScroller,
  prefersReducedMotion,
  type LenisScrollerHandle,
} from "@/lib/motion/lenis-gsap";
type WorkIndexShellProps = {
  children: ReactNode;
};

export function WorkIndexShell({ children }: WorkIndexShellProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<LenisScrollerHandle | null>(null);

  useLayoutEffect(() => {
    const wrapper = pageRef.current;
    if (!wrapper) {
      return;
    }

    const content = wrapper.querySelector(".work-scroll-content");
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
    <div ref={pageRef} className="page-wrapper page-wrapper--scrolling-work">
      <div className="work-scroll-content">{children}</div>
    </div>
  );
}
