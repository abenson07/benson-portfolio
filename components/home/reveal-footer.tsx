"use client";

import Link from "next/link";
// import { useRef } from "react";

import { homepageFooter } from "@/content/homepage-footer";
// Shelved timed word-cycle (BEN-641) — restore with useFooterHeadline
// import { useFooterHeadline } from "@/lib/motion/use-footer-headline";

import { TearTransition } from "./tear-transition";

import "@/app/home/footer.css";

export function RevealFooter() {
  // const wordRefs = useRef<(HTMLElement | null)[]>([]);
  // useFooterHeadline({ wordRefs });

  return (
    <footer className="reveal-footer" data-figma-node="3051:41119">
      <TearTransition variant="footer" />

      <div className="reveal-footer__inner" data-figma-node="3051:41121">
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
                <Link
                  key={item.label}
                  href={item.href}
                  className="reveal-footer__nav-item"
                >
                  <span className="reveal-footer__nav-prefix">{item.prefix}</span>
                  <span className="reveal-footer__nav-label">{item.label}</span>
                </Link>
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
