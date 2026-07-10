export type CaseStudyCollaboration = {
  name: string;
  description: string;
};

export type ParsedCaseStudyMarkdown = {
  lead: string;
  paragraphs: string[];
  capabilities: string[];
  collaboration: CaseStudyCollaboration[];
};

const CASE_STUDY_HEADING = "case study";
const CAPABILITIES_HEADING = "capabilities";
const COLLABORATION_HEADING = "collaboration";

function extractSections(markdown: string): Map<string, string> {
  const sections = new Map<string, string>();
  const parts = markdown.split(/^## /m);

  for (const part of parts.slice(1)) {
    const newlineIndex = part.indexOf("\n");
    if (newlineIndex === -1) {
      continue;
    }

    const heading = part.slice(0, newlineIndex).trim().toLowerCase();
    const body = part
      .slice(newlineIndex + 1)
      .replace(/^---\s*$/gm, "")
      .trim();

    sections.set(heading, body);
  }

  return sections;
}

function splitParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

function parseCapabilities(body: string): string[] {
  return body
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseCollaboration(body: string): CaseStudyCollaboration[] {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => {
      const richMatch = line.match(/^- \*\*(.+?)\*\*\s*[—–-]\s*(.+)$/);
      if (richMatch) {
        return {
          name: richMatch[1].trim(),
          description: richMatch[2].trim(),
        };
      }

      const plainMatch = line.match(/^- (.+)$/);
      if (!plainMatch) {
        return null;
      }

      return {
        name: plainMatch[1].trim(),
        description: "",
      };
    })
    .filter((item): item is CaseStudyCollaboration => item !== null);
}

export function parseCaseStudyMarkdown(markdown: string): ParsedCaseStudyMarkdown | null {
  const sections = extractSections(markdown);
  const caseStudyBody = sections.get(CASE_STUDY_HEADING);

  if (!caseStudyBody) {
    return null;
  }

  const caseStudyParagraphs = splitParagraphs(caseStudyBody);
  if (caseStudyParagraphs.length === 0) {
    return null;
  }

  const [lead, ...paragraphs] = caseStudyParagraphs;
  const capabilitiesBody = sections.get(CAPABILITIES_HEADING) ?? "";
  const collaborationBody = sections.get(COLLABORATION_HEADING) ?? "";

  return {
    lead,
    paragraphs,
    capabilities: parseCapabilities(capabilitiesBody),
    collaboration: parseCollaboration(collaborationBody),
  };
}
