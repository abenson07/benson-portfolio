"use client";

import { useCallback, useRef } from "react";

import { homeGalleryItems } from "@/content/homepage-gallery";
import { useWorkGalleryParallax } from "@/lib/motion/use-work-gallery-parallax";
import { useWorkGalleryReveal } from "@/lib/motion/use-work-gallery-reveal";

import {
  useCustomCursorController,
  useCustomCursorEnabled,
} from "./custom-cursor";
import { WorkGalleryCard } from "./work-gallery-card";

import "@/app/home/work-gallery.css";

const COMING_SOON_LABEL = "coming soon";
const VIEW_LABEL = "view";

export function WorkGallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cursorEnabled = useCustomCursorEnabled();
  const { setLabel: setCursorLabel } = useCustomCursorController("gallery");

  useWorkGalleryReveal({ sectionRef });
  useWorkGalleryParallax({ sectionRef });

  const handleHover = useCallback(
    (active: boolean, href?: string) => {
      if (!active) {
        setCursorLabel(null);
        return;
      }

      setCursorLabel(href ? VIEW_LABEL : COMING_SOON_LABEL, { scale: 0.5 });
    },
    [setCursorLabel],
  );

  return (
    <section
      ref={sectionRef}
      className={`work-gallery${cursorEnabled ? " work-gallery--custom-cursor" : ""}`}
      data-figma-node="3051:38202"
    >
      <div className="work-gallery__grid" data-figma-node="3051:38214">
        {homeGalleryItems.map((item) => (
          <WorkGalleryCard
            key={item.slug}
            item={item}
            onHover={handleHover}
          />
        ))}
      </div>
    </section>
  );
}
