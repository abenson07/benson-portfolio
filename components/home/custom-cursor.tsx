"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import gsap from "gsap";

type CustomCursorController = {
  setLabel: (label: string | null, owner: string) => void;
  setSuppressed: (suppressed: boolean) => void;
};

const CustomCursorContext = createContext<CustomCursorController | null>(null);

const DOT_SIZE = 20;
const MIN_CIRCLE = 160;
const CIRCLE_PADDING = 56;
const EXPAND_DURATION = 0.35;
const FOLLOW_DURATION = 0.35;

const lastPointer = { x: 0, y: 0 };
let pointerListenerBound = false;

function ensurePointerTracking() {
  if (pointerListenerBound || typeof window === "undefined") {
    return;
  }

  pointerListenerBound = true;
  window.addEventListener(
    "mousemove",
    (event) => {
      lastPointer.x = event.clientX;
      lastPointer.y = event.clientY;
    },
    { passive: true },
  );
}

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

function CustomCursorView({
  label,
  enabled,
}: {
  label: string | null;
  enabled: boolean;
}) {
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
    ensurePointerTracking();
  }, []);

  useEffect(() => {
    if (!enabled || !cursorRef.current) return;

    document.documentElement.classList.add("custom-cursor-active");
    gsap.set(cursorRef.current, {
      xPercent: -50,
      yPercent: -50,
      x: lastPointer.x,
      y: lastPointer.y,
      opacity: 0,
    });

    xToRef.current = gsap.quickTo(cursorRef.current, "x", {
      duration: FOLLOW_DURATION,
      ease: "power3.out",
    });
    yToRef.current = gsap.quickTo(cursorRef.current, "y", {
      duration: FOLLOW_DURATION,
      ease: "power3.out",
    });

    const handleMove = (event: MouseEvent) => {
      lastPointer.x = event.clientX;
      lastPointer.y = event.clientY;
      gsap.to(cursorRef.current, {
        opacity: 1,
        duration: 0.15,
        overwrite: "auto",
      });
      xToRef.current?.(event.clientX);
      yToRef.current?.(event.clientY);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.classList.remove("custom-cursor-active");
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
      gsap.set(dot, { scale: 0, opacity: 0 });

      const targetSize = measureCircleSize(label);
      if (!expandedRef.current) {
        gsap.set(cursor, { width: DOT_SIZE, height: DOT_SIZE });
      }

      gsap.to(cursor, {
        width: targetSize,
        height: targetSize,
        duration,
        ease: "power2.out",
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

export function CustomCursorProvider({ children }: { children: ReactNode }) {
  const [label, setLabelState] = useState<string | null>(null);
  const [suppressed, setSuppressed] = useState(false);
  const cursorEnabled = useCustomCursorEnabled();
  const ownerRef = useRef<string | null>(null);

  const setLabel = useCallback((next: string | null, owner: string) => {
    if (next) {
      ownerRef.current = owner;
      setLabelState(next);
      return;
    }

    if (ownerRef.current && ownerRef.current !== owner) {
      return;
    }

    ownerRef.current = null;
    setLabelState(null);
  }, []);

  const value = useMemo<CustomCursorController>(
    () => ({ setLabel, setSuppressed }),
    [setLabel],
  );

  return (
    <CustomCursorContext.Provider value={value}>
      {children}
      <CustomCursorView
        label={label}
        enabled={cursorEnabled && !suppressed}
      />
    </CustomCursorContext.Provider>
  );
}

export function useCustomCursorController(owner: string) {
  const ctx = useContext(CustomCursorContext);

  const setLabel = useCallback(
    (label: string | null) => {
      ctx?.setLabel(label, owner);
    },
    [ctx, owner],
  );

  const setSuppressed = useCallback(
    (suppressed: boolean) => {
      ctx?.setSuppressed(suppressed);
    },
    [ctx],
  );

  return { setLabel, setSuppressed };
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

/** Standalone cursor for pages without CustomCursorProvider. */
export function CustomCursor({
  label,
  enabled,
}: {
  label: string | null;
  enabled: boolean;
}) {
  return <CustomCursorView label={label} enabled={enabled} />;
}
