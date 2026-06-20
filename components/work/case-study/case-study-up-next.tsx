import Link from "next/link";

import type { CaseStudyUpNext } from "@/content/work-page-template";

import { CaseStudyPlaceholder } from "./case-study-placeholder";

type CaseStudyUpNextSectionProps = {
  upNext: CaseStudyUpNext;
};

export function CaseStudyUpNextSection({ upNext }: CaseStudyUpNextSectionProps) {
  return (
    <section className="case-study-up-next">
      <h2 className="case-study-up-next__eyebrow">{upNext.eyebrow}</h2>
      <Link href={upNext.href} className="case-study-up-next__card">
        <div className="case-study-up-next__frame">
          <CaseStudyPlaceholder label={upNext.imageLabel} aspect="landscape" />
        </div>
        <span className="case-study-up-next__title">{upNext.title}</span>
      </Link>
    </section>
  );
}
