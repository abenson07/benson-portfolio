import type { ExperienceSection as ExperienceSectionType } from "@/content/experiences";

import { ExperiencesRow } from "./experiences-row";

type ExperiencesSectionProps = {
  section: ExperienceSectionType;
  onRowEnter?: (
    row: ExperienceSectionType["rows"][number],
    clientX: number,
    clientY: number,
  ) => void;
  onRowMove?: (clientX: number, clientY: number) => void;
  onRowLeave?: () => void;
};

export function ExperiencesSection({
  section,
  onRowEnter,
  onRowMove,
  onRowLeave,
}: ExperiencesSectionProps) {
  return (
    <section
      className="experiences-section"
      aria-labelledby={`section-${section.id}`}
    >
      <div className="experiences-section__timeline-cell">
        <span className="experiences-section__year">{section.year}</span>
      </div>
      <div className="experiences-section__gutter">
        <span
          id={`section-${section.id}`}
          className="experiences-section__label"
        >
          {section.label}
        </span>
      </div>
      <div className="experiences-section__rows">
        {section.rows.map((row) => (
          <ExperiencesRow
            key={row.id}
            row={row}
            onRowEnter={onRowEnter}
            onRowMove={onRowMove}
            onRowLeave={onRowLeave}
          />
        ))}
      </div>
    </section>
  );
}
