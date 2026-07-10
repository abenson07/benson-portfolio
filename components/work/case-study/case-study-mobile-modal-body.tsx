import type { WorkPageContent } from "@/content/work-page-template";

import { CaseStudyMedia } from "./case-study-media";
import {
  CaseStudySidebarBody,
  CaseStudySidebarIntro,
} from "./case-study-sidebar";
import { splitCaseStudyMedia } from "./split-case-study-media";

type CaseStudyMobileModalBodyProps = {
  content: WorkPageContent;
};

export function CaseStudyMobileModalBody({
  content,
}: CaseStudyMobileModalBodyProps) {
  const { firstBlock, restBlocks } = splitCaseStudyMedia(content.media);

  return (
    <div className="case-study-mobile-modal">
      <aside className="case-study-sidebar case-study-mobile-modal__intro">
        <CaseStudySidebarIntro
          title={content.title}
          websiteUrl={content.websiteUrl}
          primaryTag={content.primaryTag}
          lead={content.lead}
        />
      </aside>

      {firstBlock ? (
        <div className="case-study-mobile-modal__hero-media">
          <CaseStudyMedia blocks={[firstBlock]} />
        </div>
      ) : null}

      <aside className="case-study-sidebar case-study-mobile-modal__body">
        <CaseStudySidebarBody
          paragraphs={content.paragraphs}
          services={content.services}
          capabilities={content.capabilities}
          collaboration={content.collaboration}
        />
      </aside>

      {restBlocks.length > 0 ? (
        <div className="case-study-mobile-modal__rest-media">
          <CaseStudyMedia blocks={restBlocks} />
        </div>
      ) : null}
    </div>
  );
}
