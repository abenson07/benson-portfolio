export type WorkUpNextPreference = {
  primary: string;
  secondary?: string;
};

/**
 * Per-project Up Next targets — primary shown first; secondary when primary was already visited.
 * Leave empty to cycle `readyCaseStudySlugOrder` (only studies with real content).
 */
export const workUpNextPreferences: Partial<Record<string, WorkUpNextPreference>> = {
  // Prefer ready slugs only while other case studies are still placeholders:
  // "eclipse-rx": { primary: "flight-pro", secondary: "nutrilyze" },
};
