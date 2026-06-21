const PREFIX = "[hero-hover]";

export type HeroHoverPointerSource =
  | "mouseenter"
  | "mouseleave"
  | "focus"
  | "blur";

type ImageLoadStatus = "idle" | "loading" | "loaded" | "error" | "cached";

type AnimationKind =
  | "portrait-fade"
  | "background-container"
  | "crossfade";

type DebugState = {
  previousHoverId: string | null;
  activeId: string | null;
  backgroundUrl: string | null;
  displayUrl: string | null;
  visible: boolean;
  imageLoadStatus: ImageLoadStatus;
  imageUrl: string | null;
  crossfadeCurrentUrl: string | null;
  crossfadePendingUrl: string | null;
  crossfadeTransitioning: boolean;
  activeAnimations: AnimationKind[];
  lastEvent: string | null;
  timestamp: number;
};

const state: DebugState = {
  previousHoverId: null,
  activeId: null,
  backgroundUrl: null,
  displayUrl: null,
  visible: false,
  imageLoadStatus: "idle",
  imageUrl: null,
  crossfadeCurrentUrl: null,
  crossfadePendingUrl: null,
  crossfadeTransitioning: false,
  activeAnimations: [],
  lastEvent: null,
  timestamp: Date.now(),
};

function touch(event: string) {
  state.lastEvent = event;
  state.timestamp = Date.now();
}

function setActiveAnimation(kind: AnimationKind, active: boolean) {
  if (active) {
    if (!state.activeAnimations.includes(kind)) {
      state.activeAnimations = [...state.activeAnimations, kind];
    }
    return;
  }

  state.activeAnimations = state.activeAnimations.filter((item) => item !== kind);
}

export const heroHoverDebug = {
  logPointer(id: string | null, source: HeroHoverPointerSource) {
    const from = state.previousHoverId;

    if (id === null) {
      touch("leave");
      console.log(`${PREFIX} leave`, {
        from,
        source,
        activeId: state.activeId,
      });
      state.previousHoverId = null;
      return;
    }

    if (from === null) {
      touch("enter");
      console.log(`${PREFIX} enter`, {
        id,
        source,
        note: "mouse entered item with no prior hover",
      });
    } else if (from !== id) {
      touch("switch");
      console.log(`${PREFIX} hover`, {
        from,
        to: id,
        source,
      });
    }

    state.previousHoverId = id;
  },

  setActiveId(activeId: string | null) {
    state.activeId = activeId;
    touch("active-id");
  },

  setBackgroundUrl(backgroundUrl: string | null) {
    state.backgroundUrl = backgroundUrl;
    touch("background-url");
    console.log(`${PREFIX} background-url`, { backgroundUrl });
  },

  setDisplayUrl(displayUrl: string | null) {
    state.displayUrl = displayUrl;
    touch("display-url");
    console.log(`${PREFIX} display-url`, { displayUrl });
  },

  setVisible(visible: boolean) {
    state.visible = visible;
    touch("visible");
  },

  logImageLoad(
    url: string,
    status: ImageLoadStatus,
    detail?: Record<string, unknown>,
  ) {
    state.imageUrl = url;
    state.imageLoadStatus = status;
    touch(`image-${status}`);
    console.log(`${PREFIX} image`, {
      url,
      status,
      ...detail,
    });
  },

  logCrossfadeState(detail: {
    currentUrl: string | null;
    pendingUrl?: string | null;
    transitioning?: boolean;
  }) {
    state.crossfadeCurrentUrl = detail.currentUrl;
    if (detail.pendingUrl !== undefined) {
      state.crossfadePendingUrl = detail.pendingUrl;
    }
    if (detail.transitioning !== undefined) {
      state.crossfadeTransitioning = detail.transitioning;
    }
    touch("crossfade-state");
  },

  logAnimationStart(kind: AnimationKind, detail?: Record<string, unknown>) {
    setActiveAnimation(kind, true);
    touch(`animation-start:${kind}`);
    console.log(`${PREFIX} animation start`, {
      kind,
      activeAnimations: [...state.activeAnimations],
      ...detail,
    });
  },

  logAnimationStop(kind: AnimationKind, detail?: Record<string, unknown>) {
    setActiveAnimation(kind, false);
    touch(`animation-stop:${kind}`);
    console.log(`${PREFIX} animation stop`, {
      kind,
      activeAnimations: [...state.activeAnimations],
      ...detail,
    });
  },

  snapshot(extra?: Record<string, unknown>) {
    const displayUrlStale =
      state.visible && Boolean(state.backgroundUrl) && !state.displayUrl;

    const payload = {
      ...state,
      activeAnimations: [...state.activeAnimations],
      displayUrlStale,
      extra,
    };

    console.log(`${PREFIX} SNAPSHOT (space)`, payload);
    console.groupCollapsed(`${PREFIX} snapshot detail`);
    console.table({
      previousHoverId: state.previousHoverId,
      activeId: state.activeId,
      backgroundUrl: state.backgroundUrl,
      displayUrl: state.displayUrl,
      displayUrlStale,
      visible: state.visible,
      imageLoadStatus: state.imageLoadStatus,
      imageUrl: state.imageUrl,
      crossfadeCurrentUrl: state.crossfadeCurrentUrl,
      crossfadePendingUrl: state.crossfadePendingUrl,
      crossfadeTransitioning: state.crossfadeTransitioning,
      activeAnimations: state.activeAnimations.join(", ") || "(none)",
      lastEvent: state.lastEvent,
    });
    console.groupEnd();

    if (displayUrlStale) {
      console.warn(
        `${PREFIX} displayUrl missing while visible — same-item re-hover bug`,
      );
    }

    return payload;
  },

  getState(): Readonly<DebugState> {
    return {
      ...state,
      activeAnimations: [...state.activeAnimations],
    };
  },
};
