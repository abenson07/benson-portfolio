import Image from "next/image";

import {
  CASE_STUDY_ASPECT_RATIOS,
  type CaseStudyDuoSlot,
  type CaseStudyLayeredMedia,
  type CaseStudyMediaBlock,
} from "@/content/work-page-template";

import { CaseStudyPreview } from "./case-study-preview";

type CaseStudyMediaProps = {
  blocks: CaseStudyMediaBlock[];
};

function isLayeredSlot(slot: CaseStudyDuoSlot): slot is CaseStudyLayeredMedia {
  return "type" in slot && slot.type === "layered";
}

function LayeredMedia({
  background,
  foreground,
  foregroundFit = "wide",
  foregroundAspectRatio,
}: CaseStudyLayeredMedia) {
  const aspect = background.aspect ?? "landscape";

  return (
    <div
      className="case-study-media__frame case-study-media__frame--layered"
      style={{ aspectRatio: CASE_STUDY_ASPECT_RATIOS[aspect] }}
    >
      {background.imageUrl ? (
        <Image
          src={background.imageUrl}
          alt=""
          fill
          aria-hidden
          className="case-study-media__background"
          sizes="(max-width: 960px) 100vw, 72rem"
        />
      ) : null}
      {foreground.imageUrl ? (
        <div className="case-study-media__foreground">
          <div
            className={`case-study-media__foreground-box case-study-media__foreground-box--${foregroundFit}`}
            style={{
              aspectRatio:
                foregroundAspectRatio ??
                CASE_STUDY_ASPECT_RATIOS[foreground.aspect ?? "landscape"],
            }}
          >
            <Image
              src={foreground.imageUrl}
              alt={foreground.label}
              fill
              unoptimized={foreground.imageUrl.endsWith(".gif")}
              className="case-study-media__foreground-image"
              sizes="(max-width: 960px) 60vw, 30rem"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

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

        if (block.type === "layered") {
          return <LayeredMedia key={`layered-${index}`} {...block} />;
        }

        return (
          <div key={`duo-${index}`} className="case-study-media__duo">
            {block.previews.map((preview, previewIndex) =>
              isLayeredSlot(preview) ? (
                <LayeredMedia key={`duo-${index}-${previewIndex}`} {...preview} />
              ) : (
                <div
                  key={`duo-${index}-${previewIndex}`}
                  className="case-study-media__frame"
                >
                  <CaseStudyPreview {...preview} />
                </div>
              ),
            )}
          </div>
        );
      })}
    </div>
  );
}
