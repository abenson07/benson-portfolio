export type WorkUpNextPreference = {
  primary: string;
  secondary?: string;
};

/** Per-project Up Next targets — primary shown first; secondary when primary was already visited. */
export const workUpNextPreferences: Partial<Record<string, WorkUpNextPreference>> = {
  // "eclipse-rx": { primary: "mwo", secondary: "contextual-messaging" },
  // "mwo": { primary: "eclipse-rx", secondary: "secure-blueprint" },
};
