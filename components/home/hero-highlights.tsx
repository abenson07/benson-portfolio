"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

import type { HeroHighlight } from "@/content/hero-highlights";

type HeroHighlightsProps = {
  highlights: HeroHighlight[];
};

const VIEWPORT_PADDING = 16;
const CARD_GAP = 8;
const CARD_CLIP_CLOSED = "inset(50% 50% 50% 50% round 4px)";
const CARD_CLIP_OPEN = "inset(0% 0% 0% 0% round 4px)";
const REVEAL_DURATION = 0.45;
const HIDE_DURATION = 0.3;

function clampCardToViewport(
  buttonRect: DOMRect,
  cardWidth: number,
  cardHeight: number,
): { left: number; top: number } {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const maxLeft = viewportWidth - cardWidth - VIEWPORT_PADDING;
  const maxTop = viewportHeight - cardHeight - VIEWPORT_PADDING;

  let left =
    buttonRect.left + buttonRect.width / 2 - cardWidth / 2;
  let top =
    buttonRect.top + buttonRect.height / 2 - cardHeight / 2;

  left = Math.max(VIEWPORT_PADDING, Math.min(left, maxLeft));

  if (top + cardHeight > viewportHeight - VIEWPORT_PADDING) {
    const aboveTop = buttonRect.top - cardHeight - CARD_GAP;
    top =
      aboveTop >= VIEWPORT_PADDING ? aboveTop : Math.min(top, maxTop);
  }

  if (top < VIEWPORT_PADDING) {
    const belowTop = buttonRect.bottom + CARD_GAP;
    top =
      belowTop + cardHeight <= viewportHeight - VIEWPORT_PADDING
        ? belowTop
        : VIEWPORT_PADDING;
  }

  top = Math.max(VIEWPORT_PADDING, Math.min(top, maxTop));

  return { left, top };
}

export function HeroHighlights({ highlights }: HeroHighlightsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const pendingHideRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotionRef = useRef(false);

  const activeHighlight = highlights.find((item) => item.id === activeId);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const positionCard = useCallback((button: HTMLButtonElement) => {
    const container = containerRef.current;
    const card = cardRef.current;
    if (!container || !card) return;

    gsap.set(card, { display: "flex", visibility: "hidden" });

    const buttonRect = button.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;

    const { left: viewportLeft, top: viewportTop } = clampCardToViewport(
      buttonRect,
      cardWidth,
      cardHeight,
    );

    gsap.set(card, {
      left: viewportLeft - containerRect.left,
      top: viewportTop - containerRect.top,
      x: 0,
      y: 0,
    });
  }, []);

  const hideCard = useCallback(() => {
    if (isAnimatingRef.current) {
      pendingHideRef.current = true;
      return;
    }

    const card = cardRef.current;
    if (!card || !isVisibleRef.current) {
      pendingHideRef.current = false;
      return;
    }

    isAnimatingRef.current = true;
    timelineRef.current?.kill();

    const duration = reducedMotionRef.current ? 0 : HIDE_DURATION;

    timelineRef.current = gsap.timeline({
      onComplete: () => {
        gsap.set(card, {
          display: "none",
          visibility: "visible",
          clipPath: CARD_CLIP_CLOSED,
        });
        isVisibleRef.current = false;
        setActiveId(null);
        isAnimatingRef.current = false;
      },
    });

    timelineRef.current.to(card, {
      clipPath: CARD_CLIP_CLOSED,
      duration,
      ease: duration === 0 ? "none" : "power2.in",
    });
  }, []);

  const finishAnimation = useCallback(() => {
    isAnimatingRef.current = false;

    if (pendingHideRef.current) {
      pendingHideRef.current = false;
      hideCard();
    }
  }, [hideCard]);

  const handleEnter = useCallback(
    (id: string, button: HTMLButtonElement) => {
      if (isAnimatingRef.current) return;
      if (activeId === id && isVisibleRef.current) return;

      const card = cardRef.current;
      if (!card) return;

      isAnimatingRef.current = true;
      setActiveId(id);

      const collapseDuration = reducedMotionRef.current ? 0 : HIDE_DURATION;
      const revealDuration = reducedMotionRef.current ? 0 : REVEAL_DURATION;
      const isSwitch = isVisibleRef.current;

      timelineRef.current?.kill();
      timelineRef.current = gsap.timeline({
        onComplete: finishAnimation,
      });

      if (isSwitch) {
        timelineRef.current
          .to(card, {
            clipPath: CARD_CLIP_CLOSED,
            duration: collapseDuration,
            ease: collapseDuration === 0 ? "none" : "power2.in",
          })
          .call(() => {
            gsap.set(card, { clipPath: CARD_CLIP_CLOSED });
            positionCard(button);
          })
          .set(card, {
            display: "flex",
            visibility: "visible",
            clipPath: CARD_CLIP_CLOSED,
          })
          .to(card, {
            clipPath: CARD_CLIP_OPEN,
            duration: revealDuration,
            ease: revealDuration === 0 ? "none" : "power3.out",
          });
        return;
      }

      isVisibleRef.current = true;
      positionCard(button);

      timelineRef.current
        .set(card, {
          display: "flex",
          visibility: "visible",
          clipPath: CARD_CLIP_CLOSED,
        })
        .to(card, {
          clipPath: CARD_CLIP_OPEN,
          duration: revealDuration,
          ease: revealDuration === 0 ? "none" : "power3.out",
        });
    },
    [activeId, finishAnimation, positionCard],
  );

  const cardBackground = activeHighlight?.card.imageUrl
    ? `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${activeHighlight.card.imageUrl})`
    : "linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(135deg, #c4a574 0%, #e8d4a8 45%, #d45d6e 100%)";

  return (
    <div
      ref={containerRef}
      className={`hero-highlights${activeId ? " hero-highlights--active" : ""}`}
      onMouseLeave={hideCard}
    >
      <p className="hero-highlights__flow">
        {highlights.map((item, index) => (
          <span
            key={item.id}
            className={`hero-highlights__item${
              item.id === activeId ? " hero-highlights__item--active" : ""
            }`}
          >
            {index > 0 ? (
              <span className="hero-highlights__bullet" aria-hidden>
                {" "}
                •{" "}
              </span>
            ) : null}
            <button
              type="button"
              className="hero-highlights__label"
              onMouseEnter={(event) => handleEnter(item.id, event.currentTarget)}
              onFocus={(event) => handleEnter(item.id, event.currentTarget)}
            >
              {item.label}
            </button>
          </span>
        ))}
      </p>

      <div
        ref={cardRef}
        className="hero-highlights__card"
        style={{
          display: "none",
          backgroundImage: cardBackground,
          clipPath: CARD_CLIP_CLOSED,
        }}
        aria-hidden={!activeHighlight}
      >
        {activeHighlight ? (
          <>
            <p className="hero-highlights__card-eyebrow">
              {activeHighlight.card.eyebrow}
            </p>
            <div className="hero-highlights__card-bottom">
              <p className="hero-highlights__card-title">
                {activeHighlight.card.title}
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
