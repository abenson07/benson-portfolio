"use client";

import { useCallback, useRef } from "react";

import { homepageFooter } from "@/content/homepage-footer";
// Shelved timed word-cycle (BEN-641) — restore with useFooterHeadline
// import { useFooterHeadline } from "@/lib/motion/use-footer-headline";
import { useFooterReveal } from "@/lib/motion/use-footer-reveal";

import { useComingSoonBanner } from "@/components/coming-soon/coming-soon-banner";

import {
  useCustomCursorController,
  useCustomCursorEnabled,
} from "./custom-cursor";
import { TearTransition } from "./tear-transition";

import "@/app/home/footer.css";

const COMING_SOON_LABEL = "coming soon";

export function RevealFooter() {
  // const wordRefs = useRef<(HTMLElement | null)[]>([]);
  // useFooterHeadline({ wordRefs });
  const footerRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const cursorEnabled = useCustomCursorEnabled();
  const { setLabel: setCursorLabel } = useCustomCursorController("footer");
  const { showComingSoon } = useComingSoonBanner();

  useFooterReveal({ footerRef, innerRef });

  const handleNavHover = useCallback(
    (active: boolean) => {
      setCursorLabel(active ? COMING_SOON_LABEL : null, { scale: 0.5 });
    },
    [setCursorLabel],
  );

  return (
    <footer
      ref={footerRef}
      className={`reveal-footer${cursorEnabled ? " reveal-footer--custom-cursor" : ""}`}
      data-figma-node="3051:41119"
    >
      <TearTransition variant="footer" />

      <div
        ref={innerRef}
        className="reveal-footer__inner"
        data-figma-node="3051:41121"
      >
        <div className="reveal-footer__row">
          <div className="reveal-footer__brand">
            <p className="reveal-footer__intro" data-figma-node="3051:41125">
              {homepageFooter.intro}
            </p>

            <h2 className="reveal-footer__headline" data-figma-node="3051:41124">
              {homepageFooter.headline}
            </h2>

            {/* Shelved timed word-cycle markup
            <div className="reveal-footer__headline" data-figma-node="3051:41124">
              {homepageFooter.headlines.map((word, index) => (
                <span
                  key={word}
                  className="reveal-footer__headline-word"
                  ref={(el) => {
                    wordRefs.current[index] = el;
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
            */}

            <p className="reveal-footer__credit" data-figma-node="3051:41142">
              {homepageFooter.credit}
            </p>
          </div>

          <div className="reveal-footer__aside">
            <nav className="reveal-footer__nav" data-figma-node="3051:41129">
              {homepageFooter.navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className="reveal-footer__nav-item"
                  aria-label={`${item.prefix} ${item.label} — coming soon`}
                  onClick={showComingSoon}
                  onMouseEnter={() => handleNavHover(true)}
                  onMouseLeave={() => handleNavHover(false)}
                  onFocus={() => handleNavHover(true)}
                  onBlur={() => handleNavHover(false)}
                >
                  <span className="reveal-footer__nav-prefix">{item.prefix}</span>
                  <span className="reveal-footer__nav-label">{item.label}</span>
                </button>
              ))}
            </nav>

            <p
              className="reveal-footer__copyright"
              data-figma-node="3051:41143"
            >
              {homepageFooter.copyright}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
