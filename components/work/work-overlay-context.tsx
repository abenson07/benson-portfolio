"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WorkOverlayContextValue = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const WorkOverlayContext = createContext<WorkOverlayContextValue | null>(null);

export function WorkOverlayProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const setOpen = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      setOpen,
    }),
    [isOpen, setOpen],
  );

  return (
    <WorkOverlayContext.Provider value={value}>
      {children}
    </WorkOverlayContext.Provider>
  );
}

export function useWorkOverlay() {
  const context = useContext(WorkOverlayContext);
  if (!context) {
    throw new Error("useWorkOverlay must be used within WorkOverlayProvider");
  }
  return context;
}
