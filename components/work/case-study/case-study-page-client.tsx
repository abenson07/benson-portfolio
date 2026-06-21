"use client";

import type { WorkPageContent } from "@/content/work-page-template";

import { CaseStudyHeader } from "./case-study-header";
import { CaseStudyMedia } from "./case-study-media";
import { CaseStudyMobileModalBody } from "./case-study-mobile-modal-body";
import { CaseStudyScrollMotion } from "./case-study-scroll-motion";
import { CaseStudySidebar } from "./case-study-sidebar";
import { CaseStudyUpNextSection } from "./case-study-up-next";
import { useCaseStudyMobileModal } from "./use-case-study-mobile-modal";

type CaseStudyPageClientProps = {
  content: WorkPageContent;
  variant?: "page" | "modal";
};

export function CaseStudyPageClient({
  content,
  variant = "page",
}: CaseStudyPageClientProps) {
  const isModal = variant === "modal";
  const isMobileModal = useCaseStudyMobileModal(isModal);

  return (
    <div
      className={`case-study-page${isModal ? " case-study-page--modal" : ""}${
        isMobileModal ? " case-study-page--modal-mobile" : ""
      }`}
    >
      {isModal ? null : <CaseStudyHeader />}

      <CaseStudyScrollMotion>
        <div className="case-study-scroll">
          {isMobileModal ? (
            <CaseStudyMobileModalBody content={content} />
          ) : (
            <div className="case-study-columns">
              <CaseStudySidebar
                title={content.title}
                websiteUrl={content.websiteUrl}
                primaryTag={content.primaryTag}
                lead={content.lead}
                paragraphs={content.paragraphs}
                services={content.services}
                awards={content.awards}
              />
              <CaseStudyMedia blocks={content.media} />
            </div>
          )}

          <CaseStudyUpNextSection upNext={content.upNext} />
        </div>
      </CaseStudyScrollMotion>
    </div>
  );
}
