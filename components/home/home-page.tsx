import { heroHighlights } from "@/content/hero-highlights";

import { HeadlineScrollSection } from "./headline-scroll-section";
import { HeroStage } from "./hero-stage";
import { HomePageShell } from "./home-page-shell";
import { RevealFooter } from "./reveal-footer";
import { TearTransition } from "./tear-transition";
import { TestimonialStackSection } from "./testimonial-stack-section";
import { VaultSection } from "./vault-section";
import { WorkGallerySection } from "./work-gallery-section";

export function HomePage() {
  return (
    <HomePageShell>
      <section className="home-hero-section" data-figma-node="3051:41159">
        <div className="home-hero-section__masked">
          <HeroStage highlights={heroHighlights} />
        </div>
        <TearTransition variant="hero" />
      </section>
      <HeadlineScrollSection />
      <div className="home-gallery-vault">
        <WorkGallerySection />
        <VaultSection />
      </div>
      <TestimonialStackSection />
      <RevealFooter />
    </HomePageShell>
  );
}
