"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

import { useWorkOverlay } from "./work-overlay-context";

import {
  createLenisScroller,
  prefersNativeScroll,
  prefersReducedMotion,
  type LenisScrollerHandle,
} from "@/lib/motion/lenis-gsap";
import {
  consumeWorkModalHistoryClose,
  markWorkModalHistoryEntry,
  resetWorkModalHistory,
} from "@/lib/work-modal-history";

import "@/app/work/work-modal.css";

type WorkModalShellProps = {
  slug: string;
  children: ReactNode;
};

const INNER_ENTER_DURATION = 0.8;
const BACKDROP_ENTER_DURATION = 0.5;
const EXIT_DURATION = 0.5;
const BACKDROP_OPACITY = 0.5;
const PANEL_EASE = "expo.out";
const BACKDROP_EASE = "none";
const MOBILE_CHROME_MQ = "(max-width: 640px)";
const PANEL_PADDING_DESKTOP = 30;
const PANEL_PADDING_MOBILE = 16;

type ModalChrome = {
  scrollDistance: number;
  enterOffset: number;
  bgRadiusStart: number;
  bgInsetEnd: number;
  closeOffsetX: number;
  closeOffsetY: number;
};

function getModalChrome(): ModalChrome {
  const scrollDistance = Math.max(window.innerHeight * 0.2, 200);
  const mobile = window.matchMedia(MOBILE_CHROME_MQ).matches;

  if (mobile) {
    return {
      scrollDistance,
      enterOffset: window.innerHeight - scrollDistance,
      bgRadiusStart: 30,
      bgInsetEnd: -PANEL_PADDING_MOBILE,
      closeOffsetX: 35,
      closeOffsetY: -15,
    };
  }

  return {
    scrollDistance,
    enterOffset: window.innerHeight - scrollDistance,
    bgRadiusStart: 50,
    bgInsetEnd: -PANEL_PADDING_DESKTOP,
    closeOffsetX: 60,
    closeOffsetY: -30,
  };
}

function lerp(start: number, end: number, progress: number) {
  return start + (end - start) * progress;
}

