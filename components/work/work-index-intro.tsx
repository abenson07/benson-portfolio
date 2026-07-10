"use client";

import { useState } from "react";

const FILTERS = [
  "Led Design",
  "Strategy",
  "Research",
  "Conceptual",
  "Surprise Me",
] as const;

type WorkFilter = (typeof FILTERS)[number];

function RefreshIcon() {
  return (
    <svg
      className="work-index-intro__refresh-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 3v5h-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 16H3v5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WorkIndexIntro() {
  const [active, setActive] = useState<WorkFilter | null>(null);

  return (
    <header className="work-index-intro" data-figma-node="3041:50879">
      <div className="work-index-intro__copy" data-figma-node="3041:50870">
        <p className="work-index-intro__eyebrow" data-figma-node="3041:43146">
          Companies big and small
        </p>
        <h1 className="work-index-intro__headline" data-figma-node="3041:43147">
          Industry spanning, human centric solutions
        </h1>
      </div>

      <div className="work-index-intro__filters" data-figma-node="3041:50874">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`work-index-intro__chip${
              active === filter ? " work-index-intro__chip--active" : ""
            }`}
            aria-pressed={active === filter}
            onClick={() =>
              setActive((current) => (current === filter ? null : filter))
            }
          >
            {filter}
          </button>
        ))}
        <button
          type="button"
          className="work-index-intro__refresh"
          aria-label="Shuffle filters"
          onClick={() => {
            const next = FILTERS[Math.floor(Math.random() * FILTERS.length)];
            setActive(next);
          }}
        >
          <RefreshIcon />
        </button>
      </div>
    </header>
  );
}
