"use client";

import Image from "next/image";
import { useCallback, useState, type MouseEvent } from "react";
import { IconPlay } from "@/components/Icons";
import Placeholder from "@/components/Placeholder";
import VideoModal from "@/components/VideoModal";
import { news, type NewsItem } from "@/content/home";

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
            <article>
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
                <span className="absolute bottom-6 left-6 right-10 md:right-20">
                  <span className="box-decoration-clone bg-white px-2.5 py-1 text-[clamp(0.95rem,1.3vw,1.3rem)] font-bold leading-[1.55] text-navy">{item.title}</span>
                </span>
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
                  className="group inline-flex items-center gap-2 bg-blue px-4 py-2 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-400 hover:bg-navy"
                >
                  Play
                  <IconPlay className="size-3.5 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5" />
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
