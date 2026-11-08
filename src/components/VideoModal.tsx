"use client";

import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { gsap, motionAllowed } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import { IconClose, IconCollapse, IconExpand, IconMuted, IconPause, IconPlay, IconVolume } from "@/components/Icons";

type Props = { youtubeId: string; title: string; onClose: () => void };

const PLAYER_ORIGIN = "https://www.youtube-nocookie.com";
/** How long the controls stay up after the pointer stops moving, while playing. */
const CONTROLS_HIDE_MS = 2200;

/** Sends a message to the YouTube player through its iframe API. */
const post = (frame: HTMLIFrameElement | null, message: object) =>
  frame?.contentWindow?.postMessage(JSON.stringify({ id: 1, channel: "widget", ...message }), PLAYER_ORIGIN);
const command = (frame: HTMLIFrameElement | null, func: string, args: unknown[] = []) => post(frame, { event: "command", func, args });

const clock = (s: number) => {
  const t = Math.max(0, Math.floor(s));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
};

/**
 * A YouTube video over the page, playing as soon as it opens, on the same blurred navy scrim as
 * the menu. YouTube's own controls are off and a transparent layer sits over the player, so its
 * hover UI (share, "More videos", the time pill) never appears; the site draws its own minimal
 * controls instead. The page behind is inert and stops scrolling; Escape, the close button or a
 * click on the scrim closes it, and focus goes back to whatever opened it.
 */
