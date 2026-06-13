"use client";

import { useRef } from "react";

import { TopNav } from "@/components/home/top-nav";
import type { CaseStudy } from "@/content/case-studies";

import { WorkStage } from "./work-stage";

type WorkExperienceProps = {
  projects: CaseStudy[];
};

export function WorkExperience({ projects }: WorkExperienceProps) {
  const navRef = useRef<HTMLElement>(null);

  return (
    <div className="work-experience">
      <WorkStage projects={projects} navRef={navRef} />
      <TopNav ref={navRef} variant="work" />
    </div>
  );
}
