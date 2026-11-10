"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Partner } from "@/content/home";

/** Drift speed of the strip, in px per second. */
const SPEED = 28;
/** How long after a finger lets go before the strip drifts again, in ms. */
const RESUME_AFTER = 1600;

/**
 * The partner logos. When they all fit (desktop) they sit still in one centred row. When they don't (phones),
 * they become one row that drifts slowly sideways like a marquee, with soft white fades at both edges, and a
 * finger can drag it (it's a native horizontal scroller, so it has natural momentum); it drifts on again a
 * moment after you let go. Reduced motion: no drift, just a swipeable row. The loop needs a second copy of
 * the logos; screen readers only hear the first.
 */
export default function LogoStrip({ partners }: { partners: Partner[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const set = useRef<HTMLUListElement>(null);
  const [overflow, setOverflow] = useState(false);

  // Whether the logos fit, re-checked on resize.
  useLayoutEffect(() => {
    const box = scroller.current;
    const row = set.current;
    if (!box || !row) return;
    const check = () => setOverflow(row.scrollWidth > box.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(box);
    ro.observe(row);
    return () => ro.disconnect();
  }, []);

  // The drift: nudges the scroll position each frame, and wraps back by one copy's width so it never ends.
  useEffect(() => {
    const box = scroller.current;
    const row = set.current;
    if (!overflow || !box || !row || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = 0;
    let pos = box.scrollLeft;
    let held = false;
    let resume: ReturnType<typeof setTimeout> | undefined;

    const tick = (t: number) => {
      const dt = last ? Math.min(t - last, 64) : 0;
      last = t;
      if (!held) {
        // One copy's width, including the gap that trails it, so the wrap lands on an identical frame.
        const loop = row.offsetWidth;
        pos += (SPEED * dt) / 1000;
        if (pos >= loop) pos -= loop;
        box.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };

    const hold = () => {
      held = true;
      clearTimeout(resume);
    };
    const release = () => {
      clearTimeout(resume);
      resume = setTimeout(() => {
        pos = box.scrollLeft % row.offsetWidth;
        last = 0;
        held = false;
      }, RESUME_AFTER);
    };
    const wheel = () => {
      hold();
      release();
    };

    box.addEventListener("pointerdown", hold);
    box.addEventListener("touchstart", hold, { passive: true });
    box.addEventListener("wheel", wheel, { passive: true });
    window.addEventListener("pointerup", release);
    box.addEventListener("touchend", release);
    box.addEventListener("touchcancel", release);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resume);
      box.removeEventListener("pointerdown", hold);
      box.removeEventListener("touchstart", hold);
      box.removeEventListener("wheel", wheel);
      window.removeEventListener("pointerup", release);
      box.removeEventListener("touchend", release);
      box.removeEventListener("touchcancel", release);
    };
  }, [overflow]);

  const logos = (copy: boolean) =>
    partners.map((p) => (
      <li key={p.src} className="flex shrink-0 items-center">
        <Image
          src={p.src}
          alt={copy ? "" : p.name}
          width={p.w}
          height={p.h}
          className="w-auto max-w-none"
          style={{ height: `calc(${p.height}px * var(--logo-scale))` }}
        />
      </li>
    ));

  const gap = "gap-x-[clamp(28px,3.5vw,56px)]";
  // When looping, the gap also trails each copy (pr), so the seam between the two copies matches the rest.
  const trail = "pr-[clamp(28px,3.5vw,56px)]";
  return (
    <div
      ref={scroller}
      // Lenis must not take over a sideways drag here.
      data-lenis-prevent-touch
      className={`[--logo-scale:0.8] md:[--logo-scale:1] ${
        overflow
          ? "overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]"
          : ""
      }`}
    >
      <div className={`flex py-9 ${overflow ? "w-max" : "justify-center"}`}>
        <ul ref={set} aria-label="Memberships and partners" className={`flex shrink-0 items-center ${gap} ${overflow ? trail : ""}`}>
          {logos(false)}
        </ul>
        {overflow && (
          <ul aria-hidden className={`flex shrink-0 items-center ${gap} ${trail}`}>
            {logos(true)}
          </ul>
        )}
      </div>
    </div>
  );
}
