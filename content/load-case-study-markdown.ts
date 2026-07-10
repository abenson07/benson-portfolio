import "server-only";

import fs from "node:fs";
import path from "node:path";

import {
  parseCaseStudyMarkdown,
  type ParsedCaseStudyMarkdown,
} from "@/content/parse-case-study-markdown";

const CASE_STUDIES_DIR = path.join(process.cwd(), "case-studies");

const SLUG_TO_MARKDOWN_FILE: Record<string, string> = {
  mwo: "midwestern-originals.md",
};

function markdownFileForSlug(slug: string): string {
  return SLUG_TO_MARKDOWN_FILE[slug] ?? `${slug}.md`;
}

export function loadCaseStudyMarkdown(slug: string): ParsedCaseStudyMarkdown | null {
  const filePath = path.join(CASE_STUDIES_DIR, markdownFileForSlug(slug));

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const markdown = fs.readFileSync(filePath, "utf8");
  return parseCaseStudyMarkdown(markdown);
}
