"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import Button from "@/components/Button";
import { IconPlus } from "@/components/Icons";
import { sections } from "@/content/home";

/** Scroll distance per photo, as a fraction of the viewport height. */
const STEP_VH = 0.6;
/** Extra hold at the end of the pin, in step units. */
const TAIL = 0.6;

const steps = sections.flatMap((s, si) => s.images.map((img, ii) => ({ si, ii, img })));
const firstStep = sections.map((_, si) => steps.findIndex((st) => st.si === si));
const TOTAL = steps.length + TAIL;

/**
 * Desktop services block: the text column stays pinned and vertically centred while each
 * service's photos wipe in one by one as the visitor scrolls; text, hairlines and the
 * oversized background icon crossfade when the next service begins. Hidden below md and
 * under reduced motion, where ServicesAccordion takes over.
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
        const photos = slides.map((s) => s.querySelector("img")!);
        const rails = gsap.utils.toArray<HTMLElement>("[data-rail]", el);

        gsap.set(texts, { autoAlpha: 0, y: 24 });
        gsap.set(rules, { "--rule": 0 });
        gsap.set(texts[0], { autoAlpha: 1, y: 0 });
        gsap.set(rules[0], { "--rule": 1 });
        gsap.set(icons, { autoAlpha: 0, scale: 0.9 });
        gsap.set(icons[0], { autoAlpha: 1, scale: 1 });
        gsap.set(slides, { clipPath: "inset(100% 0 0 0)" });
        gsap.set(slides[0], { clipPath: "inset(0% 0 0 0)" });

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
              const k = Math.min(steps.length - 1, Math.floor(self.progress * TOTAL));
              setRail(steps[k].si);
            },
          },
        });
        trigger.current = tl.scrollTrigger ?? null;

        steps.forEach((step, k) => {
          if (k === 0) return;
          // Next photo wipes up over the previous one, settling from a slight zoom.
          tl.fromTo(slides[k], { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 0.5 }, k);
          tl.fromTo(photos[k], { scale: 1.12 }, { scale: 1, duration: 0.5 }, k);
          tl.to(photos[k - 1], { scale: 1.06, duration: 0.5 }, k);

          if (step.ii === 0) {
            const s = step.si;
            // Outgoing and incoming overlap a little so the column never reads empty.
            tl.to(texts[s - 1], { autoAlpha: 0, y: -20, duration: 0.3 }, k - 0.25);
            tl.to(icons[s - 1], { autoAlpha: 0, scale: 0.9, duration: 0.3 }, k - 0.25);
            tl.fromTo(texts[s], { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.4 }, k - 0.1);
            tl.fromTo(rules[s], { "--rule": 0 }, { "--rule": 1, duration: 0.5 }, k);
            tl.fromTo(icons[s], { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.5 }, k - 0.1);
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
    const y = st.start + ((firstStep[si] + 0.02) / TOTAL) * (st.end - st.start);
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

        {/* Photo frame */}
        <div className="col-span-6 col-start-7 lg:col-span-5 lg:col-start-8">
          <div className="relative h-[min(76svh,760px)] overflow-hidden bg-frost">
            {steps.map((step, k) => (
              <div key={`${step.si}-${step.ii}`} data-slide className="absolute inset-0 will-change-[clip-path]">
                <Image
                  src={step.img.src}
                  alt={step.img.alt}
                  fill
                  sizes="(min-width: 1024px) 42vw, 50vw"
                  priority={k === 0}
                  className="object-cover will-change-transform"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
