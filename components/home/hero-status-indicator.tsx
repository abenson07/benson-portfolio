import type { CSSProperties } from "react";

const STATUS_MESSAGE = "Not searching but always open";
const MESSAGE_REVEAL_DURATION = "0.2s";

export function HeroStatusIndicator() {
  return (
    <button
      type="button"
      className="hero-status-indicator"
      aria-label={STATUS_MESSAGE}
      style={
        {
          "--hero-status-reveal-duration": MESSAGE_REVEAL_DURATION,
        } as CSSProperties
      }
    >
      <span className="hero-status-indicator__message" aria-hidden>
        {STATUS_MESSAGE}
      </span>
    </button>
  );
}
