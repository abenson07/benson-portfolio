import type { CaseStudyMediaBlock } from "@/content/work-page-template";

/** Landscape → duo portraits → landscape → … matching exported frame sizes. */
function mediaFromSequence(
  slug: string,
  count: number,
  labels: string[],
): CaseStudyMediaBlock[] {
  const blocks: CaseStudyMediaBlock[] = [];
  let i = 0;

  while (i < count) {
    const n = i + 1;
    const label = labels[i] ?? `${slug} ${n}`;
    const src = `/case-studies/${slug}-${n}.png`;

    if (i === 0 || (i > 0 && i % 3 === 0)) {
      blocks.push({
        type: "single",
        preview: { label, aspect: "landscape", imageUrl: src },
      });
      i += 1;
      continue;
    }

    const next = i + 1;
    if (next >= count) {
      blocks.push({
        type: "single",
        preview: { label, aspect: "portrait", imageUrl: src },
      });
      break;
    }

    blocks.push({
      type: "duo",
      previews: [
        { label, aspect: "portrait", imageUrl: src },
        {
          label: labels[next] ?? `${slug} ${next + 1}`,
          aspect: "portrait",
          imageUrl: `/case-studies/${slug}-${next + 1}.png`,
        },
      ],
    });
    i += 2;
  }

  return blocks;
}

export const caseStudyMediaBySlug: Record<string, CaseStudyMediaBlock[]> = {
  "flight-pro": mediaFromSequence("flight-pro", 10, [
    "Glass cockpit overview",
    "ADS-B awareness",
    "Instrument detail",
    "Full panel layout",
    "Visor HUD",
    "Map layers",
    "Landing assistance",
    "Co-pilot mirror",
    "Camera access",
    "Simulator integration",
  ]),
  "eclipse-rx": mediaFromSequence("eclipse", 6, [
    "Eclipse RX device",
    "Wearable detail",
    "App interface",
    "Exposure guidance",
    "Device lockup",
    "Close-up",
  ]),
  nutrilyze: mediaFromSequence("nutrilyze", 6, [
    "Nutrilyze overview",
    "Plate tracking",
    "Nutrition detail",
    "App screens",
    "Meal logging",
    "Insights",
  ]),
  "journey-map": mediaFromSequence("journey", 6, [
    "Journey map overview",
    "Research notes",
    "Persona detail",
    "Full journey",
    "Touchpoint detail",
    "Prototype",
  ]),
};
