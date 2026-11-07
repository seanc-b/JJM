"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

export const EASE = "expo.out";
export const REDUCED = "(prefers-reduced-motion: reduce)";

export function motionAllowed() {
  return typeof window !== "undefined" && !window.matchMedia(REDUCED).matches;
}