export function WorkModalShell({ slug, children }: WorkModalShellProps) {
  const router = useRouter();
  const { setOpen } = useWorkOverlay();
  const modalRootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const enterRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isClosingRef = useRef(false);
  const enterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lenisRef = useRef<LenisScrollerHandle | null>(null);
  const chromeRef = useRef<ModalChrome>(getModalChrome());

  const destroyLenis = useCallback(() => {
    lenisRef.current?.destroy();
    lenisRef.current = null;
  }, []);

  const initLenis = useCallback(() => {
    const panel = panelRef.current;
    const inner = innerRef.current;
    if (!panel || !inner || prefersNativeScroll()) {
      return;
    }

    destroyLenis();
    lenisRef.current = createLenisScroller({
      wrapper: panel,
      content: inner,
    });
    lenisRef.current.scrollTo(0, true);
  }, [destroyLenis]);

  const syncBgHeight = useCallback(() => {
    const inner = innerRef.current;
    const bg = bgRef.current;
    if (!inner || !bg) return;

    const topInset = Number.parseFloat(bg.style.top || "0") || 0;
    bg.style.height = `${inner.offsetHeight - topInset}px`;
  }, []);

  const applyScrollChrome = useCallback((progress: number) => {
    const inner = innerRef.current;
    const bg = bgRef.current;
    const closeBtn = closeRef.current;
    if (!bg || !inner) return;

    const {
      bgRadiusStart,
      bgInsetEnd,
      closeOffsetX,
      closeOffsetY,
    } = chromeRef.current;
    const inset = lerp(0, bgInsetEnd, progress);
    const radius = lerp(bgRadiusStart, 0, progress);

    bg.style.borderTopLeftRadius = `${radius}px`;
    bg.style.borderTopRightRadius = `${radius}px`;
    bg.style.left = `${inset}px`;
    bg.style.right = `${inset}px`;
    bg.style.top = `${inset}px`;
    bg.style.height = `${inner.offsetHeight - inset}px`;

    if (closeBtn) {
      closeBtn.style.transform =
        progress > 0
          ? `translate(${closeOffsetX * progress}px, ${closeOffsetY * progress}px)`
          : "none";
    }

    document.body.style.setProperty(
      "--work-modal-chrome-progress",
      String(progress),
    );
  }, []);

  const setupScrollChrome = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    scrollTriggerRef.current?.kill();
    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      applyScrollChrome(1);
      return;
    }

    applyScrollChrome(0);

    scrollTriggerRef.current = ScrollTrigger.create({
      scroller: panel,
      start: "top top",
      end: `+=${chromeRef.current.scrollDistance}`,
      scrub: true,
      onUpdate: (self) => {
        applyScrollChrome(self.progress);
      },
    });
  }, [applyScrollChrome]);

  const clearChrome = useCallback(() => {
    document.body.style.removeProperty("--work-modal-chrome-progress");

    const bg = bgRef.current;
    const closeBtn = closeRef.current;

    if (bg) {
      bg.style.removeProperty("border-top-left-radius");
      bg.style.removeProperty("border-top-right-radius");
      bg.style.removeProperty("left");
      bg.style.removeProperty("right");
      bg.style.removeProperty("top");
      bg.style.removeProperty("height");
    }

    if (closeBtn) {
      closeBtn.style.removeProperty("transform");
    }
  }, []);

  const closeModal = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const finish = () => {
      setOpen(false);
      document.body.classList.remove("work-modal-open");
      clearChrome();

      const action = consumeWorkModalHistoryClose();

      if (action.type === "go") {
        window.history.go(action.delta);
        return;
      }

      if (action.type === "push") {
        router.push(action.href, { scroll: false });
        return;
      }

      router.back();
    };

    if (reducedMotion) {
      finish();
      return;
    }

    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const enter = enterRef.current;
    const inner = innerRef.current;

    if (!backdrop || !panel || !enter || !inner) {
      finish();
      return;
    }

    scrollTriggerRef.current?.kill();
    scrollTriggerRef.current = null;
    panel.classList.add("work-modal__panel--exiting");

    const scrollY = lenisRef.current?.getScroll() ?? panel.scrollTop;
    destroyLenis();
    gsap.set(inner, { y: -scrollY });

    const exitY = chromeRef.current.enterOffset + scrollY;

    gsap
      .timeline({ onComplete: finish })
      .to(
        enter,
        { y: exitY, duration: EXIT_DURATION, ease: PANEL_EASE },
        0,
      )
      .to(
        backdrop,
        { opacity: 0, duration: EXIT_DURATION, ease: BACKDROP_EASE },
        0,
      );
  }, [clearChrome, destroyLenis, router, setOpen]);

  useLayoutEffect(() => {
    setOpen(true);
    document.body.classList.add("work-modal-open");
    document.body.style.setProperty("--work-modal-chrome-progress", "0");
    markWorkModalHistoryEntry(slug);

    const modalRoot = modalRootRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const enter = enterRef.current;
    const inner = innerRef.current;

    if (!modalRoot || !backdrop || !panel || !enter || !inner) return;

    modalRoot.classList.add("work-modal--preparing");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    chromeRef.current = getModalChrome();
    panel.scrollTop = 0;
    panel.classList.remove("work-modal__panel--exiting");
    applyScrollChrome(reducedMotion ? 1 : 0);

    if (reducedMotion) {
      gsap.set(backdrop, { opacity: BACKDROP_OPACITY });
      gsap.set(enter, { y: 0 });
      modalRoot.classList.remove("work-modal--preparing");
      syncBgHeight();
      setupScrollChrome();
      ScrollTrigger.refresh();
      return () => {
        scrollTriggerRef.current?.kill();
        destroyLenis();
        setOpen(false);
        document.body.classList.remove("work-modal-open");
        clearChrome();
      };
    }

    const { enterOffset } = chromeRef.current;

    gsap.set(backdrop, { opacity: 0 });
    gsap.set(enter, { y: enterOffset });
    modalRoot.classList.remove("work-modal--preparing");

    enterTimelineRef.current = gsap.timeline({
      onComplete: () => {
        syncBgHeight();
        initLenis();
        setupScrollChrome();
        ScrollTrigger.refresh();
      },
    });

    enterTimelineRef.current
      .to(
        enter,
        { y: 0, duration: INNER_ENTER_DURATION, ease: PANEL_EASE },
        0,
      )
      .to(
        backdrop,
        {
          opacity: BACKDROP_OPACITY,
          duration: BACKDROP_ENTER_DURATION,
          ease: BACKDROP_EASE,
        },
        0,
      );

    return () => {
      enterTimelineRef.current?.kill();
      scrollTriggerRef.current?.kill();
      destroyLenis();
      setOpen(false);
      document.body.classList.remove("work-modal-open");
      clearChrome();
    };
  }, [
    applyScrollChrome,
    clearChrome,
    destroyLenis,
    initLenis,
    setOpen,
    setupScrollChrome,
    slug,
    syncBgHeight,
  ]);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;

    const observer = new ResizeObserver(() => {
      syncBgHeight();
      lenisRef.current?.resize();
      ScrollTrigger.refresh();
    });

    observer.observe(inner);
    syncBgHeight();

    return () => observer.disconnect();
  }, [slug, syncBgHeight]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal]);

  useEffect(() => {
    const handlePopState = () => {
      if (!window.location.pathname.startsWith("/work/")) {
        resetWorkModalHistory();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <div
      ref={modalRootRef}
      className="work-modal work-modal--preparing"
      data-work-modal
      data-work-modal-slug={slug}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={backdropRef}
        className="work-modal__backdrop"
        onClick={closeModal}
        aria-hidden
      />

      <div ref={panelRef} className="work-modal__panel">
        <div ref={enterRef} className="work-modal__enter">
          <div ref={innerRef} className="work-modal__inner">
            <div ref={bgRef} className="work-modal__bg" aria-hidden />

            <button
              ref={closeRef}
              type="button"
              className="work-modal__close"
              aria-label="Close project"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 18 18"
                aria-hidden
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="square"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.332 15.667 15.665 2.333m0 13.334L2.332 2.333"
                />
              </svg>
            </button>

            <div className="work-modal__content">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
