"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap, motionAllowed } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import { IconClose, IconPlay } from "@/components/Icons";

type Props = { youtubeId: string; title: string; onClose: () => void };

const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";

/** Sends a message to the YouTube player through its iframe API. */
const post = (frame: HTMLIFrameElement | null, message: object) =>
  frame?.contentWindow?.postMessage(JSON.stringify({ id: 1, channel: "widget", ...message }), PLAYER_ORIGIN);
const command = (frame: HTMLIFrameElement | null, func: string, args: unknown[] = []) => post(frame, { event: "command", func, args });

/**
 * A YouTube video over the page, playing as soon as it opens, on the same blurred navy scrim as
 * the menu. The page behind is inert and stops scrolling; Escape, the close button or a click
 * on the scrim closes it, and focus goes back to whatever opened it.
 */
export default function VideoModal({ youtubeId, title, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const lenis = useLenis();
  // YouTube shows a "More videos" strip on pause and suggestions at the end, and no embed setting
  // turns them off any more, so while paused or ended the player is covered by its thumbnail.
  const [cover, setCover] = useState<"paused" | "ended" | null>(null);

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

  // Listens to the player. Captions start off: cc_load_policy can only force them on, and a video
  // whose owner set captions to show by default ignores it, so once the player is ready or starts
  // playing it's told to unload its captions module. Viewers can still turn CC on.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== PLAYER_ORIGIN || typeof e.data !== "string") return;
      let msg: { event?: string; info?: unknown };
      try {
        msg = JSON.parse(e.data);
      } catch {
        return;
      }
      // Player state: 1 playing, 2 paused, 0 ended.
      const state = msg.event === "onStateChange" ? msg.info : (msg.info as { playerState?: number } | null | undefined)?.playerState;
      if (msg.event === "onReady") command(frame.current, "unloadModule", ["captions"]);
      if (state === 1) {
        command(frame.current, "unloadModule", ["captions"]);
        setCover(null);
      } else if (state === 2) setCover("paused");
      else if (state === 0) setCover("ended");
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const resume = () => {
    if (cover === "ended") command(frame.current, "seekTo", [0, true]);
    command(frame.current, "playVideo");
    setCover(null);
  };

  // youtube-nocookie avoids setting tracking cookies until the visitor plays; the click that opened
  // the modal is what lets the browser start it with sound.
  const src = `${PLAYER_ORIGIN}/embed/${youtubeId}?autoplay=1&rel=0&playsinline=1&cc_load_policy=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;

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
          ref={frame}
          // Asks the player to send its events (ready, state changes) to this page.
          onLoad={() => post(frame.current, { event: "listening" })}
          src={src}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
        {cover && (
          <button
            type="button"
            onClick={resume}
            aria-label={cover === "ended" ? "Play video again" : "Resume video"}
            className="group absolute inset-0 flex cursor-pointer items-center justify-center bg-black bg-cover bg-center"
            style={{ backgroundImage: `url(https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg)` }}
          >
            <span className="absolute inset-0 bg-navy/55 transition-colors duration-500 group-hover:bg-navy/45" aria-hidden />
            <span className="relative flex size-20 items-center justify-center rounded-full bg-white text-navy transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110">
              <IconPlay className="ml-1 size-7" />
            </span>
          </button>
        )}
      </div>
    </div>,
    document.body,
  );
}
