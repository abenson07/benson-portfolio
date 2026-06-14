"use client";

import { useCallback, useRef } from "react";

import type { ExperienceRow, ExperienceSection } from "@/content/experiences";

import {
  ExperiencesHoverCard,
  type ExperiencesHoverCardHandle,
} from "./experiences-hover-card";
import { ExperiencesSection } from "./experiences-section";

type ExperiencesBodyProps = {
  sections: ExperienceSection[];
};

export function ExperiencesBody({ sections }: ExperiencesBodyProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<ExperiencesHoverCardHandle>(null);

  const handleRowEnter = useCallback(
    (row: ExperienceRow, clientX: number, clientY: number) => {
      if (!row.hasHoverCard || !row.hoverCard) return;
      cardRef.current?.show(row.hoverCard, clientX, clientY);
    },
    [],
  );

  const handleRowMove = useCallback((clientX: number, clientY: number) => {
    cardRef.current?.move(clientX, clientY);
  }, []);

  const handleRowLeave = useCallback(() => {
    cardRef.current?.hide();
  }, []);

  return (
    <div className="experiences-body">
      <div className="experiences-body__timeline-line" aria-hidden />
      <div className="experiences-body__grid">
        {sections.map((section) => (
          <ExperiencesSection
            key={section.id}
            section={section}
            onRowEnter={handleRowEnter}
            onRowMove={handleRowMove}
            onRowLeave={handleRowLeave}
          />
        ))}
      </div>
      <div ref={columnRef} className="experiences-body__card-host">
        <ExperiencesHoverCard ref={cardRef} columnRef={columnRef} />
      </div>
    </div>
  );
}
