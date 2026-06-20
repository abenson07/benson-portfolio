"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type BackgroundCrossfadeProps = {
  imageUrl: string;
  fadeDuration?: number;
  scrimOpacity?: number;
  className?: string;
  layerClassName?: string;
  scaleClassName?: string;
  imageClassName?: string;
  scrimClassName?: string;
};

const INCOMING_SCALE_START = 1.05;
const OUTGOING_SCALE_END = 1.03;

export function BackgroundCrossfade({
  imageUrl,
  fadeDuration = 0.8,
  scrimOpacity = 0.42,
  className = "background-crossfade",
  layerClassName = "background-crossfade__layer",
  scaleClassName = "background-crossfade__scale",
  imageClassName = "background-crossfade__image",
  scrimClassName = "background-crossfade__scrim",
}: BackgroundCrossfadeProps) {
  const layerARef = useRef<HTMLDivElement>(null);
  const layerBRef = useRef<HTMLDivElement>(null);
  const scaleARef = useRef<HTMLDivElement>(null);
  const scaleBRef = useRef<HTMLDivElement>(null);
  const imgARef = useRef<HTMLImageElement>(null);
  const imgBRef = useRef<HTMLImageElement>(null);
  const activeSlotRef = useRef<"a" | "b">("a");
  const currentUrlRef = useRef<string | null>(null);
  const pendingUrlRef = useRef<string | null>(null);
  const isTransitioningRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!layerARef.current || !scaleARef.current || !imgARef.current || !imageUrl) {
      return;
    }

    const runCrossfade = (nextUrl: string) => {
      if (!layerBRef.current || !scaleBRef.current || !imgBRef.current) return;
      if (currentUrlRef.current === nextUrl) return;

      if (isTransitioningRef.current) {
        pendingUrlRef.current = nextUrl;
        return;
      }

      const incomingSlot = activeSlotRef.current === "a" ? "b" : "a";
      const outgoingSlot = activeSlotRef.current;
      const incomingLayer =
        incomingSlot === "a" ? layerARef.current : layerBRef.current;
      const outgoingLayer =
        outgoingSlot === "a" ? layerARef.current : layerBRef.current;
      const incomingScale =
        incomingSlot === "a" ? scaleARef.current : scaleBRef.current;
      const outgoingScale =
        outgoingSlot === "a" ? scaleARef.current : scaleBRef.current;
      const incomingImg =
        incomingSlot === "a" ? imgARef.current : imgBRef.current;
      if (!incomingImg) return;

      timelineRef.current?.kill();

      const startTransition = () => {
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        const finish = () => {
          isTransitioningRef.current = false;
          activeSlotRef.current = incomingSlot;
          currentUrlRef.current = nextUrl;

          const pending = pendingUrlRef.current;
          pendingUrlRef.current = null;

          if (pending && pending !== currentUrlRef.current) {
            runCrossfade(pending);
          }
        };

        if (reducedMotion) {
          gsap.set(outgoingLayer, { opacity: 0, zIndex: 0 });
          gsap.set(outgoingScale, { scale: 1 });
          gsap.set(incomingLayer, { opacity: 1, zIndex: 1 });
          gsap.set(incomingScale, { scale: 1 });
          finish();
          return;
        }

        isTransitioningRef.current = true;

        gsap.set(outgoingLayer, { opacity: 1, zIndex: 1 });
        gsap.set(outgoingScale, { scale: 1 });
        gsap.set(incomingLayer, { opacity: 0, zIndex: 2 });
        gsap.set(incomingScale, { scale: INCOMING_SCALE_START });

        timelineRef.current = gsap.timeline({ onComplete: finish });

        timelineRef.current.to(
          incomingLayer,
          { opacity: 1, duration: fadeDuration, ease: "power2.inOut" },
          0,
        );
        timelineRef.current.to(
          outgoingLayer,
          { opacity: 0, duration: fadeDuration, ease: "power2.inOut" },
          0,
        );
        timelineRef.current.to(
          incomingScale,
          { scale: 1, duration: fadeDuration, ease: "power2.out" },
          0,
        );
        timelineRef.current.to(
          outgoingScale,
          { scale: OUTGOING_SCALE_END, duration: fadeDuration, ease: "power2.out" },
          0,
        );
      };

      const runWhenReady = () => {
        incomingImg.onload = null;
        incomingImg.onerror = null;
        startTransition();
      };

      incomingImg.onload = runWhenReady;
      incomingImg.onerror = runWhenReady;
      incomingImg.src = nextUrl;

      if (incomingImg.complete && incomingImg.naturalWidth > 0) {
        runWhenReady();
      }
    };

    if (currentUrlRef.current === null) {
      imgARef.current.src = imageUrl;
      gsap.set(layerARef.current, { opacity: 1, zIndex: 1 });
      gsap.set(scaleARef.current, { scale: 1 });
      gsap.set(layerBRef.current, { opacity: 0, zIndex: 0 });
      gsap.set(scaleBRef.current, { scale: INCOMING_SCALE_START });
      currentUrlRef.current = imageUrl;
      return;
    }

    runCrossfade(imageUrl);
  }, [fadeDuration, imageUrl]);

  const scrimStyle = { background: `rgba(0, 0, 0, ${scrimOpacity})` };

  return (
    <div className={className} aria-hidden>
      <div ref={layerARef} className={layerClassName}>
        <div ref={scaleARef} className={scaleClassName}>
          {/* eslint-disable-next-line @next/next/no-img-element -- GSAP crossfade requires raw img control */}
          <img
            ref={imgARef}
            alt=""
            className={imageClassName}
            draggable={false}
          />
        </div>
        <div className={scrimClassName} style={scrimStyle} />
      </div>
      <div ref={layerBRef} className={layerClassName}>
        <div ref={scaleBRef} className={scaleClassName}>
          {/* eslint-disable-next-line @next/next/no-img-element -- GSAP crossfade requires raw img control */}
          <img
            ref={imgBRef}
            alt=""
            className={imageClassName}
            draggable={false}
          />
        </div>
        <div className={scrimClassName} style={scrimStyle} />
      </div>
    </div>
  );
}
