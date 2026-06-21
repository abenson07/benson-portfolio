"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

import {
  createLenisScroller,
  prefersReducedMotion,
  type LenisScrollerHandle,
} from "@/lib/motion/lenis-gsap";

type WorkPageShellProps = {
  children: ReactNode;
};

export function WorkPageShell({ children }: WorkPageShellProps) {
  const pageRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<LenisScrollerHandle | null>(null);

  useLayoutEffect(() => {
    const wrapper = pageRef.current;
    if (!wrapper) {
      return;
    }

    const content = wrapper.querySelector(".case-study-page");
    if (!(content instanceof HTMLElement)) {
      return;
    }

    if (prefersReducedMotion()) {
      return;
    }

    lenisRef.current = createLenisScroller({ wrapper, content });

    return () => {
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div ref={pageRef} className="work-page">
      {children}
    </div>
  );
}
