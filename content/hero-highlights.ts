export type HighlightCard = {
  eyebrow: string;
  title: string;
  imageUrl?: string;
};

export type HeroHighlight = {
  id: string;
  label: string;
  card: HighlightCard;
};

function card(label: string, overrides?: Partial<HighlightCard>): HighlightCard {
  return {
    eyebrow: label,
    title: label,
    ...overrides,
  };
}

export const heroHighlights: HeroHighlight[] = [
  { id: "healthcare", label: "Healthcare", card: card("Healthcare") },
  {
    id: "midwestern-originals",
    label: "Midwestern Originals",
    card: card("Midwestern Originals"),
  },
  { id: "cybersecurity", label: "Cybersecurity", card: card("Cybersecurity") },
  { id: "code-koalas", label: "Code Koalas", card: card("Code Koalas") },
  { id: "fintech", label: "Fintech", card: card("Fintech") },
  { id: "micronutrition", label: "Micronutrition", card: card("Micronutrition") },
  { id: "big-tech", label: "Big Tech", card: card("Big Tech") },
  { id: "transit", label: "Transit", card: card("Transit") },
  { id: "webflow", label: "Webflow", card: card("Webflow") },
  {
    id: "adtech",
    label: "Adtech",
    card: {
      eyebrow: "ECLIPSE RX",
      title: "Uncovering UV Safe Exposure",
    },
  },
  { id: "skincare", label: "Skincare", card: card("Skincare") },
  { id: "crema", label: "Crema", card: card("Crema") },
  { id: "analytics", label: "Analytics", card: card("Analytics") },
  {
    id: "nuclear-plumbing",
    label: "Nuclear Plumbing",
    card: card("Nuclear Plumbing"),
  },
  { id: "agency", label: "Agency", card: card("Agency") },
  { id: "smbs", label: "SMBs", card: card("SMBs") },
  { id: "aviation", label: "Aviation", card: card("Aviation") },
  { id: "dave", label: "Dave", card: card("Dave") },
  { id: "streaming", label: "Streaming", card: card("Streaming") },
  { id: "meta", label: "Meta", card: card("Meta") },
];
