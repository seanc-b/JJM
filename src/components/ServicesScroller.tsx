"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import Button from "@/components/Button";
import { IconPlus } from "@/components/Icons";
import { sections } from "@/content/home";
import { noWidow } from "@/lib/text";

/** Scroll distance per photo, as a fraction of the viewport height. */
const STEP_VH = 0.85;
/**
 * The soft landing, as a fraction of the viewport height. Over the last stretch of the approach
 * the section's content slows to a stop instead of halting dead when the section locks. It takes
 * twice this distance of scrolling to cover this distance on screen.
 */
const DOCK_VH = 0.25;
/** How far the gear lags behind on the way in, as a fraction of the viewport height. */
const GEAR_PARALLAX_VH = 0.16;
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
/**
 * Background icons drift in from the edge they're anchored to: icons hung from the top come down,
 * icons standing on the bottom come up. This is how far, as a fraction of the icon's own height.
 * It moves `yPercent`, which GSAP keeps apart from the gear's scroll parallax on `y`.
 */
const ICON_DRIFT = 14;

/** The size a photo shrinks to, and grows from. */
const SMALL = 0.3;

/** Each photo lives in its own corner of the stage and scales from that corner. */
const BR = { cls: "bottom-0 right-0", origin: "100% 100%" };
const TL = { cls: "top-0 left-0", origin: "0% 0%" };
const BL = { cls: "bottom-0 left-0", origin: "0% 100%" };
const TR = { cls: "top-0 right-0", origin: "100% 0%" };
/**
 * Corner for each photo, by service. Chosen by simulating every handover at common desktop sizes with
 * the real photo proportions, so no two photos visibly overlap as one shrinks and the next grows. Each
 * service opens on the right, leaving its background icon in view, except About, which opens top-left:
 * its wide team photo spans the stage, and a photo shrinking on the right would cross it.
 */
