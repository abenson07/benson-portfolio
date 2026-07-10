"use client";

import { useEffect, useState } from "react";

import type { WorkCardContent } from "@/content/work-card";
import type { CaseStudyUpNext } from "@/content/work-page-template";
import {
  buildUpNextCardForSlug,
  readyCaseStudySlugOrder,
} from "@/content/work-pages";
import { pickUpNextCard } from "@/lib/resolve-up-next";
import {
  getVisitedWorkSlugs,
  markWorkVisited,
} from "@/lib/work-visit-history";

import { WorkCard } from "@/components/work/work-card";

type CaseStudyUpNextSectionProps = {
  upNext: CaseStudyUpNext;
  currentSlug?: string;
};

export function CaseStudyUpNextSection({
  upNext,
  currentSlug,
}: CaseStudyUpNextSectionProps) {
  const [card, setCard] = useState<WorkCardContent>(upNext.card);

  useEffect(() => {
    setCard(upNext.card);
  }, [upNext]);

  useEffect(() => {
    if (!currentSlug) {
      return;
    }

    const visited = getVisitedWorkSlugs();
    const resolved = pickUpNextCard(
      upNext,
      visited,
      currentSlug,
      readyCaseStudySlugOrder,
      buildUpNextCardForSlug,
    );

    setCard(resolved);
    markWorkVisited(currentSlug);
  }, [currentSlug, upNext]);

  return (
    <section className="case-study-up-next">
      <h2 className="case-study-up-next__eyebrow">{upNext.eyebrow}</h2>
      <WorkCard
        key={card.href ?? card.title}
        {...card}
        className="case-study-up-next__card"
      />
    </section>
  );
}
