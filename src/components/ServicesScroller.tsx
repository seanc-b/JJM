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
/** Each step rests first, then hands over to the next photo. These are fractions of a step. */
const HOLD = 0.25;
const HANDOVER = 0.6;
/** The incoming photo starts this long after the outgoing one, so they cross rather than swap. */
const LAG = 1 - HOLD - HANDOVER;
/** Rest on the last photo before the pin releases, in steps. */
const TAIL = 0.35;
/** The size a photo shrinks to, and grows from. */
const SMALL = 0.3;

/** Each photo lives in its own corner of the stage and scales from that corner. */
const CORNERS = [
  { cls: "bottom-0 right-0", origin: "100% 100%" },
  { cls: "top-0 left-0", origin: "0% 0%" },
  { cls: "bottom-0 left-0", origin: "0% 100%" },
  { cls: "top-0 right-0", origin: "100% 0%" },
];

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
  const lenis = useLenis();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const el = root.current!;
        const texts = gsap.utils.toArray<HTMLElement>("[data-text]", el);
        const rules = texts.map((t) => t.querySelector<HTMLElement>(".ruled")!);
        const icons = gsap.utils.toArray<HTMLElement>("[data-bg]", el);
        const slides = gsap.utils.toArray<HTMLElement>("[data-slide]", el);
        const rails = gsap.utils.toArray<HTMLElement>("[data-rail]", el);

        gsap.set(texts, { autoAlpha: 0, y: 24 });
        gsap.set(rules, { "--rule": 0 });
        gsap.set(texts[0], { autoAlpha: 1, y: 0 });
        gsap.set(rules[0], { "--rule": 1 });
        gsap.set(icons, { autoAlpha: 0, scale: 0.9 });
        gsap.set(icons[0], { autoAlpha: 1, scale: 1 });
        gsap.set(slides, { scale: SMALL, opacity: 0 });
        gsap.set(slides[0], { scale: 1, opacity: 1 });

        const setRail = (si: number) => rails.forEach((r, i) => r.classList.toggle("is-active", i === si));
        setRail(0);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${Math.round(TOTAL * window.innerHeight * STEP_VH)}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // The rail flips as the outgoing text finishes fading (see the text tweens below).
              const k = Math.floor(self.progress * TOTAL + 1 - HOLD - 0.2);
              setRail(steps[Math.min(steps.length - 1, k)].si);
            },
          },
        });
        trigger.current = tl.scrollTrigger ?? null;

        steps.forEach((step, k) => {
          if (k === 0) return;
          const t = k - 1 + HOLD;
          const out = slides[k - 1];
          const inc = slides[k];

          // Only `to` tweens here: starting states are set once above. A fromTo would apply its
          // "from" values at creation and overwrite them, hiding the first photo at the top of the pin.

          // Outgoing shrinks into its corner, fading only at the very small end.
          tl.to(out, { scale: SMALL, duration: HANDOVER, ease: "power2.inOut" }, t);
          tl.to(out, { opacity: 0, duration: HANDOVER * 0.2 }, t + HANDOVER * 0.8);

          // Incoming grows out of its own corner, opaque almost immediately.
          tl.to(inc, { scale: 1, duration: HANDOVER, ease: "power2.inOut" }, t + LAG);
          tl.to(inc, { opacity: 1, duration: HANDOVER * 0.2 }, t + LAG);

          if (step.ii === 0) {
            const s = step.si;
            tl.to(texts[s - 1], { autoAlpha: 0, y: -20, duration: 0.2 }, t);
            tl.to(icons[s - 1], { autoAlpha: 0, scale: 0.9, duration: 0.2 }, t);
            tl.to(texts[s], { autoAlpha: 1, y: 0, duration: 0.3 }, t + 0.22);
            tl.to(rules[s], { "--rule": 1, duration: 0.35 }, t + 0.22);
            tl.to(icons[s], { autoAlpha: 1, scale: 1, duration: 0.35 }, t + 0.22);
          }
        });
        tl.to({}, { duration: TAIL });

        return () => {
          trigger.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const jumpTo = (si: number) => {
    const st = trigger.current;
    if (!st) return;
    const y = st.start + (firstStep[si] / TOTAL) * (st.end - st.start);
    if (lenis) lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section ref={root} aria-label="Services" className="relative hidden overflow-hidden md:block motion-reduce:md:hidden">
      <div className="site grid h-svh grid-cols-12 items-center gap-x-8">
        {/* Text column */}
        <div className="relative col-span-5 flex h-full items-center lg:col-span-4">
          {/* Oversized background icons, one per service, crossfaded by the timeline */}
          <div className="pointer-events-none absolute -left-[14%] top-1/2 w-[30vw] max-w-[460px] -translate-y-1/2 select-none" aria-hidden>
            <div className="grid">
              {sections.map((s, si) => (
                <Image key={s.id} data-bg src={s.bgIcon} alt="" width={520} height={568} priority={si === 0} className="h-auto w-full [grid-area:1/1]" />
              ))}
            </div>
          </div>

          {/* Text blocks stacked in one grid cell; the timeline shows one at a time */}
          <div className="relative grid w-full">
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

          {/* Progress rail */}
          <ol className="absolute bottom-[6svh] left-0 flex flex-col gap-2" aria-label="Services in this section">
            {sections.map((s, si) => (
              <li key={s.id}>
                <button
                  type="button"
                  data-rail
                  onClick={() => jumpTo(si)}
                  className="group flex items-center gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-ink transition-colors duration-500 hover:text-navy [&.is-active]:text-navy"
                >
                  <span className="block h-px w-3 bg-current transition-all duration-500 ease-[var(--ease-out-expo)] group-[.is-active]:w-7" aria-hidden />
                  {s.title.join(" ")}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Photo stage: full height, from the text column to the viewport edge */}
      <div className="absolute inset-y-0 left-[43%] right-0">
        {steps.map((step, k) => {
          const corner = CORNERS[k % CORNERS.length];
          return (
            <div
              key={`${step.si}-${step.ii}`}
              data-slide
              className={`absolute will-change-transform ${corner.cls}`}
              style={{
                width: `min(${step.widthPct}%, calc(92svh * ${step.aspect.toFixed(3)}))`,
                aspectRatio: `${step.img.w} / ${step.img.h}`,
                transformOrigin: corner.origin,
              }}
            >
              <Image
                src={step.img.src}
                alt={step.img.alt}
                fill
                sizes={`${Math.round(step.widthPct * 0.57)}vw`}
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
