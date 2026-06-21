import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

export const LENIS_LERP = 0.1;
export const LENIS_WHEEL_MULTIPLIER = 1;

export type LenisScrollerHandle = {
  lenis: Lenis;
  destroy: () => void;
  getScroll: () => number;
  scrollTo: (value: number, immediate?: boolean) => void;
  resize: () => void;
  start: () => void;
  stop: () => void;
};

export type CreateLenisScrollerOptions = {
  wrapper: HTMLElement;
  content: HTMLElement;
  lerp?: number;
  wheelMultiplier?: number;
  startStopped?: boolean;
};

function nativeScrollProxy(wrapper: HTMLElement) {
  return {
    scrollTop(value?: number) {
      if (arguments.length) {
        wrapper.scrollTop = value ?? 0;
      }

      return wrapper.scrollTop;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: wrapper.clientWidth,
        height: wrapper.clientHeight,
      };
    },
  };
}

export function createLenisScroller({
  wrapper,
  content,
  lerp = LENIS_LERP,
  wheelMultiplier = LENIS_WHEEL_MULTIPLIER,
  startStopped = false,
}: CreateLenisScrollerOptions): LenisScrollerHandle {
  gsap.registerPlugin(ScrollTrigger);

  const lenis = new Lenis({
    wrapper,
    content,
    lerp,
    wheelMultiplier,
    smoothWheel: true,
    autoRaf: false,
  });

  wrapper.classList.add("lenis", "lenis-smooth");

  if (startStopped) {
    lenis.stop();
  }

  lenis.on("scroll", ScrollTrigger.update);

  const onTick = (time: number) => {
    lenis.raf(time * 1000);
  };

  gsap.ticker.add(onTick);
  gsap.ticker.lagSmoothing(0);

  ScrollTrigger.scrollerProxy(wrapper, {
    scrollTop(value) {
      if (arguments.length) {
        lenis.scrollTo(value ?? 0, { immediate: true });
      }

      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: wrapper.clientWidth,
        height: wrapper.clientHeight,
      };
    },
    pinType: "transform",
  });

  const destroy = () => {
    gsap.ticker.remove(onTick);
    lenis.destroy();
    wrapper.classList.remove("lenis", "lenis-smooth");
    ScrollTrigger.scrollerProxy(wrapper, nativeScrollProxy(wrapper));
    ScrollTrigger.refresh();
  };

  return {
    lenis,
    destroy,
    getScroll: () => lenis.scroll,
    scrollTo: (value, immediate = false) => {
      lenis.scrollTo(value, { immediate });
    },
    resize: () => {
      lenis.resize();
    },
    start: () => {
      lenis.start();
    },
    stop: () => {
      lenis.stop();
    },
  };
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
