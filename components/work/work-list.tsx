import type { CaseStudy } from "@/content/case-studies";

import { WorkRow } from "./work-row";

type WorkListProps = {
  projects: CaseStudy[];
  getRowRef?: (index: number) => (node: HTMLElement | null) => void;
  onRowHover?: (project: CaseStudy, clientY: number) => void;
};

export function WorkList({ projects, getRowRef, onRowHover }: WorkListProps) {
  return (
    <div className="work-list">
      {projects.map((project, index) => (
        <WorkRow
          key={project.slug}
          project={project}
          rowRef={getRowRef?.(index)}
          onHover={onRowHover}
        />
      ))}
    </div>
  );
}
