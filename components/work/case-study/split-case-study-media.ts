import type { CaseStudyMediaBlock } from "@/content/work-page-template";

export type SplitCaseStudyMedia = {
  firstBlock: CaseStudyMediaBlock | null;
  restBlocks: CaseStudyMediaBlock[];
};

function isImageBlock(
  block: CaseStudyMediaBlock,
): block is Extract<CaseStudyMediaBlock, { type: "single" | "duo" }> {
  return block.type === "single" || block.type === "duo";
}

export function splitCaseStudyMedia(
  blocks: CaseStudyMediaBlock[],
): SplitCaseStudyMedia {
  const firstImageIndex = blocks.findIndex(isImageBlock);

  if (firstImageIndex === -1) {
    return { firstBlock: null, restBlocks: blocks };
  }

  return {
    firstBlock: blocks[firstImageIndex],
    restBlocks: [
      ...blocks.slice(0, firstImageIndex),
      ...blocks.slice(firstImageIndex + 1),
    ],
  };
}
