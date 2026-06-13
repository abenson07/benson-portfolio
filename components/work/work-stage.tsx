"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
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

type WorkStageProps = {
  projects: CaseStudy[];
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

function computeActiveIndex(
  rows: HTMLElement[],
  translateY: number,
  pointerY: number,
) {
  if (!rows.length) return -1;

  for (let index = 0; index < rows.length; index += 1) {
    const top = rows[index].offsetTop + translateY;
    const bottom = top + rows[index].offsetHeight;

    if (pointerY >= top && pointerY <= bottom) {
      return index;
    }
  }

  let bestIndex = 0;
  let bestDistance = Infinity;

  rows.forEach((row, index) => {
    const center = row.offsetTop + row.offsetHeight / 2 + translateY;
    const distance = Math.abs(center - pointerY);

    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

export function WorkStage({ projects }: WorkStageProps) {
  const [activeCategory, setActiveCategory] =
    useState<WorkFilterCategory>("all");
  const [activeIndex, setActiveIndex] = useState(0);
  const [metaTop, setMetaTop] = useState(0);

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
  const quickToYRef = useRef<gsap.QuickToFunc | null>(null);
  const rafRef = useRef<number | null>(null);

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

  const updateActiveIndex = useCallback(() => {
    const rows = getRows();

    if (!rows.length) {
      setActiveIndex(-1);
      return;
    }

    const nextIndex = computeActiveIndex(
      rows,
      translateYRef.current,
      pointerYRef.current,
    );

    setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    setMetaTop(pointerYRef.current);
  }, [getRows]);

  const measureLayout = useCallback(() => {
    const clip = clipRef.current;
    const rows = getRows();

    if (!clip || !rows.length) {
      boundsRef.current = null;
      return false;
    }

    rowRefs.current.length = filteredProjects.length;

    const firstTop = rows[0].offsetTop;
    const lastBottom =
      rows[rows.length - 1].offsetTop + rows[rows.length - 1].offsetHeight;
    const clipHeight = clip.clientHeight;

    boundsRef.current = {
      minY: -firstTop,
      maxY: clipHeight - lastBottom,
      clipHeight,
    };

    pointerYRef.current = boundsRef.current.clipHeight * progressRef.current;
    applyProgress(progressRef.current);
    updateActiveIndex();
    return true;
  }, [applyProgress, filteredProjects.length, getRows, updateActiveIndex]);

  const handlePointer = useCallback(
    (clientY: number) => {
      const stage = stageRef.current;
      const clip = clipRef.current;
      if (!stage || !clip) return;

      const stageRect = stage.getBoundingClientRect();
      const clipRect = clip.getBoundingClientRect();

      if (stageRect.height <= 0 || clipRect.height <= 0) return;

      const progress = clamp((clientY - stageRect.top) / stageRect.height, 0, 1);
      pointerYRef.current = clamp(
        clientY - clipRect.top,
        0,
        clipRect.height,
      );

      applyProgress(progress);
      updateActiveIndex();
    },
    [applyProgress, updateActiveIndex],
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
    (project: CaseStudy, clientY: number) => {
      const clip = clipRef.current;
      if (!clip) return;

      const clipRect = clip.getBoundingClientRect();
      const index = filteredProjects.findIndex((item) => item.slug === project.slug);

      pointerYRef.current = clamp(clientY - clipRect.top, 0, clipRect.height);
      setMetaTop(pointerYRef.current);

      if (index >= 0) {
        setActiveIndex(index);
      }
    },
    [filteredProjects],
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
          updateActiveIndex();
        });
      },
    });

    return () => {
      quickToYRef.current = null;
    };
  }, [applyListY, updateActiveIndex]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      measureLayout();
    });

    return () => cancelAnimationFrame(frame);
  }, [measureLayout, filteredProjects.length, activeCategory]);

  useEffect(() => {
    const clip = clipRef.current;
    if (!clip) return;

    const observer = new ResizeObserver(() => {
      measureLayout();
    });
    observer.observe(clip);

    return () => observer.disconnect();
  }, [measureLayout]);

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
    <div
      ref={stageRef}
      className="work-stage"
      onMouseMove={(event) => handlePointer(event.clientY)}
      onTouchStart={(event) => {
        if (event.touches[0]) handlePointer(event.touches[0].clientY);
      }}
      onTouchMove={(event) => {
        if (event.touches[0]) handlePointer(event.touches[0].clientY);
      }}
    >
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

      {activeProject ? (
        <p
          className="work-band-meta"
          aria-live="polite"
          style={{ top: `${metaTop}px` }}
        >
          {activeProject.categoryLabel}
        </p>
      ) : null}

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