const CORNER_ORDER = [
  [BR, BL, TL], // Property management
  [BR, TR, BL], // Plumbing
  [BR, BL, BR], // Backflow
  [TL, BL, BL], // About (the second, the wide team photo, has its own placement)
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
 * a thin strip, so it fills the stage to the right edge and sits with its bottom about three-quarters
 * of the way down the screen, rather than in a corner. Its sides are cropped for more height: the
 * crop only trims equipment, and the position keeps all five people in frame.
 */
const PHOTO_OVERRIDES: Record<
  string,
  { widthPct: number; cls: string; origin: string; bottom: string; ratio: number; position: string }
> = {
  "/images/about-team-shop.jpg": {
    widthPct: 100,
    cls: "right-0",
    origin: "100% 100%",
    bottom: "26%",
    ratio: 1.8,
    position: "42% 50%",
  },
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
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);
  const jump = useRef<gsap.core.Timeline | null>(null);
  /** "scroll": crossfade as the photos cross. "leave": fade the current service out. "enter": swap in at once and animate in. */
  const showService = useRef<((si: number, mode?: "scroll" | "leave" | "enter") => void) | null>(null);
  /** While a switcher jump plays, scroll updates leave the text alone; it syncs to the scroll after. */
  const jumping = useRef(false);
  const syncToScroll = useRef<(() => void) | null>(null);
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

        // Each text block's parts (heading row, paragraph, button) fade up one after another.
        const parts = texts.map((t) => Array.from(t.children) as HTMLElement[]);
        // +1 drifts up from below (icons on the bottom edge), -1 down from above (icons hung from the top).
        const drift = sections.map((s) => (BG_ICONS[s.id].top === undefined ? 1 : -1));

        // Nothing shows until the scroll position is known (see `start` below); then the service in view enters.
        gsap.set(texts, { autoAlpha: 0 });
        gsap.set(rules, { "--rule": 0 });
        gsap.set(icons, { autoAlpha: 0 });
        gsap.set(slides, { scale: SMALL, opacity: 0 });
        gsap.set(slides[0], { scale: 1, opacity: 1 });

        markActive(0);

        // Text, hairlines and the background icon switch as a timed fade, not on the scrub, so
        // stopping the scroll can never leave them half faded. The crossing point sets it off.
        // Every switch kills what the last one queued first: a delayed tween that hasn't started yet
        // survives `overwrite`, and would restart the text halfway through its entrance.
        let active = 0;
        let scrollService = 0;
        // The gear's parallax tween animates `y` on icons[0], so icon tweens are only killed on other properties.
        const killQueued = () => {
          gsap.killTweensOf(texts, "autoAlpha,opacity,visibility,y");
          gsap.killTweensOf(parts.flat(), "autoAlpha,opacity,visibility,y");
          gsap.killTweensOf(rules, "--rule");
          gsap.killTweensOf(icons, "autoAlpha,opacity,visibility,yPercent");
        };
        const leave = (i: number) => {
          gsap.to(texts[i], { autoAlpha: 0, y: -12, duration: 0.35, ease: "power2.in" });
          gsap.to(icons[i], { autoAlpha: 0, yPercent: drift[i] * (ICON_DRIFT / 2), duration: 0.45, ease: "power2.in" });
        };
        const enter = (i: number, delay: number) => {
          gsap.set(texts[i], { autoAlpha: 1, y: 0 });
          gsap.fromTo(parts[i], { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.9, delay, stagger: 0.09, ease: "power3.out" });
          gsap.fromTo(rules[i], { "--rule": 0 }, { "--rule": 1, duration: 1.1, delay, ease: "power3.out" });
          gsap.fromTo(
            icons[i],
            { autoAlpha: 0, yPercent: drift[i] * ICON_DRIFT },
            { autoAlpha: 1, yPercent: 0, duration: 1.4, delay: delay + 0.05, ease: "power3.out" },
          );
        };
        let ready = false;
        showService.current = (si, mode = "scroll") => {
          if (mode === "scroll") scrollService = si;
          if (mode === "scroll" && (jumping.current || !ready)) return;
          if (mode === "leave") {
            killQueued();
            leave(active);
            return;
          }
          if (si === active && mode === "scroll") return;
          killQueued();
          const prev = active;
          active = si;
          markActive(si);
          if (mode === "enter") {
            texts.forEach((t, i) => i !== si && gsap.set(t, { autoAlpha: 0, y: 0 }));
            rules.forEach((r, i) => i !== si && gsap.set(r, { "--rule": 0 }));
            icons.forEach((c, i) => i !== si && gsap.set(c, { autoAlpha: 0, yPercent: 0 }));
            enter(si, 0);
            return;
          }
          leave(prev);
          enter(si, 0.25);
        };
        // After a jump: if the scroll moved on to another service meanwhile, crossfade to it.
        syncToScroll.current = () => showService.current?.(scrollService);

        const dockDistance = () => window.innerHeight * DOCK_VH;
        const dock = el.querySelector("[data-dock]");

        // Soft landing. The section locks (position: sticky) halfway through this range. The offset
        // grows as it approaches and shrinks after, in step with the section's own travel stopping,
        // so the content's speed on screen falls smoothly from scroll speed to zero, with no kink.
        ScrollTrigger.create({
          trigger: el,
          start: () => `top ${dockDistance()}px`,
          end: () => `top+=${dockDistance()} top`,
          invalidateOnRefresh: true,
          onUpdate: ({ progress: p }) => {
            gsap.set(dock, { y: dockDistance() * (p < 0.5 ? p * p : (1 - p) * (1 - p)) });
          },
        });

        // The gear lags behind the page on the way in, settling as the landing finishes.
        gsap.fromTo(
          icons[0],
          { y: () => -window.innerHeight * GEAR_PARALLAX_VH },
          {
            y: 0,
            ease: "power1.out",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: () => `top+=${dockDistance()} top`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            // Photos start as the landing ends, so scrolling always moves something.
            start: () => `top+=${dockDistance()} top`,
            end: "bottom bottom",
            scrub: 0.5,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // The service changes halfway through the step, as the two photos cross.
              const k = Math.floor(self.progress * TOTAL + 0.5);
              showService.current?.(steps[Math.min(steps.length - 1, k)].si);
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

          // Outgoing shrinks into its corner and fades as it goes, gone by halfway, well before the crossing.
          tl.to(out, { scale: SMALL, duration: HANDOVER, ease: gentle }, t);
          tl.to(out, { opacity: 0, duration: HANDOVER * 0.4 }, t + HANDOVER * 0.1);

          // Incoming grows out of its own corner, opaque almost immediately.
          tl.to(inc, { scale: 1, duration: HANDOVER, ease: gentle }, t + LAG);
          tl.to(inc, { opacity: 1, duration: HANDOVER * 0.2 }, t + LAG);
        });
        tl.to({}, { duration: TAIL });

        // On load (and so after a refresh's restored scroll position), go straight to the service in view:
        // photos land on it at once and fade in, and only that service's text and icon play their entrance.
        // Until then the section shows nothing (globals.css) and scroll updates don't crossfade.
        const stage = el.querySelector("[data-stage]");
        let raf = 0;
        const start = () => {
          raf = requestAnimationFrame(() => {
            const st = tl.scrollTrigger;
            if (!st) return;
            st.update();
            st.getTween()?.progress(1);
            const k = Math.floor(st.progress * TOTAL + 0.5);
            ready = true;
            showService.current?.(steps[Math.min(steps.length - 1, k)].si, "enter");
            el.dataset.ready = "";
            gsap.fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: "power2.out", clearProps: "opacity" });
          });
        };
        if (document.readyState === "complete") start();
        else window.addEventListener("load", start, { once: true });

        return () => {
          trigger.current = null;
          window.removeEventListener("load", start);
          cancelAnimationFrame(raf);
          delete el.dataset.ready;
        };
      });
      return () => {
        jump.current?.kill();
        jumping.current = false;
        mm.revert();
      };
    },
    { scope: root },
  );

  /**
   * Goes straight to a service without playing the photos in between: the current text drifts up and
   * fades while the photos fade, the scroll position and timeline jump while they're hidden, then the
   * new text rises in and the service's first photo grows from its corner. Scrolling carries on from there.
   */
  const jumpTo = (si: number) => {
    const st = trigger.current;
    const el = root.current;
    if (!st || !el) return;
    const y = st.start + (firstStep[si] / TOTAL) * (st.end - st.start);
    if (Math.abs(window.scrollY - y) < 2) return;

    const stage = el.querySelector("[data-stage]");
    const origin = CORNER_ORDER[si % CORNER_ORDER.length][0].origin;

    markActive(si);
    jump.current?.kill();
    jumping.current = true;
    showService.current?.(si, "leave");
    jump.current = gsap
      .timeline()
      .to(stage, { opacity: 0, duration: 0.35, ease: "power2.in" })
      .add(() => {
        // Swap the text before scrolling. Lenis reports the jump to ScrollTrigger synchronously, and
        // its update then finds this service already showing instead of starting a second entrance.
        showService.current?.(si, "enter");
        if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
        else window.scrollTo(0, y);
        st.update();
        // Finish the scrub now, so the timeline lands on the service instead of playing up to it.
        st.getTween()?.progress(1);
      })
      .fromTo(stage, { scale: 0.9, transformOrigin: origin, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "expo.out" })
      .set(stage, { clearProps: "transform,transformOrigin,opacity" })
      // Hand the text back to the scroll once the new service has settled.
      .add(() => {
        jumping.current = false;
        syncToScroll.current?.();
      }, "+=0.3");
  };

  return (
    // This outer box sets the scroll length; the section sticks to the top of the viewport inside it.
    <div
      ref={root}
      data-services
      className="hidden md:block motion-reduce:md:hidden"
      style={{ height: `calc(100svh + ${((DOCK_VH + TOTAL * STEP_VH) * 100).toFixed(2)}svh)` }}
    >
      <section
        aria-label="Services"
        // --u is 1vw on the design's proportions; on shorter, wider windows it follows the height instead.
        className="sticky top-0 h-svh overflow-hidden [--u:min(1vw,1.875svh)]"
      >
        <div data-dock className="relative h-full">
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
                    <p className="mt-7 max-w-[42ch] text-pretty text-[clamp(1.1rem,1.6vw,1.5rem)] leading-[1.45] text-ink">
                      <strong className="font-bold text-black">{s.lead}</strong>
                      {noWidow(s.body)}
                    </p>
                    <div className="mt-8">
                      <Button href={s.href} icon={<IconPlus />}>
                        Learn more
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Service switcher: hairlines top and bottom, like the section headings, with a heavier rule that slides to the active service */}
              <nav
                data-switcher
                aria-label="Jump to a service"
                className="absolute bottom-[6svh] left-0 z-10 grid w-full min-w-[22rem] grid-cols-4 border-y border-blue/45 bg-white [--active:0]"
              >
                <span
                  aria-hidden
                  className="absolute -bottom-px left-0 h-0.5 w-1/4 bg-blue transition-transform duration-700 ease-[var(--ease-out-expo)]"
                  style={{ transform: "translateX(calc(var(--active) * 100%))" }}
                />
                {sections.map((s, si) => (
                  <button
                    key={s.id}
                    type="button"
                    data-rail
                    aria-label={s.title.join(" ")}
                    onClick={() => jumpTo(si)}
                    className={`relative h-11 cursor-pointer text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-ink transition-colors duration-500 hover:text-navy [&.is-active]:text-blue ${si === 0 ? "is-active" : ""}`}
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
              const ratio = override?.ratio ?? step.aspect;
              const widthPct = override?.widthPct ?? step.widthPct;
              return (
                <div
                  key={`${step.si}-${step.ii}`}
                  data-slide
                  className={`absolute will-change-transform ${override?.cls ?? corner.cls}`}
                  style={{
                    width: `min(${widthPct}%, calc(92svh * ${ratio.toFixed(3)}))`,
                    aspectRatio: ratio.toFixed(3),
                    transformOrigin: override?.origin ?? corner.origin,
                    bottom: override?.bottom,
                  }}
                >
                  <Image
                    src={step.img.src}
                    alt={step.img.alt}
                    fill
                    // A cropped photo draws wider than its box, so it asks for a proportionally larger file.
                    sizes={`${Math.round(widthPct * 0.57 * (step.aspect / ratio))}vw`}
                    priority={k === 0}
                    className="object-cover"
                    style={{ objectPosition: override?.position }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
