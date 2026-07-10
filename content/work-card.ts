export type WorkCardMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string; alt?: string }
  | { type: "placeholder"; label: string };

export type WorkCardForegroundLayout =
  | "desktop"
  | "phone"
  | "phone-grid"
  | "full"
  | "tall";

export type WorkCardForeground = {
  layout: WorkCardForegroundLayout;
  media: WorkCardMedia;
  /** phone-grid only — one media item per device; falls back to `media` when omitted */
  phones?: WorkCardMedia[];
};

export type WorkCardParallax = {
  /** Background overscale — travel is `(scale - 1) * wrapper height` */
  scale?: number;
};

export type WorkCardAspect = {
  x: number;
  y: number;
};

export type WorkCardTitleTone = "white" | "dark";

/** Visual layers shared by cards, up-next, grid tiles, and hero hover backgrounds */
export type WorkCardLayers = {
  background: WorkCardMedia;
  foreground?: WorkCardForeground;
  aspect?: WorkCardAspect;
  parallax?: WorkCardParallax;
};

export type WorkCardContent = WorkCardLayers & {
  title: string;
  href?: string;
  titleTone?: WorkCardTitleTone;
};

export const WORK_CARD_LANDSCAPE_ASPECT: WorkCardAspect = { x: 1452, y: 890 };

export const WORK_CARD_PORTRAIT_ASPECT: WorkCardAspect = { x: 573, y: 721 };

export const WORK_CARD_PARALLAX_SCALE = 1.2;

export const DEFAULT_WORK_CARD_PARALLAX: WorkCardParallax = {
  scale: WORK_CARD_PARALLAX_SCALE,
};

export function getWorkCardBackgroundUrl(
  layers: Pick<WorkCardLayers, "background">,
): string | null {
  const { background } = layers;

  if (background.type === "image") {
    return background.src;
  }

  if (background.type === "video") {
    return background.poster ?? null;
  }

  return null;
}

export function workCardPlaceholder(
  label: string,
  overrides?: Partial<WorkCardContent>,
): WorkCardContent {
  return {
    title: label,
    background: { type: "placeholder", label },
    ...overrides,
  };
}
