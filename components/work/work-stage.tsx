"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import gsap from "gsap";

import type { CaseStudy, WorkFilterCategory } from "@/content/case-studies";

import { WorkBackground } from "./work-background";
import { WorkFilter } from "./work-filter";
import { WorkList } from "./work-list";

type MeasureBounds = {
  minY: number;
  maxY: number;
  clipHeight: number;
};

type InteractiveZone = {
  top: number;
  height: number;
};

type WorkStageProps = {
  projects: CaseStudy[];
  navRef: RefObject<HTMLElement | null>;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

function computeTargetY(bounds: MeasureBounds, progress: number) {
  return lerp(bounds.minY, bounds.maxY, progress);
}

function getRowIndexAtClientY(
  rows: HTMLElement[],
  clientY: number,
  slop = 14,
) {
  for (let index = 0; index < rows.length; index += 1) {
    const rect = rows[index].getBoundingClientRect();

    if (clientY >= rect.top - slop && clientY <= rect.bottom + slop) {
      return index;
    }
  }

  return -1;
}

export function WorkStage({ projects, navRef }: WorkStageProps) {
  const [activeCategory, setActiveCategory] =
    useState<WorkFilterCategory>("all");
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "all") return projects;
    return projects.filter((project) => project.category === activeCategory);
  }, [projects, activeCategory]);

  const stageRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<HTMLDivElement>(null);
  const listTrackRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLElement | null)[]>([]);
  const progressRef = useRef(0.5);
  const translateYRef = useRef(0);
  const pointerYRef = useRef(0);
  const boundsRef = useRef<MeasureBounds | null>(null);
  const interactiveZoneRef = useRef<InteractiveZone | null>(null);
  const quickToYRef = useRef<gsap.QuickToFunc | null>(null);
  const rafRef = useRef<number | null>(null);
  const activeIndexRef = useRef(0);
  const pointerClientYRef = useRef(0);

  const getRows = useCallback(() => {
    return rowRefs.current.filter(Boolean) as HTMLElement[];
  }, []);

  const applyListY = useCallback((y: number) => {
    translateYRef.current = y;
    if (listTrackRef.current) {
      gsap.set(listTrackRef.current, { y });
    }
  }, []);

  const applyProgress = useCallback(
    (progress: number) => {
      const bounds = boundsRef.current;
      if (!bounds) return;

      progressRef.current = progress;
      const targetY = computeTargetY(bounds, progress);

      if (quickToYRef.current) {
        quickToYRef.current(targetY);
      } else {
        applyListY(targetY);
      }
    },
    [applyListY],
  );

  const setActiveIndexSafe = useCallback((index: number) => {
    if (index < 0) return;
    activeIndexRef.current = index;
    setActiveIndex((prev) => (prev === index ? prev : index));
  }, []);

  const resolveActiveIndex = useCallback(
    (clientY: number) => {
      const rows = getRows();
      if (!rows.length) return;

      const rowIndex = getRowIndexAtClientY(rows, clientY);

      if (rowIndex >= 0) {
        setActiveIndexSafe(rowIndex);
      }
    },
    [getRows, setActiveIndexSafe],
  );

  const updateInteractiveZone = useCallback(() => {
    const stage = stageRef.current;
    const nav = navRef.current;

    if (!stage) return;

    const stageRect = stage.getBoundingClientRect();
    const navBottom = nav
      ? nav.getBoundingClientRect().bottom - stageRect.top
      : 0;
    const zoneHeight = Math.max(stageRect.height - navBottom, 0);

    stage.style.setProperty("--work-nav-inset", `${navBottom}px`);
    interactiveZoneRef.current = { top: navBottom, height: zoneHeight };
  }, [navRef]);

  const measureLayout = useCallback(() => {
    const clip = clipRef.current;
    const rows = getRows();

    updateInteractiveZone();

    if (!clip || !rows.length) {
      boundsRef.current = null;
      return false;
    }

    rowRefs.current.length = filteredProjects.length;

    const firstRow = rows[0];
    const lastRow = rows[rows.length - 1];
    const firstTop = firstRow.offsetTop;
    const lastBottom = lastRow.offsetTop + lastRow.offsetHeight;
    const clipHeight = clip.clientHeight;
    const listEl = listTrackRef.current?.firstElementChild as HTMLElement | null;
    const listStyles = listEl ? getComputedStyle(listEl) : null;
    const listPadTop = listStyles ? parseFloat(listStyles.paddingTop) : 0;
    const listPadBottom = listStyles ? parseFloat(listStyles.paddingBottom) : 0;

    const navInset = interactiveZoneRef.current?.top ?? 0;

    boundsRef.current = {
      minY: navInset - listPadTop - firstTop,
      maxY: clipHeight - listPadBottom - lastBottom,
      clipHeight,
    };

    pointerYRef.current = boundsRef.current.clipHeight * progressRef.current;
    applyProgress(progressRef.current);
    return true;
  }, [
    applyProgress,
    filteredProjects.length,
    getRows,
    updateInteractiveZone,
  ]);

  const handlePointer = useCallback(
    (clientY: number) => {
      const stage = stageRef.current;
      const clip = clipRef.current;
      const zone = interactiveZoneRef.current;

      if (!stage || !clip || !zone || zone.height <= 0) return;

      const stageRect = stage.getBoundingClientRect();
      const clipRect = clip.getBoundingClientRect();
      const zoneTopViewport = stageRect.top + zone.top;

      const progress = clamp(
        (clientY - zoneTopViewport) / zone.height,
        0,
        1,
      );

      pointerYRef.current = clamp(
        clientY - clipRect.top,
        0,
        clipRect.height,
      );
      pointerClientYRef.current = clientY;

      applyProgress(progress);
      resolveActiveIndex(clientY);
    },
    [applyProgress, resolveActiveIndex],
  );

  const handleRowRef = useCallback(
    (index: number) => (node: HTMLElement | null) => {
      rowRefs.current[index] = node;

      if (node && index === filteredProjects.length - 1) {
        requestAnimationFrame(() => {
          measureLayout();
        });
      }
    },
    [filteredProjects.length, measureLayout],
  );

  const handleRowHover = useCallback(
    (project: CaseStudy) => {
      const index = filteredProjects.findIndex((item) => item.slug === project.slug);

      if (index >= 0) {
        setActiveIndexSafe(index);
      }
    },
    [filteredProjects, setActiveIndexSafe],
  );

  useEffect(() => {
    progressRef.current = 0.5;
  }, [activeCategory]);

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const proxy = { y: 0 };

    quickToYRef.current = gsap.quickTo(proxy, "y", {
      duration: reducedMotion ? 0 : 0.45,
      ease: "power2.out",
      onUpdate: () => {
        applyListY(proxy.y);

        if (rafRef.current !== null) return;
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null;
          resolveActiveIndex(pointerClientYRef.current);
        });
      },
    });

    return () => {
      quickToYRef.current = null;
    };
  }, [applyListY, resolveActiveIndex]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      measureLayout();
    });

    return () => cancelAnimationFrame(frame);
  }, [measureLayout, filteredProjects.length, activeCategory]);

  useEffect(() => {
    const clip = clipRef.current;
    const nav = navRef.current;

    const observer = new ResizeObserver(() => {
      measureLayout();
    });

    if (clip) observer.observe(clip);
    if (nav) observer.observe(nav);

    return () => observer.disconnect();
  }, [measureLayout, navRef]);

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      handlePointer(event.clientY);
    };

    const onTouch = (event: TouchEvent) => {
      if (event.touches[0]) {
        handlePointer(event.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [handlePointer]);

  useEffect(() => {
    if (filteredProjects.length === 0) return;

    const preload = [0, Math.floor(filteredProjects.length / 2)].map(
      (index) => filteredProjects[index]?.imageUrl,
    );

    preload.forEach((url) => {
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [filteredProjects]);

  const activeProject =
    activeIndex >= 0 ? filteredProjects[activeIndex] : filteredProjects[0];

  return (
    <div ref={stageRef} className="work-stage">
      <WorkBackground
        imageUrl={activeProject?.imageUrl ?? filteredProjects[0]?.imageUrl ?? ""}
      />

      <WorkFilter
        activeCategory={activeCategory}
        onChange={(category) => {
          setActiveCategory(category);
          progressRef.current = 0.5;
        }}
      />

      {filteredProjects.length === 0 ? (
        <p className="work-empty">No projects in this category.</p>
      ) : (
        <div ref={clipRef} className="work-list-clip">
          <div ref={listTrackRef} className="work-list-track">
            <WorkList
              projects={filteredProjects}
              getRowRef={handleRowRef}
              onRowHover={handleRowHover}
            />
          </div>
        </div>
      )}
    </div>
  );
}
