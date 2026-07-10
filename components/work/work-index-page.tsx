"use client";

import { VaultSection } from "@/components/home/vault-section";
import { WorkGallerySection } from "@/components/home/work-gallery-section";

import { WorkIndexIntro } from "./work-index-intro";
import { WorkIndexShell } from "./work-index-shell";

export function WorkIndexPage() {
  return (
    <WorkIndexShell>
      <div className="work-index">
        <WorkIndexIntro />
        <div className="work-gallery-vault">
          <WorkGallerySection />
          <VaultSection
            id="vault"
            support="You thought that was all?"
            heading="THE VAULT"
            cta="Enter if you dare..."
            showArrow={false}
            figmaNode="3041:52265"
            supportFigmaNode="3041:52267"
            headingFigmaNode="3041:52266"
            ctaFigmaNode="3041:52269"
          />
        </div>
      </div>
    </WorkIndexShell>
  );
}
