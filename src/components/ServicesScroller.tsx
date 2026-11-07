"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import Button from "@/components/Button";
import { IconPlus } from "@/components/Icons";
import { sections } from "@/content/home";

/** Scroll distance per photo, as a fraction of the viewport height. */
const STEP_VH = 0.85;
/** The incoming photo starts this far into a step, so the outgoing one visibly moves first. */
const LAG = 0.1;
/** Each photo's move fills the rest of the step, so there's no scroll distance where nothing happens. */
const HANDOVER = 1 - LAG;
/** A brief rest on the last photo before the pin releases, in steps. */
const TAIL = 0.1;
/**
 * The photos' curve: slow and smooth, but moving from the first pixel of scroll. A plain inOut
 * starts so flat it reads as stuck, so a little linear motion is mixed in to give it a start.
 */
const LINEAR_MIX = 0.2;
const gentle = (p: number) => LINEAR_MIX * p + (1 - LINEAR_MIX) * (p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p));
/** The size a photo shrinks to, and grows from. */
const SMALL = 0.3;

/** Each photo lives in its own corner of the stage and scales from that corner. */
const BR = { cls: "bottom-0 right-0", origin: "100% 100%" };
const TL = { cls: "top-0 left-0", origin: "0% 0%" };
const BL = { cls: "bottom-0 left-0", origin: "0% 100%" };
const TR = { cls: "top-0 right-0", origin: "100% 0%" };
/**
 * Corner order for a service's photos, alternating by service. Each service opens on the right,
 * as in the design, so the first photo leaves that service's background icon in view. Consecutive
 * services stay diagonal across the handover.
 */
const CORNER_ORDER = [
  [BR, TL, BL],
  [TR, BL, TL],
];

/**
 * Background icon placement, from the designer's 1500 x 800 artboard, where each icon sits at
 * 100% of its SVG size. Sizes and offsets are in 1/15ths of those points (the --u unit), so
 * they scale with the viewport. Each icon is anchored to the edge that crops it, which keeps
 * the crop as drawn at any window height.
 */
const BG_ICONS: Record<string, { w: number; h: number; left: number; top?: number; bottom?: number }> = {
  // Gear: hole and upper teeth cut off by the top of the viewport.
  "property-management": { w: 524.35, h: 568.46, left: 413, top: -241 },
  // Flame: tall, running just past the bottom of the viewport.
  plumbing: { w: 395.75, h: 625.76, left: 548, bottom: -9 },
  // Bookmark: flush to the top and cropped by the left edge.
  backflow: { w: 344.16, h: 426.38, left: -30, top: 0 },
  // Person: standing on the bottom of the viewport.
  about: { w: 358.95, h: 376.05, left: 553, bottom: 0 },
};
const inU = (points: number) => `calc(var(--u) * ${(points / 15).toFixed(3)})`;

/**
 * One-off placements for photos the corner cycle doesn't suit. The wide team shot would read as
 * a thin strip, so it fills the stage to the right edge and sits with its bottom two-thirds of
 * the way down the screen, rather than in a corner.
 */
const PHOTO_OVERRIDES: Record<string, { widthPct: number; cls: string; origin: string; bottom: string }> = {
  "/images/about-team-shop.jpg": { widthPct: 100, cls: "right-0", origin: "100% 100%", bottom: "33.33%" },
};

const steps = sections.flatMap((s, si) =>
  s.images.map((img, ii) => {
    const aspect = img.w / img.h;
    // Wider photos take more of the stage so they don't read small next to the tall ones.
    const widthPct = aspect >= 1.6 ? 92 : aspect >= 1 ? 80 : 66;
    return { si, ii, img, aspect, widthPct };
  }),
);
const firstStep = sections.map((_, si) => steps.findIndex((st) => st.si === si));
const TOTAL = steps.length - 1 + TAIL;

/**
 * Desktop services block. The text column stays pinned and vertically centred while the
 * photos cross on the stage to its right: the current one shrinks into its corner as the
 * next grows out of a different corner. Text, hairlines and the oversized background icon
 * crossfade when the next service begins. Hidden below md and under reduced motion, where
 * ServicesAccordion takes over.
 */
