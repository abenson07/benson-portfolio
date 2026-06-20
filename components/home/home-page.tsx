import { heroHighlights } from "@/content/hero-highlights";

import { HeroStage } from "./hero-stage";

export function HomePage() {
  return (
    <div className="page-wrapper">
      <HeroStage highlights={heroHighlights} />
    </div>
  );
}
