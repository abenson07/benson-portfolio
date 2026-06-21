import type { CaseStudyMediaBlock } from "@/content/work-page-template";

import { CaseStudyPreview } from "./case-study-preview";

type CaseStudyMediaProps = {
  blocks: CaseStudyMediaBlock[];
};

export function CaseStudyMedia({ blocks }: CaseStudyMediaProps) {
  return (
    <div className="case-study-media">
      {blocks.map((block, index) => {
        if (block.type === "quote") {
          return (
            <figure
              key={`quote-${index}`}
              className="case-study-quote"
            >
              <blockquote className="case-study-quote__text">
                {`“${block.quote}”`}
              </blockquote>
              <figcaption className="case-study-quote__attribution">
                <span aria-hidden className="case-study-quote__dot">
                  ●
                </span>
                {block.attribution}
              </figcaption>
            </figure>
          );
        }

        if (block.type === "single") {
          return (
            <div key={`single-${index}`} className="case-study-media__frame">
              <CaseStudyPreview {...block.preview} />
            </div>
          );
        }

        return (
          <div key={`duo-${index}`} className="case-study-media__duo">
            {block.previews.map((preview, previewIndex) => (
              <div
                key={`duo-${index}-${previewIndex}`}
                className="case-study-media__frame"
              >
                <CaseStudyPreview {...preview} />
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
