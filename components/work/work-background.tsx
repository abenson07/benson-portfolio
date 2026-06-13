"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type WorkBackgroundProps = {
  imageUrl: string;
};

export function WorkBackground({ imageUrl }: WorkBackgroundProps) {
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const imgARef = useRef<HTMLImageElement>(null);
  const imgBRef = useRef<HTMLImageElement>(null);
  const activeSlotRef = useRef<"a" | "b">("a");
  const currentUrlRef = useRef<string | null>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!layerARef.current || !imgARef.current || !imageUrl) return;

    if (currentUrlRef.current === null) {
      imgARef.current.src = imageUrl;
      gsap.set(layerARef.current, { opacity: 1 });
      gsap.set(imgARef.current, { scale: 1 });
      if (layerBRef.current) gsap.set(layerBRef.current, { opacity: 0 });
      if (imgBRef.current) gsap.set(imgBRef.current, { scale: 1.12 });
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
    const incomingImg =
      incomingSlot === "a" ? imgARef.current! : imgBRef.current!;
    const outgoingImg =
      outgoingSlot === "a" ? imgARef.current! : imgBRef.current!;

    timelineRef.current?.kill();

    incomingImg.src = imageUrl;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    timelineRef.current = gsap.timeline();
    timelineRef.current
      .set(incomingLayer, { opacity: 0 })
      .set(incomingImg, { scale: reducedMotion ? 1 : 1.12 })
      .to(
        outgoingLayer,
        { opacity: 0, duration: reducedMotion ? 0 : 0.5, ease: "power2.in" },
        0,
      )
      .to(
        incomingLayer,
        { opacity: 1, duration: reducedMotion ? 0 : 0.5, ease: "power2.out" },
        0,
      )
      .to(
        incomingImg,
        {
          scale: 1,
          duration: reducedMotion ? 0 : 1.1,
          ease: "power2.out",
        },
        0,
      )
      .set(outgoingImg, { scale: 1.12 });

    activeSlotRef.current = incomingSlot;
    currentUrlRef.current = imageUrl;
  }, [imageUrl]);

  return (
    <div className="work-background" aria-hidden>
      <div ref={layerARef} className="work-background__layer">
        {/* eslint-disable-next-line @next/next/no-img-element -- GSAP crossfade requires raw img control */}
        <img
          ref={imgARef}
          alt=""
          className="work-background__image"
          draggable={false}
        />
        <div className="work-background__scrim" />
      </div>
      <div ref={layerBRef} className="work-background__layer">
        {/* eslint-disable-next-line @next/next/no-img-element -- GSAP crossfade requires raw img control */}
        <img
          ref={imgBRef}
          alt=""
          className="work-background__image"
          draggable={false}
        />
        <div className="work-background__scrim" />
      </div>
    </div>
  );
}
