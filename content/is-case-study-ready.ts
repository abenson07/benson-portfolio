import { readyCaseStudySlugOrder } from "@/content/work-pages";
import { slugFromWorkHref } from "@/lib/resolve-up-next";

const readySlugSet = new Set<string>(readyCaseStudySlugOrder);

export function isCaseStudyReady(slug: string): boolean {
  return readySlugSet.has(slug);
}

/** True when href is a live case study, or a non-/work route. */
export function isWorkHrefReady(href: string | undefined): boolean {
  if (!href) {
    return false;
  }

  const slug = slugFromWorkHref(href);
  if (!slug) {
    return true;
  }

  return isCaseStudyReady(slug);
}
