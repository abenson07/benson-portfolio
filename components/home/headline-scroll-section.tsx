"use client";

import { useRef } from "react";

import { useHeadlineScroll } from "@/lib/motion/use-headline-scroll";

import "@/app/home/headline-scroll.css";

export function HeadlineScrollSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineARef = useRef<HTMLHeadingElement>(null);
  const headlineBRef = useRef<HTMLHeadingElement>(null);
  const scribbleRef = useRef<HTMLSpanElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useHeadlineScroll({
    sectionRef,
    headlineARef,
    headlineBRef,
    scribbleRef,
  });

  return (
    <section
      ref={sectionRef}
      className="headline-scroll"
      data-figma-node="3051:38084"
    >
      <div className="headline-scroll__sticky">
        <div className="headline-scroll__stage">
          <div className="headline-scroll__wrapper" ref={wrapperRef}>
            <h2
              className="headline-scroll__headline headline-scroll__headline--a"
              ref={headlineARef}
              data-figma-node="3051:38110"
            >
              <span className="headline-scroll__line">
                15 years working at the
              </span>{" "}
              <span className="headline-scroll__line">intersection of</span>
            </h2>
            <h2
              className="headline-scroll__headline headline-scroll__headline--b"
              ref={headlineBRef}
              data-figma-node="3051:38163"
            >
              <span className="headline-scroll__line">Design, strategy,</span>{" "}
              <span className="headline-scroll__line">research, and code</span>
            </h2>
            <span
              className="headline-scroll__scribble"
              ref={scribbleRef}
              data-figma-node="3051:38198"
            >
              Since 2012
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
