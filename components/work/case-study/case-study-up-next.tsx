import type { CaseStudyUpNext } from "@/content/work-page-template";

import { WorkCard } from "@/components/work/work-card";

type CaseStudyUpNextSectionProps = {
  upNext: CaseStudyUpNext;
};

export function CaseStudyUpNextSection({ upNext }: CaseStudyUpNextSectionProps) {
  return (
    <section className="case-study-up-next">
      <h2 className="case-study-up-next__eyebrow">{upNext.eyebrow}</h2>
      <WorkCard {...upNext.card} className="case-study-up-next__card" />
    </section>
  );
}
