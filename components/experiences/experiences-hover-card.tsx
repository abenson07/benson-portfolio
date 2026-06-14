"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  forwardRef,
} from "react";
import gsap from "gsap";

import type { ExperienceHoverCard } from "@/content/experiences";

const COLUMN_PADDING = 16;
const CARD_CLIP_CLOSED = "inset(50% 50% 50% 50% round 4px)";
const CARD_CLIP_OPEN = "inset(0% 0% 0% 0% round 4px)";
const REVEAL_DURATION = 0.45;
const HIDE_DURATION = 0.3;
const FOLLOW_DURATION = 0.35;

export type ExperiencesHoverCardHandle = {
  show: (card: ExperienceHoverCard, clientX: number, clientY: number) => void;
  move: (clientX: number, clientY: number) => void;
  hide: () => void;
};

type ExperiencesHoverCardProps = {
  columnRef: React.RefObject<HTMLElement | null>;
};

function clampCardToColumn(
  clientX: number,
  clientY: number,
  columnRect: DOMRect,
  cardWidth: number,
  cardHeight: number,
): { left: number; top: number } {
  const minLeft = COLUMN_PADDING;
  const maxLeft = columnRect.width - cardWidth - COLUMN_PADDING;
  const minTop = COLUMN_PADDING;
  const maxTop = columnRect.height - cardHeight - COLUMN_PADDING;

  const viewportLeft = clientX - columnRect.left;
  const viewportTop = clientY - columnRect.top;

  let left = viewportLeft - cardWidth / 2;
  let top = viewportTop - cardHeight / 2;

  left = Math.max(minLeft, Math.min(left, maxLeft));
  top = Math.max(minTop, Math.min(top, maxTop));

  return { left, top };
}

export const ExperiencesHoverCard = forwardRef<
  ExperiencesHoverCardHandle,
  ExperiencesHoverCardProps
>(function ExperiencesHoverCard({ columnRef }, ref) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardContentRef = useRef<ExperienceHoverCard | null>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const titleRef = useRef<HTMLParagraphElement>(null);
  const isVisibleRef = useRef(false);
  const isAnimatingRef = useRef(false);
  const pendingHideRef = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const reducedMotionRef = useRef(false);
  const proxyRef = useRef({ left: 0, top: 0 });
  const quickToLeftRef = useRef<gsap.QuickToFunc | null>(null);
  const quickToTopRef = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const duration = reducedMotionRef.current ? 0 : FOLLOW_DURATION;
    quickToLeftRef.current = gsap.quickTo(proxyRef.current, "left", {
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (cardRef.current) {
          gsap.set(cardRef.current, {
            left: proxyRef.current.left,
            top: proxyRef.current.top,
          });
        }
      },
    });
    quickToTopRef.current = gsap.quickTo(proxyRef.current, "top", {
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (cardRef.current) {
          gsap.set(cardRef.current, {
            left: proxyRef.current.left,
            top: proxyRef.current.top,
          });
        }
      },
    });

    return () => {
      timelineRef.current?.kill();
      quickToLeftRef.current = null;
      quickToTopRef.current = null;
    };
  }, []);

  const applyCardContent = useCallback((card: ExperienceHoverCard) => {
    cardContentRef.current = card;
    if (eyebrowRef.current) eyebrowRef.current.textContent = card.eyebrow;
    if (titleRef.current) titleRef.current.textContent = card.title;
    if (cardRef.current) {
      const background = card.imageUrl
        ? `linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${card.imageUrl})`
        : "linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), linear-gradient(135deg, #c4a574 0%, #e8d4a8 45%, #d45d6e 100%)";
      cardRef.current.style.backgroundImage = background;
    }
  }, []);

  const positionAt = useCallback(
    (clientX: number, clientY: number, instant = false) => {
      const column = columnRef.current;
      const card = cardRef.current;
      if (!column || !card) return;

      const columnRect = column.getBoundingClientRect();
      const cardWidth = card.offsetWidth;
      const cardHeight = card.offsetHeight;
      const { left, top } = clampCardToColumn(
        clientX,
        clientY,
        columnRect,
        cardWidth,
        cardHeight,
      );

      if (instant || reducedMotionRef.current) {
        proxyRef.current.left = left;
        proxyRef.current.top = top;
        gsap.set(card, { left, top });
        return;
      }

      quickToLeftRef.current?.(left);
      quickToTopRef.current?.(top);
    },
    [columnRef],
  );

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
        cardContentRef.current = null;
        isAnimatingRef.current = false;

        if (pendingHideRef.current) {
          pendingHideRef.current = false;
        }
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

  const showCard = useCallback(
    (card: ExperienceHoverCard, clientX: number, clientY: number) => {
      if (isAnimatingRef.current && !isVisibleRef.current) return;

      const cardEl = cardRef.current;
      if (!cardEl) return;

      applyCardContent(card);

      if (isVisibleRef.current) {
        positionAt(clientX, clientY);
        return;
      }

      isAnimatingRef.current = true;
      timelineRef.current?.kill();

      const revealDuration = reducedMotionRef.current ? 0 : REVEAL_DURATION;

      gsap.set(cardEl, { display: "flex", visibility: "hidden" });
      positionAt(clientX, clientY, true);

      timelineRef.current = gsap.timeline({
        onComplete: finishAnimation,
      });

      isVisibleRef.current = true;

      timelineRef.current
        .set(cardEl, {
          display: "flex",
          visibility: "visible",
          clipPath: CARD_CLIP_CLOSED,
        })
        .to(cardEl, {
          clipPath: CARD_CLIP_OPEN,
          duration: revealDuration,
          ease: revealDuration === 0 ? "none" : "power3.out",
        });
    },
    [applyCardContent, finishAnimation, positionAt],
  );

  useImperativeHandle(
    ref,
    () => ({
      show: showCard,
      move: (clientX: number, clientY: number) => {
        if (!isVisibleRef.current) return;
        positionAt(clientX, clientY);
      },
      hide: hideCard,
    }),
    [showCard, positionAt, hideCard],
  );

  return (
    <div
      ref={cardRef}
      className="experiences-hover-card"
      style={{
        display: "none",
        clipPath: CARD_CLIP_CLOSED,
      }}
      aria-hidden
    >
      <p ref={eyebrowRef} className="experiences-hover-card__eyebrow" />
      <div className="experiences-hover-card__bottom">
        <p ref={titleRef} className="experiences-hover-card__title" />
      </div>
    </div>
  );
});
