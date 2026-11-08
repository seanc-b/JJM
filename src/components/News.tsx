"use client";

import Image from "next/image";
import { useCallback, useLayoutEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { IconPlay } from "@/components/Icons";
import Placeholder from "@/components/Placeholder";
import VideoModal from "@/components/VideoModal";
import { news, type NewsItem } from "@/content/home";

/** The caption's white bar (one per line), and the Play button; each is drawn twice for the wipe hover. */
const caption = "box-decoration-clone px-2.5 py-1 text-[clamp(0.95rem,1.3vw,1.3rem)] font-bold leading-[1.55]";
const play = "inline-flex items-center gap-2 px-4 py-2 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white";
const playIcon = "size-3.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5";

/**
 * The photo caption: white bars of navy text, one per line. On hover a navy copy with white text wipes
 * across each line in turn (.wipe-line in globals.css). Where the lines break depends on the width, so
 * they're measured after layout, and again on resize; each line gets its own copy, clipped to that
 * line's band. Before measuring, a single copy covers the whole caption.
 */
const BLEED = 6;

function WipeCaption({ text }: { text: string }) {
  const box = useRef<HTMLSpanElement>(null);
  const base = useRef<HTMLSpanElement>(null);
  const [bands, setBands] = useState<{ top: number; bottom: number }[]>([{ top: 0, bottom: 0 }]);

  useLayoutEffect(() => {
    const el = box.current;
    const span = base.current;
    if (!el || !span) return;
    const measure = () => {
      const outer = el.getBoundingClientRect();
      const next: { top: number; bottom: number }[] = [];
      for (const r of Array.from(span.getClientRects())) {
        // Measured from the copy's box, which reaches BLEED px past the caption on every side: a line's bar
        // (its padding) can stick out above or below the caption. One more pixel of overlap each way, so
        // no white edge survives between the copy and the bar.
        const band = {
          top: Math.max(0, r.top - outer.top + BLEED - 1),
          bottom: Math.max(0, outer.bottom - r.bottom + BLEED - 1),
        };
        if (!next.some((b) => Math.abs(b.top - band.top) < 2)) next.push(band);
      }
      setBands((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <span ref={box} className="absolute bottom-6 left-6 right-10 md:right-20">
      <span ref={base} className={`${caption} bg-white text-navy`}>
        {text}
      </span>
      {bands.map((b, i) => (
        <span
          key={i}
          aria-hidden
          className="wipe-line absolute"
          // Grown by BLEED on every side and padded back in, so the text wraps exactly as in the caption.
          style={{ inset: -BLEED, padding: BLEED, "--t": `${b.top}px`, "--b": `${b.bottom}px`, "--i": i } as CSSProperties}
        >
          {/* The navy bars carry a 1px navy edge so they fully cover the white bars beneath. */}
          <span className={`${caption} bg-navy text-white shadow-[0_0_0_1px_var(--color-navy)]`}>{text}</span>
        </span>
      ))}
    </span>
  );
}

export default function News() {
  const [playing, setPlaying] = useState<NewsItem | null>(null);
  const close = useCallback(() => setPlaying(null), []);

  // The links still point at YouTube, so a new-tab click (or no JavaScript) goes there instead.
  const open = (item: NewsItem) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    setPlaying(item);
  };

  return (
    <section aria-labelledby="news-heading" className="pb-[clamp(40px,5vw,72px)]">
      {/* The dotted rules run edge to edge, as drawn. */}
      <div className="rule-dotted" />
      <div className="flex items-center justify-center gap-3 py-5 text-navy">
        <Image src="/icons/section-flame.svg" alt="" width={40} height={40} className="size-10" />
        <h2 id="news-heading" className="display text-[clamp(1.5rem,2.6vw,2.5rem)]">
          News
        </h2>
      </div>
      <div className="rule-dotted" />

      <ul className="site mt-[clamp(32px,4vw,64px)] grid gap-x-[clamp(24px,3.5vw,52px)] gap-y-12 md:grid-cols-2">
        {news.map((item) => (
          <li key={item.title} data-reveal>
            {/* Hovering either link wipes navy across the caption and the Play button (.wipe-group). */}
            <article className="wipe-group">
              <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-blue/40 pt-3">
                <span className="text-[clamp(1.25rem,1.9vw,1.8rem)] font-medium uppercase leading-none text-blue">{item.source}</span>
                <span className="text-[0.9375rem] text-ink">{item.subtitle}</span>
                <span className="basis-full text-[0.8125rem] font-semibold tabular-nums text-ink md:ml-auto md:basis-auto">{item.date}</span>
              </header>

              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={open(item)}
                aria-haspopup="dialog"
                aria-label={`Play video: ${item.title}`}
                className="frame group relative mt-3 block aspect-[16/9] bg-navy"
              >
                <Image src={item.image.src} alt={item.image.alt} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy/60 to-transparent transition-opacity duration-500 group-hover:opacity-80" />
                <WipeCaption text={item.title} />
                {item.placeholder && <Placeholder className="absolute left-3 top-3" />}
              </a>

              <div className="mt-3 flex justify-end">
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={open(item)}
                  aria-haspopup="dialog"
                  aria-label={`Play video: ${item.title}`}
                  className={`group relative ${play} bg-blue`}
                >
                  Play
                  <IconPlay className={playIcon} />
                  <span aria-hidden className={`wipe-fill absolute inset-0 ${play} bg-navy`}>
                    Play
                    <IconPlay className={playIcon} />
                  </span>
                </a>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {playing && <VideoModal youtubeId={playing.youtubeId} title={playing.title} onClose={close} />}
    </section>
  );
}
