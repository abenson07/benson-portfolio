"use client";

import Image from "next/image";
import { useRef } from "react";
import type { CSSProperties } from "react";

import { testimonials } from "@/content/testimonials";
import { useTestimonialScroll } from "@/lib/motion/use-testimonial-scroll";
import { useHeroMobileViewport } from "@/lib/motion/use-hero-mobile-viewport";
import { splitEmphasis } from "@/lib/split-emphasis";

import "@/app/home/testimonial.css";

export function TestimonialStackSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLElement | null)[]>([]);
  const imageRefs = useRef<(HTMLElement | null)[]>([]);
  const isMobile = useHeroMobileViewport();

  useTestimonialScroll({
    sectionRef,
    textRefs,
    imageRefs,
    stageCount: testimonials.length,
  });

  return (
    <section
      ref={sectionRef}
      className="testimonial-stack"
      style={{ height: `${testimonials.length * 100}vh` }}
      data-figma-node="3051:41100"
    >
      <div className="testimonial-stack__sticky">
        <div className="testimonial-stack__text">
          {testimonials.map((testimonial, index) => {
            const segments = splitEmphasis(
              testimonial.quote,
              testimonial.emphasis,
            );

            return (
              <div
                key={testimonial.id}
                className="testimonial-stack__text-block"
                ref={(el) => {
                  textRefs.current[index] = el;
                }}
                data-figma-node={testimonial.figmaNode}
              >
                <p className="testimonial-stack__quote">
                  {segments.map((segment, segmentIndex) =>
                    segment.emphasized ? (
                      <span
                        key={segmentIndex}
                        className="testimonial-stack__quote--emphasis"
                      >
                        {segment.text}
                      </span>
                    ) : (
                      <span key={segmentIndex}>{segment.text}</span>
                    ),
                  )}
                </p>
                <div className="testimonial-stack__meta">
                  <p className="testimonial-stack__name">{testimonial.name}</p>
                  <p className="testimonial-stack__title">{testimonial.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="testimonial-stack__images">
          {testimonials.map((testimonial, index) => {
            const slotStyle = {
              "--nudge-x": isMobile ? "0px" : `${testimonial.nudgeX}px`,
              "--nudge-y": isMobile ? "0px" : `${testimonial.nudgeY}px`,
              zIndex: index + 1,
            } as CSSProperties;

            const imageStyle = {
              "--rotation": `${testimonial.rotation}deg`,
              "--offset-x": isMobile ? "0px" : `${testimonial.offsetX}px`,
              "--offset-y": isMobile ? "0px" : `${testimonial.offsetY}px`,
            } as CSSProperties;

            return (
              <div
                key={testimonial.id}
                className="testimonial-stack__image-slot"
                style={slotStyle}
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                data-figma-node={testimonial.figmaNode}
              >
                <div className="testimonial-stack__image" style={imageStyle}>
                  <Image
                    src={testimonial.photoSrc}
                    alt={testimonial.name}
                    width={406}
                    height={406}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
