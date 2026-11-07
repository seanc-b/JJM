"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, motionAllowed } from "@/lib/gsap";

// Lenis lives outside React; components subscribe to it as an external store.
let current: Lenis | null = null;
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};
const publish = (next: Lenis | null) => {
  current = next;
  listeners.forEach((cb) => cb());
};

/** The active Lenis instance, or null when motion is reduced or before mount. */
export function useLenis() {
  return useSyncExternalStore(subscribe, () => current, () => null);
}

export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (!motionAllowed()) return;

    const instance = new Lenis({
      autoRaf: false,
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    publish(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      publish(null);
    };
  }, []);

  return <>{children}</>;
}
