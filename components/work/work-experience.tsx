"use client";

import { TopNav } from "@/components/home/top-nav";
import type { CaseStudy } from "@/content/case-studies";

import { WorkStage } from "./work-stage";

type WorkExperienceProps = {
  projects: CaseStudy[];
};

export function WorkExperience({ projects }: WorkExperienceProps) {
  return (
    <div className="work-experience">
      <TopNav variant="work" />
      <WorkStage projects={projects} />
    </div>
  );
}
