type CaseStudyPlaceholderProps = {
  label: string;
  aspect?: "landscape" | "portrait";
};

const aspectRatios = {
  landscape: "16 / 10",
  portrait: "3 / 4",
} as const;

export function CaseStudyPlaceholder({
  label,
  aspect = "landscape",
}: CaseStudyPlaceholderProps) {
  return (
    <div
      className="case-study-placeholder"
      style={{ aspectRatio: aspectRatios[aspect] }}
    >
      <span className="case-study-placeholder__label">{label}</span>
    </div>
  );
}
