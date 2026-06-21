import Image from "next/image";

import {
  CASE_STUDY_ASPECT_RATIOS,
  type CaseStudyPreview as CaseStudyPreviewContent,
} from "@/content/work-page-template";

import { CaseStudyPlaceholder } from "./case-study-placeholder";

type CaseStudyPreviewProps = CaseStudyPreviewContent;

export function CaseStudyPreview({
  label,
  aspect = "landscape",
  imageUrl,
}: CaseStudyPreviewProps) {
  if (!imageUrl) {
    return <CaseStudyPlaceholder label={label} aspect={aspect} />;
  }

  return (
    <div
      className="case-study-preview"
      style={{ aspectRatio: CASE_STUDY_ASPECT_RATIOS[aspect] }}
    >
      <Image
        src={imageUrl}
        alt={label}
        fill
        className="case-study-preview__image"
        sizes="(max-width: 960px) 100vw, 72rem"
      />
    </div>
  );
}
