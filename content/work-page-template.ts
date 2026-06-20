export type CaseStudyService = {
  icon: "*" | "o" | "^" | "x";
  iconClass: "star" | "circle" | "chevron" | "cross";
  label: string;
};

export type CaseStudyAward = {
  name: string;
  category: string;
  year: string;
};

export type CaseStudyMediaBlock =
  | { type: "single"; label: string; aspect?: "landscape" | "portrait" }
  | { type: "duo"; label: string; aspect?: "landscape" | "portrait" }
  | { type: "quote"; quote: string; attribution: string };

export type CaseStudyUpNext = {
  eyebrow: string;
  title: string;
  href: string;
  imageLabel: string;
};

export type WorkPageContent = {
  title: string;
  websiteUrl: string;
  primaryTag: string;
  lead: string;
  paragraphs: string[];
  services: CaseStudyService[];
  awards: CaseStudyAward[];
  media: CaseStudyMediaBlock[];
  upNext: CaseStudyUpNext;
};

export const workPageTemplate: WorkPageContent = {
  title: "Exposing Surveillance",
  websiteUrl: "#",
  primaryTag: "Data Visualisation",
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
  awards: [
    {
      name: "Webby Awards",
      category: "Winner — Responsible Information",
      year: "2026",
    },
    {
      name: "Webby Awards",
      category: "Best Use of Data",
      year: "2026",
    },
    {
      name: "Australian Web Awards",
      category: "React.js",
      year: "2025",
    },
    {
      name: "Australian Web Awards",
      category: "Web Platform",
      year: "2024",
    },
    {
      name: "Australian Web Awards",
      category: "Best in Show: Development",
      year: "2024",
    },
    {
      name: "Good Design Awards",
      category: "Digital Design",
      year: "2025",
    },
    {
      name: "Good Design Awards",
      category: "Product Service Design",
      year: "2025",
    },
    {
      name: "Anthem Awards",
      category: "Digital & Innovative Experiences",
      year: "2024",
    },
    {
      name: "Anthem Awards",
      category: "Global Awareness Campaign",
      year: "2024",
    },
  ],
  media: [
    { type: "single", label: "Hero image", aspect: "landscape" },
    { type: "duo", label: "Detail", aspect: "portrait" },
    { type: "single", label: "Feature screenshot", aspect: "landscape" },
    { type: "duo", label: "Social embed", aspect: "portrait" },
    {
      type: "quote",
      quote:
        "We came to Humaan with an idea and a massive datasheet. They supported us through every step of the creative process, helping us understand the reasoning behind each decision, and we couldn't be happier with the result.",
      attribution: "Surveillance Watch Team",
    },
    { type: "duo", label: "Mobile views", aspect: "portrait" },
    { type: "single", label: "Closing screenshot", aspect: "landscape" },
  ],
  upNext: {
    eyebrow: "Up Next",
    title: "Ferox",
    href: "#",
    imageLabel: "Next project image",
  },
};