export default function VideoModal({ youtubeId, title, onClose }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const hideTimer = useRef<number>(0);
  const lenis = useLenis();

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsUp, setControlsUp] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  // YouTube shows a "More videos" strip on pause and suggestions at the end, and no embed setting
  // turns them off any more, so while paused or ended the player is covered by its thumbnail.
  const [cover, setCover] = useState<"paused" | "ended" | null>(null);

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const outside = Array.from(document.querySelectorAll<HTMLElement>("main, footer, header, [data-compact-pill]"));
    outside.forEach((el) => (el.inert = true));
    lenis?.stop();
    document.documentElement.classList.add("overflow-hidden");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !document.fullscreenElement && onClose();
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

  // Listens to the player: state, time, length and mute come back as messages. Captions start off:
  // cc_load_policy can only force them on and an owner's default ignores it, so once the player is
  // ready or starts playing it's told to unload its captions module.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== PLAYER_ORIGIN || typeof e.data !== "string") return;
      let msg: { event?: string; info?: unknown };
      try {
        msg = JSON.parse(e.data);
      } catch {
        return;
      }
      if (msg.event === "onReady") command(frame.current, "unloadModule", ["captions"]);
      const info = (msg.event === "infoDelivery" || msg.event === "initialDelivery" ? msg.info : null) as {
        playerState?: number;
        currentTime?: number;
        duration?: number;
        muted?: boolean;
      } | null;
      if (info?.currentTime !== undefined) setTime(info.currentTime);
      if (info?.duration) setDuration(info.duration);
      if (info?.muted !== undefined) setMuted(info.muted);
      // Player state: 1 playing, 2 paused, 0 ended.
      const state = msg.event === "onStateChange" ? msg.info : info?.playerState;
      if (state === 1) {
        command(frame.current, "unloadModule", ["captions"]);
        setPlaying(true);
        setCover(null);
      } else if (state === 2) {
        setPlaying(false);
        setCover("paused");
      } else if (state === 0) {
        setPlaying(false);
        setCover("ended");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const onFullscreen = () => setFullscreen(document.fullscreenElement === panel.current);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreen);
      window.clearTimeout(hideTimer.current);
    };
  }, []);

  // Controls show on movement or focus and fade after a moment of stillness while playing.
  const wake = () => {
    setControlsUp(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setControlsUp(false), CONTROLS_HIDE_MS);
  };

  const togglePlay = () => {
    if (playing) command(frame.current, "pauseVideo");
    else {
      if (cover === "ended") command(frame.current, "seekTo", [0, true]);
      command(frame.current, "playVideo");
      setCover(null);
    }
    wake();
  };
  const toggleMute = () => {
    command(frame.current, muted ? "unMute" : "mute");
    setMuted(!muted);
    wake();
  };
  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else panel.current?.requestFullscreen?.();
    wake();
  };
  const seekTo = (seconds: number) => {
    const t = Math.min(Math.max(seconds, 0), duration);
    command(frame.current, "seekTo", [t, true]);
    setTime(t);
    wake();
  };
  const seekFromClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    seekTo(((e.clientX - r.left) / r.width) * duration);
  };
  const seekFromKeys = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = { ArrowLeft: -5, ArrowRight: 5, Home: -Infinity, End: Infinity }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    seekTo(time + step);
  };

  // youtube-nocookie avoids tracking cookies until play. controls=0 removes YouTube's control bar;
  // the click that opened the modal is what lets the browser start it with sound.
  const params = new URLSearchParams({
    autoplay: "1",
    controls: "0",
    rel: "0",
    playsinline: "1",
    iv_load_policy: "3",
    disablekb: "1",
    cc_load_policy: "0",
    enablejsapi: "1",
    origin: window.location.origin,
  });
  const src = `${PLAYER_ORIGIN}/embed/${youtubeId}?${params}`;
  const showControls = controlsUp || !playing;
  const progress = duration ? (time / duration) * 100 : 0;

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

      <div
        ref={panel}
        onPointerMove={wake}
        onFocus={wake}
        className={`relative aspect-video w-[min(100%,1100px,calc(82svh*16/9))] overflow-hidden bg-black ${showControls ? "" : "cursor-none"}`}
      >
        <iframe
          ref={frame}
          // Asks the player to send its events (ready, state, time) to this page.
          onLoad={() => post(frame.current, { event: "listening" })}
          src={src}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          tabIndex={-1}
          className="pointer-events-none absolute inset-0 size-full border-0"
        />

        {/* Click anywhere on the video to play or pause. It also keeps the pointer off the player, so YouTube's hover UI never shows. */}
        <button type="button" onClick={togglePlay} aria-label={playing ? "Pause video" : "Play video"} className="absolute inset-0 cursor-pointer" />

        {cover && (
          <button
            type="button"
            onClick={togglePlay}
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

        {/* Minimal controls: a thin progress line, play/pause, time, mute, fullscreen. */}
        <div
          className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/70 to-transparent px-[clamp(12px,2vw,24px)] pb-3 pt-10 text-white transition-opacity duration-500 ${
            showControls ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <div
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(duration)}
            aria-valuenow={Math.round(time)}
            aria-valuetext={`${clock(time)} of ${clock(duration)}`}
            onClick={seekFromClick}
            onKeyDown={seekFromKeys}
            className="group/seek relative -my-2 cursor-pointer py-2"
          >
            <div className="relative h-0.5 bg-white/30 transition-[height] duration-300 group-hover/seek:h-1">
              <div className="absolute inset-y-0 left-0 bg-white" style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4">
            <button type="button" onClick={togglePlay} aria-label={playing ? "Pause video" : "Play video"} className="cursor-pointer transition-opacity duration-300 hover:opacity-70">
              {playing ? <IconPause className="size-5" /> : <IconPlay className="size-5" />}
            </button>
            <span className="text-[0.75rem] font-medium tabular-nums tracking-[0.04em] text-white/85">
              {clock(time)} <span className="text-white/50">/ {clock(duration)}</span>
            </span>
            <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="ml-auto cursor-pointer transition-opacity duration-300 hover:opacity-70">
              {muted ? <IconMuted className="size-5" /> : <IconVolume className="size-5" />}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={fullscreen ? "Exit full screen" : "Full screen"}
              className="cursor-pointer transition-opacity duration-300 hover:opacity-70"
            >
              {fullscreen ? <IconCollapse className="size-5" /> : <IconExpand className="size-5" />}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
