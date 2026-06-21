import { CASE_STUDY_ASPECT_RATIOS, type CaseStudyAspect } from "@/content/work-page-template";

type CaseStudyPlaceholderProps = {
  label: string;
  aspect?: CaseStudyAspect;
};

export function CaseStudyPlaceholder({
  label,
  aspect = "landscape",
}: CaseStudyPlaceholderProps) {
  return (
    <div
      className="case-study-placeholder"
      style={{ aspectRatio: CASE_STUDY_ASPECT_RATIOS[aspect] }}
    >
      <span className="case-study-placeholder__label">{label}</span>
    </div>
  );
}
