"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type WorkBackgroundProps = {
  imageUrl: string;
};

export function WorkBackground({ imageUrl }: WorkBackgroundProps) {
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const scaleARef = useRef<HTMLDivElement>(null);
  const scaleBRef = useRef<HTMLDivElement>(null);
  const imgARef = useRef<HTMLImageElement>(null);
  const imgBRef = useRef<HTMLImageElement>(null);
  const activeSlotRef = useRef<"a" | "b">("a");
  const currentUrlRef = useRef<string | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!layerARef.current || !scaleARef.current || !imgARef.current || !imageUrl) {
      return;
    }

    if (currentUrlRef.current === null) {
      imgARef.current.src = imageUrl;
      gsap.set(layerARef.current, { opacity: 1 });
      gsap.set(scaleARef.current, { scale: 1 });
      if (layerBRef.current) gsap.set(layerBRef.current, { opacity: 0 });
      if (scaleBRef.current) gsap.set(scaleBRef.current, { scale: 1.08 });
      currentUrlRef.current = imageUrl;
      return;
    }

    if (currentUrlRef.current === imageUrl) return;

    const incomingSlot = activeSlotRef.current === "a" ? "b" : "a";
    const outgoingSlot = activeSlotRef.current;
    const incomingLayer =
      incomingSlot === "a" ? layerARef.current : layerBRef.current!;
    const outgoingLayer =
      outgoingSlot === "a" ? layerARef.current! : layerBRef.current!;
    const incomingScale =
      incomingSlot === "a" ? scaleARef.current! : scaleBRef.current!;
    const outgoingScale =
      outgoingSlot === "a" ? scaleARef.current! : scaleBRef.current!;
    const incomingImg =
      incomingSlot === "a" ? imgARef.current! : imgBRef.current!;

    timelineRef.current?.kill();

    incomingImg.src = imageUrl;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.set(outgoingLayer, { opacity: 0 });
    gsap.set(incomingLayer, { opacity: 1 });
    gsap.set(incomingScale, { scale: reducedMotion ? 1 : 1.08 });
    gsap.set(outgoingScale, { scale: 1.08 });

    if (!reducedMotion) {
      timelineRef.current = gsap.timeline();
      timelineRef.current.to(incomingScale, {
        scale: 1,
        duration: 1.1,
        ease: "power2.in",
      });
    }

    activeSlotRef.current = incomingSlot;
    currentUrlRef.current = imageUrl;
  }, [imageUrl]);

  return (
    <div className="work-background" aria-hidden>
      <div ref={layerARef} className="work-background__layer">
        <div ref={scaleARef} className="work-background__scale">
          {/* eslint-disable-next-line @next/next/no-img-element -- GSAP crossfade requires raw img control */}
          <img
            ref={imgARef}
            alt=""
            className="work-background__image"
            draggable={false}
          />
        </div>
        <div className="work-background__scrim" />
      </div>
      <div ref={layerBRef} className="work-background__layer">
        <div ref={scaleBRef} className="work-background__scale">
          {/* eslint-disable-next-line @next/next/no-img-element -- GSAP crossfade requires raw img control */}
          <img
            ref={imgBRef}
            alt=""
            className="work-background__image"
            draggable={false}
          />
        </div>
        <div className="work-background__scrim" />
      </div>
    </div>
  );
}
