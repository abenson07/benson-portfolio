import type { WorkCardContent } from "@/content/work-card";

export type CaseStudyService = {
  icon: "*" | "o" | "^" | "x";
  iconClass: "star" | "circle" | "chevron" | "cross";
  label: string;
};

export type CaseStudyCollaboration = {
  name: string;
  description: string;
};

export type CaseStudyAspect = "landscape" | "portrait";

export const CASE_STUDY_ASPECT_RATIOS: Record<CaseStudyAspect, string> = {
  landscape: "16 / 10",
  portrait: "3 / 4",
};

/** Frame content for case study previews — placeholder until `imageUrl` is set. */
export type CaseStudyPreview = {
  /** Center placeholder copy, or alt text when an image is shown. */
  label: string;
  aspect?: CaseStudyAspect;
  imageUrl?: string;
};

export type CaseStudyMediaBlock =
  | { type: "single"; preview: CaseStudyPreview }
  | { type: "duo"; previews: [CaseStudyPreview, CaseStudyPreview] }
  | { type: "quote"; quote: string; attribution: string };

export type CaseStudyUpNext = {
  eyebrow: string;
  card: WorkCardContent;
  secondaryCard?: WorkCardContent;
};

export type WorkPageContent = {
  title: string;
  websiteUrl: string;
  primaryTag: string;
  coverImageUrl: string;
  lead: string;
  paragraphs: string[];
  services: CaseStudyService[];
  capabilities: string[];
  collaboration: CaseStudyCollaboration[];
  media: CaseStudyMediaBlock[];
  upNext: CaseStudyUpNext;
};

export const workPageTemplate: WorkPageContent = {
  title: "Exposing Surveillance",
  websiteUrl: "#",
  primaryTag: "Data Visualisation",
  coverImageUrl: "/work/01.png",
  lead:
    "Surveillance Watch is an investigative journalism platform that examines the surveillance-industrial complex via a meticulously researched database of companies and services.",
  paragraphs: [
    "Our goal was to help them build a searchable database of information and transform their findings into a platform that could be used by journalists, activists, and the public.",
    "We designed a platform that enables journalists to interrogate relationships between surveillance companies, investors, and government agencies, surfacing connections that would otherwise remain hidden.",
    "The visual language draws on cartographic and data-visualisation conventions to communicate scale and complexity without overwhelming users.",
    "An interactive globe anchors the experience, inviting exploration while maintaining clarity about what each data point represents.",
    "Every interface decision was tested with real users from investigative journalism backgrounds to ensure the tool supports their workflow.",
    "Since launch, the platform has been used by journalists worldwide to investigate surveillance companies and their connections.",
  ],
  services: [
    { icon: "*", iconClass: "star", label: "Data Visualisation" },
    { icon: "o", iconClass: "circle", label: "UX & UI Design" },
    { icon: "^", iconClass: "chevron", label: "Interaction Design" },
    { icon: "x", iconClass: "cross", label: "Headless CMS" },
  ],
  capabilities: [],
  collaboration: [],
  media: [
    { type: "single", preview: { label: "Hero image", aspect: "landscape" } },
    {
      type: "duo",
      previews: [
        { label: "Detail A", aspect: "portrait" },
        { label: "Detail B", aspect: "portrait" },
      ],
    },
    {
      type: "single",
      preview: { label: "Feature screenshot", aspect: "landscape" },
    },
    {
      type: "duo",
      previews: [
        { label: "Social embed A", aspect: "portrait" },
        { label: "Social embed B", aspect: "portrait" },
      ],
    },
    {
      type: "quote",
      quote:
        "We came to Humaan with an idea and a massive datasheet. They supported us through every step of the creative process, helping us understand the reasoning behind each decision, and we couldn't be happier with the result.",
      attribution: "Surveillance Watch Team",
    },
    {
      type: "duo",
      previews: [
        { label: "Mobile views A", aspect: "portrait" },
        { label: "Mobile views B", aspect: "portrait" },
      ],
    },
    {
      type: "single",
      preview: { label: "Closing screenshot", aspect: "landscape" },
    },
  ],
  upNext: {
    eyebrow: "Up Next",
    card: {
      title: "Ferox",
      href: "#",
      background: { type: "placeholder", label: "Next project image" },
    },
  },
};

/** Sidebar-heavy variant: text column taller than the media column. */
export const workPageTemplateLongCopy: WorkPageContent = {
  ...workPageTemplate,
  paragraphs: [
    ...workPageTemplate.paragraphs,
    "The research phase began with a sprawling spreadsheet of companies, subsidiaries, and procurement records gathered over years of investigative work. Our first task was to understand how journalists actually searched this material — what questions they asked, what dead ends they hit, and where the existing tools failed them.",
    "We mapped those workflows in detail before touching visual design. That meant long sessions with the editorial team, shadowing how they cross-referenced entries, and identifying the moments where context was lost between the database and the stories they published.",
    "PayloadCMS gave the team a flexible editorial backend without sacrificing the structured data model the journalism depended on. Content editors could attach narrative context to raw entries while developers maintained strict schemas for search and filtering.",
    "The headless architecture also made it possible to ship iterative releases — new entity types, relationship graphs, and map layers — without rebuilding the front end each time. That mattered because the dataset grew weekly as new investigations landed.",
    "On the visual side, we treated the globe not as decoration but as an index. Every arc and cluster needed to answer a question: where is this company active, who connects to whom, and what scale of surveillance are we looking at?",
    "Colour, motion, and density were calibrated against real reading sessions. Too much glow and the map felt like a game; too little and the global scope disappeared. We landed on a restrained palette that kept attention on the underlying data.",
    "Accessibility was non-negotiable for a public-interest tool. Keyboard paths, screen-reader labels, and high-contrast modes were tested alongside the more cinematic views so the platform could serve classrooms and newsrooms alike.",
    "Launch was only the beginning. Usage analytics and journalist feedback shaped a roadmap of filters, export tools, and embeddable views that extended the reach of the original research far beyond the core site.",
  ],
  media: [
    { type: "single", preview: { label: "Hero image", aspect: "landscape" } },
    {
      type: "duo",
      previews: [
        { label: "Detail A", aspect: "portrait" },
        { label: "Detail B", aspect: "portrait" },
      ],
    },
  ],
};