export default function ServicesScroller() {
  const root = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const jump = useRef<gsap.core.Timeline | null>(null);
  const lenis = useLenis();

  /** Moves the switcher's marker and marks the active button. */
  const markActive = (si: number) => {
    const el = root.current;
    if (!el) return;
    el.querySelector<HTMLElement>("[data-switcher]")?.style.setProperty("--active", String(si));
    el.querySelectorAll<HTMLElement>("[data-rail]").forEach((button, i) => {
      button.classList.toggle("is-active", i === si);
      if (i === si) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  };

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = root.current!;
        const texts = gsap.utils.toArray<HTMLElement>("[data-text]", el);
        const rules = texts.map((t) => t.querySelector<HTMLElement>(".ruled")!);
        const icons = gsap.utils.toArray<HTMLElement>("[data-bg]", el);
        const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", el);

        gsap.set(texts, { autoAlpha: 0, y: 24 });
        gsap.set(rules, { "--rule": 0 });
        gsap.set(texts[0], { autoAlpha: 1, y: 0 });
        gsap.set(rules[0], { "--rule": 1 });
        gsap.set(icons, { autoAlpha: 0, scale: 0.9 });
        gsap.set(icons[0], { autoAlpha: 1, scale: 1 });
        gsap.set(slides, { scale: SMALL, opacity: 0 });
        gsap.set(slides[0], { scale: 1, opacity: 1 });

        markActive(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${Math.round(TOTAL * window.innerHeight * STEP_VH)}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // The switcher moves as the outgoing text finishes fading, halfway through the step.
              const k = Math.floor(self.progress * TOTAL + 0.5);
              markActive(steps[Math.min(steps.length - 1, k)].si);
            },
          },
        });
        trigger.current = tl.scrollTrigger ?? null;

        steps.forEach((step, k) => {
          if (k === 0) return;
          const t = k - 1;
          const out = slides[k - 1];
          const inc = slides[k];

          // Only `to` tweens here: starting states are set once above. A fromTo would apply its
          // "from" values at creation and overwrite them, hiding the first photo at the top of the pin.

          // Outgoing shrinks into its corner, fading only at the very small end.
          tl.to(out, { scale: SMALL, duration: HANDOVER, ease: gentle }, t);
          tl.to(out, { opacity: 0, duration: HANDOVER * 0.2 }, t + HANDOVER * 0.8);

          // Incoming grows out of its own corner, opaque almost immediately.
          tl.to(inc, { scale: 1, duration: HANDOVER, ease: gentle }, t + LAG);
          tl.to(inc, { opacity: 1, duration: HANDOVER * 0.2 }, t + LAG);

          // Text and icon swap around the middle of the step, while the photos are mid-cross.
          if (step.ii === 0) {
            const s = step.si;
            tl.to(texts[s - 1], { autoAlpha: 0, y: -20, duration: 0.2 }, t + 0.3);
            tl.to(icons[s - 1], { autoAlpha: 0, scale: 0.9, duration: 0.2 }, t + 0.3);
            tl.to(texts[s], { autoAlpha: 1, y: 0, duration: 0.3 }, t + 0.52);
            tl.to(rules[s], { "--rule": 1, duration: 0.35 }, t + 0.52);
            tl.to(icons[s], { autoAlpha: 1, scale: 1, duration: 0.35 }, t + 0.52);
          }
        });
        tl.to({}, { duration: TAIL });

        return () => {
          trigger.current = null;
        };
      });
      return () => {
        jump.current?.kill();
        mm.revert();
      };
    },
    { scope: root },
  );

  /**
   * Goes straight to a service without playing the photos in between: the content fades out,
   * the scroll position and timeline jump while it's hidden, and the service's first photo
   * grows in from its corner. Scrolling carries on normally from there.
   */
  const jumpTo = (si: number) => {
    const st = trigger.current;
    const el = root.current;
    if (!st || !el) return;
    const y = st.start + (firstStep[si] / TOTAL) * (st.end - st.start);
    if (Math.abs(window.scrollY - y) < 2) return;

    const stage = el.querySelector("[data-stage]");
    const text = el.querySelector("[data-text-stack]");
    const icons = el.querySelector("[data-icons]");
    const origin = CORNER_ORDER[si % CORNER_ORDER.length][0].origin;

    markActive(si);
    jump.current?.kill();
    jump.current = gsap
      .timeline()
      .to([stage, text, icons], { opacity: 0, duration: 0.22, ease: "power2.in" })
      .add(() => {
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
        st.update();
        // Finish the scrub now, so the timeline lands on the service instead of playing up to it.
        st.getTween()?.progress(1);
        markActive(si);
      })
      .fromTo(stage, { scale: 0.9, transformOrigin: origin, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "expo.out" })
      .fromTo(text, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out" }, "<0.05")
      .fromTo(icons, { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power2.out" }, "<")
      .set([stage, text, icons], { clearProps: "transform,transformOrigin,opacity" });
  };

  return (
    <section
      ref={root}
      aria-label="Services"
      // --u is 1vw on the design's proportions; on shorter, wider windows it follows the height instead.
      className="relative hidden overflow-hidden [--u:min(1vw,1.875svh)] md:block motion-reduce:md:hidden"
    >
      {/* Oversized background icons, one per service, crossfaded by the timeline */}
      <div data-icons className="pointer-events-none absolute inset-0 select-none" aria-hidden>
        {sections.map((s, si) => {
          const icon = BG_ICONS[s.id];
          return (
            <Image
              key={s.id}
              data-bg
              src={s.bgIcon}
              alt=""
              width={Math.round(icon.w)}
              height={Math.round(icon.h)}
              priority={si === 0}
              className="absolute h-auto max-w-none"
              style={{
                width: inU(icon.w),
                left: `${((icon.left / 1500) * 100).toFixed(2)}vw`,
                top: icon.top === undefined ? undefined : inU(icon.top),
                bottom: icon.bottom === undefined ? undefined : inU(icon.bottom),
              }}
            />
          );
        })}
      </div>

      <div className="site relative grid h-svh grid-cols-12 items-center gap-x-8">
        {/* Text column */}
        <div className="relative col-span-5 flex h-full items-center lg:col-span-4">
          {/* Text blocks stacked in one grid cell; the timeline shows one at a time */}
          <div data-text-stack className="relative grid w-full">
            {sections.map((s) => (
              <div key={s.id} data-text className="[grid-area:1/1]">
                <div className="ruled flex items-start justify-between gap-6 py-4">
                  <h2 id={`${s.id}-title`} className="display text-[clamp(1.5rem,2.1vw,1.9rem)] text-navy">
                    {s.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                  <Image src={s.icon} alt="" width={44} height={44} className="size-11 shrink-0" />
                </div>
                <p className="mt-7 max-w-[42ch] text-[clamp(1.1rem,1.6vw,1.5rem)] leading-[1.45] text-ink">
                  <strong className="font-bold text-black">{s.lead}</strong>
                  {s.body}
                </p>
                <div className="mt-8">
                  <Button href={s.href} icon={<IconPlus />}>
                    Learn more
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Service switcher: an outlined pill with a navy marker that slides to the active service */}
          <nav
            data-switcher
            aria-label="Jump to a service"
            className="absolute bottom-[6svh] left-0 z-10 grid w-full min-w-[22rem] grid-cols-4 rounded-full border border-navy/30 bg-white p-1 [--active:0]"
          >
            <span
              aria-hidden
              className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/4)] rounded-full bg-navy transition-transform duration-700 ease-[var(--ease-out-expo)]"
              style={{ transform: "translateX(calc(var(--active) * 100%))" }}
            />
            {sections.map((s, si) => (
              <button
                key={s.id}
                type="button"
                data-rail
                aria-label={s.title.join(" ")}
                onClick={() => jumpTo(si)}
                className={`relative h-10 cursor-pointer rounded-full text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-500 hover:text-navy [&.is-active]:text-white [&:not(.is-active)]:hover:bg-frost ${si === 0 ? "is-active" : ""}`}
              >
                {s.navLabel}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Photo stage: full height, from the text column to the viewport edge */}
      <div data-stage className="absolute inset-y-0 left-[43%] right-0">
        {steps.map((step, k) => {
          const order = CORNER_ORDER[step.si % CORNER_ORDER.length];
          const corner = order[step.ii % order.length];
          const override = PHOTO_OVERRIDES[step.img.src];
          return (
            <div
              key={`${step.si}-${step.ii}`}
              data-slide
              className={`absolute will-change-transform ${override?.cls ?? corner.cls}`}
              style={{
                width: `min(${override?.widthPct ?? step.widthPct}%, calc(92svh * ${step.aspect.toFixed(3)}))`,
                aspectRatio: `${step.img.w} / ${step.img.h}`,
                transformOrigin: override?.origin ?? corner.origin,
                bottom: override?.bottom,
              }}
            >
              <Image
                src={step.img.src}
                alt={step.img.alt}
                fill
                sizes={`${Math.round((override?.widthPct ?? step.widthPct) * 0.57)}vw`}
                priority={k === 0}
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
