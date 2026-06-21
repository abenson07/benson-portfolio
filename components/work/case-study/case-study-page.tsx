import type { WorkPageContent } from "@/content/work-page-template";

import { SignatureHeader } from "@/components/home/signature-header";

import { CaseStudyMedia } from "./case-study-media";
import { CaseStudyScrollMotion } from "./case-study-scroll-motion";
import { CaseStudySidebar } from "./case-study-sidebar";
import { CaseStudyUpNextSection } from "./case-study-up-next";

type CaseStudyPageProps = {
  content: WorkPageContent;
  variant?: "page" | "modal";
};

export function CaseStudyPage({
  content,
  variant = "page",
}: CaseStudyPageProps) {
  const isModal = variant === "modal";

  return (
    <div
      className={`case-study-page${isModal ? " case-study-page--modal" : ""}`}
    >
      {isModal ? null : (
        <header className="case-study-header">
          <SignatureHeader showStatus={false} />
        </header>
      )}

      <CaseStudyScrollMotion>
        <div className="case-study-scroll">
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

          <CaseStudyUpNextSection upNext={content.upNext} />
        </div>
      </CaseStudyScrollMotion>
    </div>
  );
}
