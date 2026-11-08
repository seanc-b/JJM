"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap, motionAllowed } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import { IconClose } from "@/components/Icons";

type Props = { youtubeId: string; title: string; onClose: () => void };

/**
 * A YouTube video over the page, playing as soon as it opens, on the same blurred navy scrim as
 * the menu. The page behind is inert and stops scrolling; Escape, the close button or a click
 * on the scrim closes it, and focus goes back to whatever opened it.
 */
export default function VideoModal({ youtubeId, title, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const outside = Array.from(document.querySelectorAll<HTMLElement>("main, footer, header, [data-compact-pill]"));
    outside.forEach((el) => (el.inert = true));
    lenis?.stop();
    document.documentElement.classList.add("overflow-hidden");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    closeButton.current?.focus();

    if (motionAllowed() && panel.current) {
      gsap.fromTo(panel.current, { opacity: 0, scale: 0.96, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "expo.out" });
    }

    return () => {
      outside.forEach((el) => (el.inert = false));
      lenis?.start();
      document.documentElement.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [lenis, onClose]);

  // youtube-nocookie avoids setting tracking cookies until the visitor plays; the click that opened
  // the modal is what lets the browser start it with sound.
  const src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1`;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[clamp(16px,4vw,56px)]" role="dialog" aria-modal="true" aria-label={title}>
      <button type="button" aria-label="Close video" tabIndex={-1} onClick={onClose} className="absolute inset-0 cursor-pointer bg-navy/40 backdrop-blur-[8px]" />
      <button
        ref={closeButton}
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute right-[clamp(16px,4vw,48px)] top-5 z-10 cursor-pointer p-2 text-white transition-opacity duration-300 hover:opacity-70"
      >
        <IconClose className="size-7" />
      </button>
      <div ref={panel} className="relative aspect-video w-[min(100%,1100px,calc(82svh*16/9))] bg-black">
        <iframe
          src={src}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    </div>,
    document.body,
  );
}
