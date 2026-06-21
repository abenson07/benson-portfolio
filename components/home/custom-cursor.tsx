"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

type CustomCursorProps = {
  label: string | null;
  enabled: boolean;
};

const DOT_SIZE = 20;
const MIN_CIRCLE = 160;
const CIRCLE_PADDING = 56;
const EXPAND_DURATION = 0.35;
const FOLLOW_DURATION = 0.35;

function measureCircleSize(label: string): number {
  if (typeof document === "undefined") return MIN_CIRCLE;

  const probe = document.createElement("span");
  probe.textContent = label;
  probe.style.cssText = `
    position: absolute;
    visibility: hidden;
    white-space: nowrap;
    font-family: var(--font-pp-migra), "Iowan Old Style", "Palatino Linotype", serif;
    font-size: clamp(1.25rem, 2.4vw, 2rem);
    font-weight: 400;
    line-height: 1.1;
  `;
  document.body.appendChild(probe);
  const width = probe.offsetWidth;
  const height = probe.offsetHeight;
  document.body.removeChild(probe);

  return Math.max(MIN_CIRCLE, width + CIRCLE_PADDING, height + CIRCLE_PADDING);
}

export function CustomCursor({ label, enabled }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);
  const xToRef = useRef<gsap.QuickToFunc | null>(null);
  const yToRef = useRef<gsap.QuickToFunc | null>(null);
  const reducedMotionRef = useRef(false);
  const expandedRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    if (!enabled || !cursorRef.current) return;

    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });

    xToRef.current = gsap.quickTo(cursorRef.current, "x", {
      duration: FOLLOW_DURATION,
      ease: "power3.out",
    });
    yToRef.current = gsap.quickTo(cursorRef.current, "y", {
      duration: FOLLOW_DURATION,
      ease: "power3.out",
    });

    const handleMove = (event: MouseEvent) => {
      gsap.to(cursorRef.current, { opacity: 1, duration: 0.15, overwrite: "auto" });
      xToRef.current?.(event.clientX);
      yToRef.current?.(event.clientY);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, [enabled]);

  useEffect(() => {
    const cursor = cursorRef.current;
    const labelEl = labelRef.current;
    const dot = dotRef.current;
    if (!cursor || !labelEl || !dot || !enabled) return;

    const reducedMotion = reducedMotionRef.current;
    const isExpanded = Boolean(label);
    const duration = reducedMotion ? 0 : EXPAND_DURATION;

    if (isExpanded && label) {
      labelEl.textContent = label;
      gsap.set(labelEl, { visibility: "visible" });
      cursor.classList.add("custom-cursor--expanded");

      const targetSize = measureCircleSize(label);
      const fromSize = expandedRef.current ? undefined : DOT_SIZE;

      if (fromSize !== undefined) {
        gsap.set(cursor, { width: DOT_SIZE, height: DOT_SIZE });
      }

      gsap.to(cursor, {
        width: targetSize,
        height: targetSize,
        duration,
        ease: "power2.out",
      });
      gsap.to(dot, {
        scale: 0,
        opacity: 0,
        duration: duration * 0.5,
        ease: "power2.in",
      });
      gsap.to(labelEl, { opacity: 1, duration, ease: "power2.out" });
      expandedRef.current = true;
      return;
    }

    cursor.classList.remove("custom-cursor--expanded");
    expandedRef.current = false;
    labelEl.textContent = "";
    gsap.set(labelEl, { opacity: 0, visibility: "hidden" });

    gsap.to(cursor, {
      width: DOT_SIZE,
      height: DOT_SIZE,
      duration,
      ease: "power2.out",
    });
    gsap.to(dot, { scale: 1, opacity: 1, duration, ease: "power2.out" });
  }, [enabled, label]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="custom-cursor"
      aria-hidden
      style={{
        width: DOT_SIZE,
        height: DOT_SIZE,
      }}
    >
      <span ref={dotRef} className="custom-cursor__dot" />
      <span ref={labelRef} className="custom-cursor__label" />
    </div>
  );
}

export function useCustomCursorEnabled() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    setEnabled(finePointer && !reducedMotion);
  }, []);

  return enabled;
}
