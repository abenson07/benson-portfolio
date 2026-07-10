"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { prefersReducedMotion } from "@/lib/motion/lenis-gsap";

const CROSSFADE_DURATION = 0.4;

type UseTestimonialScrollArgs = {
  sectionRef: RefObject<HTMLElement | null>;
  textRefs: RefObject<(HTMLElement | null)[]>;
  imageRefs: RefObject<(HTMLElement | null)[]>;
  stageCount: number;
};

export function useTestimonialScroll({
  sectionRef,
  textRefs,
  imageRefs,
  stageCount,
}: UseTestimonialScrollArgs) {
  const stageRef = useRef(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const texts = textRefs.current ?? [];
    const images = imageRefs.current ?? [];

    if (!section || texts.length === 0 || images.length === 0) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion()) {
      texts.forEach((el, index) => {
        if (el) {
          gsap.set(el, { opacity: index === 0 ? 1 : 0 });
        }
      });
      images.forEach((el, index) => {
        if (el) {
          gsap.set(el, {
            opacity: index === 0 ? 1 : 0,
            scale: 1,
          });
        }
      });
      return;
    }

    const crossfadeTo = (stage: number) => {
      const previous = stageRef.current;
      if (previous === stage) {
        return;
      }

      const outgoingText = texts[previous];
      const incomingText = texts[stage];

      if (outgoingText) {
        gsap.to(outgoingText, {
          opacity: 0,
          duration: CROSSFADE_DURATION,
          ease: "power2.inOut",
        });
      }

      if (incomingText) {
        gsap.to(incomingText, {
          opacity: 1,
          duration: CROSSFADE_DURATION,
          ease: "power2.inOut",
        });
      }

      if (stage > previous) {
        for (let i = previous + 1; i <= stage; i += 1) {
          const image = images[i];
          if (image) {
            gsap.fromTo(
              image,
              { opacity: 0, scale: 0.95 },
              {
                opacity: 1,
                scale: 1,
                duration: CROSSFADE_DURATION,
                ease: "power2.inOut",
              },
            );
          }
        }
      } else {
        for (let i = previous; i > stage; i -= 1) {
          const image = images[i];
          if (image) {
            gsap.to(image, {
              opacity: 0,
              scale: 0.95,
              duration: CROSSFADE_DURATION,
              ease: "power2.inOut",
            });
          }
        }
      }

      stageRef.current = stage;
    };

    const scroller =
      section.closest(".page-wrapper--scrolling-home") ?? undefined;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      scroller,
      onUpdate: (self) => {
        const stage = Math.min(
          stageCount - 1,
          Math.floor(self.progress * stageCount),
        );
        crossfadeTo(stage);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [sectionRef, textRefs, imageRefs, stageCount]);
}
