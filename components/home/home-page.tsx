import Image from "next/image";

import { heroHighlights } from "@/content/hero-highlights";

import { HeroHighlights } from "./hero-highlights";
import { TopNav } from "./top-nav";

export function HomePage() {
  return (
    <div className="page-wrapper">
      <Image
        src="/alex-bg.png"
        alt=""
        width={1200}
        height={1200}
        className="hero-bg-portrait"
        style={{ width: "auto", height: "100vh" }}
        priority
        aria-hidden
      />
      <div className="body-wrapper">
        <TopNav />

        <div className="hero-content-wrapper">
          <HeroHighlights highlights={heroHighlights} />
          <div className="hero-title" aria-hidden>
            BENSON
          </div>
        </div>
      </div>
    </div>
  );
}
