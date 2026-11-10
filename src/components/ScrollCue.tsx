"use client";

import type { MouseEvent } from "react";
import { useLenis } from "@/components/SmoothScroll";

/** Room left above the content once there, so the sticky menu pill doesn't sit on its title. */
const OFFSET = 24;

/**
 * A long, thin down arrow under an inner page's headline: a tall stem ending in a small tick. It's a
 * link to the page's content (#target), scrolled to smoothly; without JavaScript it's a plain jump link.
 * On hover the stem grows and the tick follows it down. It also bobs gently on a loop (.cue-bob in
 * globals.css), a quiet hint to scroll.
 */
export default function ScrollCue({ target, label }: { target: string; label: string }) {
  const lenis = useLenis();

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(target);
    if (!el) return;
    e.preventDefault();
    const top = el.getBoundingClientRect().top + window.scrollY - OFFSET;
    if (lenis) lenis.scrollTo(top, { duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <a
      href={`#${target}`}
      onClick={onClick}
      aria-label={label}
      className="group -ml-3 inline-flex p-3 text-white/85 transition-colors duration-300 hover:text-white"
    >
      <svg width="16" height="56" viewBox="0 0 16 56" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="cue-bob overflow-visible">
        {/* The stem grows from the top on hover; the tick moves down with its end. */}
        <line x1="8" y1="1" x2="8" y2="54" className="origin-top transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-[1.12]" />
        <polyline points="2,48 8,54 14,48" className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-[6px]" />
      </svg>
    </a>
  );
}
