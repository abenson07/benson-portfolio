"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react";

import "@/app/coming-soon-banner.css";

const AUTO_DISMISS_MS = 2400;
const PLACARD_SRC = "/case-studies/coming-soon-placard.png";

type ComingSoonBannerContextValue = {
  show: () => void;
};

const ComingSoonBannerContext =
  createContext<ComingSoonBannerContextValue | null>(null);

function Banner({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  return (
    <button
      type="button"
      className={`coming-soon-banner${visible ? " coming-soon-banner--visible" : ""}`}
      aria-label="Coming soon"
      aria-live={visible ? "polite" : undefined}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={onDismiss}
    >
      <Image
        className="coming-soon-banner__placard"
        src={PLACARD_SRC}
        alt=""
        width={1600}
        height={400}
        unoptimized
        priority
      />
    </button>
  );
}

export function ComingSoonBannerProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const dismissTimerRef = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (dismissTimerRef.current !== null) {
      window.clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    clearTimer();
    setVisible(false);
  }, [clearTimer]);

  const show = useCallback(() => {
    clearTimer();
    setVisible(true);
    dismissTimerRef.current = window.setTimeout(() => {
      setVisible(false);
      dismissTimerRef.current = null;
    }, AUTO_DISMISS_MS);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ComingSoonBannerContext.Provider value={value}>
      {children}
      <Banner visible={visible} onDismiss={hide} />
    </ComingSoonBannerContext.Provider>
  );
}

export function useComingSoonBanner() {
  const ctx = useContext(ComingSoonBannerContext);

  const showComingSoon = useCallback(() => {
    ctx?.show();
  }, [ctx]);

  const onComingSoonClick = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      ctx?.show();
    },
    [ctx],
  );

  return { showComingSoon, onComingSoonClick };
}
