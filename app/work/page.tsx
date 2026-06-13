import { WorkExperience } from "@/components/work/work-experience";
import { caseStudies } from "@/content/case-studies";

export default function WorkPage() {
  return <WorkExperience projects={caseStudies} />;
}
