"use client";

import type { ExperiencesContent } from "@/content/experiences";

import { ExperiencesBody } from "./experiences-body";
import { ExperiencesHeader } from "./experiences-header";

type ExperiencesPageProps = {
  content: ExperiencesContent;
};

export function ExperiencesPage({ content }: ExperiencesPageProps) {
  return (
    <>
      <div className="experiences-header-block">
        <ExperiencesHeader hero={content.hero} />
      </div>
      <div className="experiences-list-block">
        <ExperiencesBody sections={content.sections} />
      </div>
    </>
  );
}
