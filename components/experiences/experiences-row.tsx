"use client";

import { useRef } from "react";

import type { ExperienceRow } from "@/content/experiences";
import { isWorkHrefReady } from "@/content/is-case-study-ready";

type ExperiencesRowProps = {
  row: ExperienceRow;
  onRowEnter?: (row: ExperienceRow, clientX: number, clientY: number) => void;
  onRowMove?: (clientX: number, clientY: number) => void;
  onRowLeave?: () => void;
};

export function ExperiencesRow({
  row,
  onRowEnter,
  onRowMove,
  onRowLeave,
}: ExperiencesRowProps) {
  const rowRef = useRef<HTMLElement>(null);

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!row.hasHoverCard) return;
    onRowMove?.(event.clientX, event.clientY);
  };

  const handlePointerEnter = (event: React.PointerEvent) => {
    if (!row.hasHoverCard) return;
    onRowEnter?.(row, event.clientX, event.clientY);
  };

  const handlePointerLeave = () => {
    if (!row.hasHoverCard) return;
    onRowLeave?.();
  };

  const content = (
    <>
      <span className="experiences-row__title">{row.title}</span>
      <p className="experiences-row__description">{row.description}</p>
      <p className="experiences-row__tags">{row.tags.join(", ")}</p>
    </>
  );

  const className = `experiences-row${row.hasHoverCard ? " experiences-row--hoverable" : ""}`;
  const ready = isWorkHrefReady(row.href);

  if (row.href && ready) {
    return (
      <a
        ref={rowRef as React.RefObject<HTMLAnchorElement>}
        href={row.href}
        className={className}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {content}
      </a>
    );
  }

  if (row.href && !ready) {
    return (
      <button
        type="button"
        ref={rowRef as React.RefObject<HTMLButtonElement>}
        className={className}
        aria-label={`${row.title} — coming soon`}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        {content}
      </button>
    );
  }

  return (
    <article
      ref={rowRef}
      className={className}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {content}
    </article>
  );
}
