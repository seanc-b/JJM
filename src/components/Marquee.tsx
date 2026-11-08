"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, motionAllowed } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import { marquee } from "@/content/home";

/**
 * Continuous services line. Its speed and direction follow the visitor's scroll:
 * scrolling down drifts it left, scrolling up reverses it, and it eases back to a
 * slow drift when the page is still. Static when motion is reduced.
 */
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      if (!track.current || !motionAllowed()) return;
      const loop = 48;
      tween.current = gsap.to(track.current, { xPercent: -50, duration: loop, ease: "none", repeat: -1 });
      // Scrolling up runs the loop backwards, and a repeating tween stops dead at its own start. Begin
      // a thousand loops in (about 13 hours), so reversing never runs out. The track looks the same.
      tween.current.totalTime(loop * 1000);
      // Plays whenever any part of the marquee is on screen; pauses only once it's fully off.
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) => (isActive ? tween.current?.play() : tween.current?.pause()),
      });
    },
    { scope: root },
  );

  useEffect(() => {
    if (!lenis) return;
    let last = 0;
    let idle: ReturnType<typeof setTimeout> | undefined;
    // Back to the resting pace (keeping the last direction), with a long, soft glide down.
    const settle = () => {
      if (tween.current) gsap.to(tween.current, { timeScale: last || 1, duration: 1.4, ease: "power2.out", overwrite: true });
    };
    const onScroll = ({ velocity, direction }: { velocity: number; direction: number }) => {
      // velocity is px per frame; direction is 1 (down), -1 (up) or 0.
      // Speeds up sharply with scroll speed: up to 7x the resting pace on a fast flick.
      const boost = Math.min(Math.abs(velocity) / 4, 6);
      const dir = direction === 0 ? (last || 1) : direction;
      last = dir;
      if (tween.current) gsap.to(tween.current, { timeScale: dir * (1 + boost), duration: 0.35, ease: "power2.out", overwrite: true });
      // Once scrolling stops, glide back to normal.
      clearTimeout(idle);
      idle = setTimeout(settle, 120);
    };
    lenis.on("scroll", onScroll);
    return () => {
      clearTimeout(idle);
      lenis.off("scroll", onScroll);
    };
  }, [lenis]);

  const items = [...marquee, ...marquee];

  return (
    <div ref={root} aria-label={marquee.join(", ")} role="marquee" className="relative overflow-hidden py-[clamp(28px,3.4vw,52px)]">
      {/* Reduced motion: one copy, centred, items wrap as whole phrases with the bullets inline. */}
      <div
        ref={track}
        className="flex w-max whitespace-nowrap text-[clamp(1.6rem,3.7vw,3.5rem)] font-normal leading-none text-navy will-change-transform motion-reduce:block motion-reduce:w-auto motion-reduce:whitespace-normal motion-reduce:px-5 motion-reduce:text-center motion-reduce:text-[clamp(1.25rem,3.7vw,3.5rem)] motion-reduce:leading-[1.4]"
      >
        {items.map((item, i) => (
          <span
            key={i}
            aria-hidden={i >= marquee.length}
            className={`flex items-center ${i >= marquee.length ? "motion-reduce:hidden" : "motion-reduce:inline"}`}
          >
            <span className="px-[0.55em] motion-reduce:inline-block motion-reduce:whitespace-nowrap">{item}</span>
            <span className="size-[0.22em] rounded-full bg-navy motion-reduce:inline-block motion-reduce:align-middle" />
          </span>
        ))}
      </div>
    </div>
  );
}
