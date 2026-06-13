"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";

import type { CaseStudy } from "@/content/case-studies";

type WorkRowProps = {
  project: CaseStudy;
  rowRef?: (node: HTMLElement | null) => void;
  onHover?: (project: CaseStudy) => void;
};

export function WorkRow({ project, rowRef, onHover }: WorkRowProps) {
  const maskRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const enterFromBottomRef = useRef(true);

  const collapseClip = (fromBottom: boolean) =>
    fromBottom ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)";

  const reveal = (fromBottom: boolean) => {
    if (!maskRef.current) return;

    enterFromBottomRef.current = fromBottom;
    timelineRef.current?.kill();

    timelineRef.current = gsap.timeline();
    timelineRef.current.fromTo(
      maskRef.current,
      { clipPath: collapseClip(fromBottom) },
      {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.4,
        ease: "power2.out",
      },
    );
  };

  const hide = () => {
    if (!maskRef.current) return;

    timelineRef.current?.kill();
    timelineRef.current = gsap.timeline();
    timelineRef.current.to(maskRef.current, {
      clipPath: collapseClip(enterFromBottomRef.current),
      duration: 0.3,
      ease: "power2.in",
    });
  };

  const handleEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const fromBottom = event.clientY - rect.top > rect.height / 2;
    reveal(fromBottom);
    onHover?.(project);
  };

  return (
    <Link
      href={`/work/${project.slug}`}
      className="work-row"
      ref={rowRef}
      onMouseEnter={handleEnter}
      onMouseLeave={hide}
      onFocus={() => {
        reveal(true);
        onHover?.(project);
      }}
      onBlur={hide}
    >
      <span className="work-row__title work-row__title--dim">{project.title}</span>
      <span className="work-row__accent-mask" ref={maskRef} aria-hidden>
        <span className="work-row__accent-inner">
          <span className="work-row__title work-row__title--accent">
            {project.title}
          </span>
          <span className="work-row__meta">{project.categoryLabel}</span>
        </span>
      </span>
    </Link>
  );
}
