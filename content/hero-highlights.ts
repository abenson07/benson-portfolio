export type HeroHighlight = {
  id: string;
  label: string;
  backgroundImageUrl?: string;
};

export const heroHighlights: HeroHighlight[] = [
  { id: "healthcare", label: "Healthcare" },
  { id: "midwestern-originals", label: "Midwestern Originals" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "code-koalas", label: "Code Koalas" },
  { id: "fintech", label: "Fintech" },
  { id: "micronutrition", label: "Micronutrition", backgroundImageUrl: "/work/nutrilyze-cover.png" },
  { id: "big-tech", label: "Big Tech" },
  { id: "transit", label: "Transit" },
  { id: "webflow", label: "Webflow" },
  { id: "adtech", label: "Adtech", backgroundImageUrl: "/work/eclipse-rx.png" },
  { id: "skincare", label: "Skincare" },
  { id: "crema", label: "Crema" },
  { id: "analytics", label: "Analytics" },
  { id: "nuclear-plumbing", label: "Nuclear Plumbing" },
  { id: "agency", label: "Agency" },
  { id: "smbs", label: "SMBs" },
  { id: "aviation", label: "Aviation" },
  { id: "dave", label: "Dave" },
  { id: "streaming", label: "Streaming" },
  { id: "meta", label: "Meta" },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Distinct gradient placeholder per highlight so backgrounds visibly differ. */
export function getHighlightPlaceholderBg(id: string): string {
  const hash = hashString(id);
  const hue = hash % 360;
  const hue2 = (hue + 48 + (hash % 36)) % 360;
  const hue3 = (hue + 130 + (hash % 48)) % 360;
  const c1 = `hsl(${hue}, 52%, 46%)`;
  const c2 = `hsl(${hue2}, 44%, 30%)`;
  const c3 = `hsl(${hue3}, 48%, 58%)`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="45%" stop-color="${c2}"/>
        <stop offset="100%" stop-color="${c3}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
  </svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function getHighlightBackgroundUrl(highlight: HeroHighlight): string {
  return highlight.backgroundImageUrl ?? getHighlightPlaceholderBg(highlight.id);
}
