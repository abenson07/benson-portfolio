const STORAGE_KEY = "benson-portfolio-visited-work";

function readVisitedSlugs(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
}

function writeVisitedSlugs(slugs: string[]): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
}

export function getVisitedWorkSlugs(): string[] {
  return readVisitedSlugs();
}

export function hasVisitedWork(slug: string): boolean {
  return readVisitedSlugs().includes(slug);
}

export function markWorkVisited(slug: string): void {
  const visited = readVisitedSlugs();
  if (visited.includes(slug)) {
    return;
  }

  writeVisitedSlugs([...visited, slug]);
}
