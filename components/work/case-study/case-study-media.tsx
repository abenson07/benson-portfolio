import type { CaseStudyMediaBlock } from "@/content/work-page-template";

import { CaseStudyPlaceholder } from "./case-study-placeholder";

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
              <CaseStudyPlaceholder
                label={block.label}
                aspect={block.aspect ?? "landscape"}
              />
            </div>
          );
        }

        return (
          <div key={`duo-${index}`} className="case-study-media__duo">
            <div className="case-study-media__frame">
              <CaseStudyPlaceholder
                label={`${block.label} A`}
                aspect={block.aspect ?? "portrait"}
              />
            </div>
            <div className="case-study-media__frame">
              <CaseStudyPlaceholder
                label={`${block.label} B`}
                aspect={block.aspect ?? "portrait"}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
