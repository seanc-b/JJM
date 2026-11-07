"use client";

import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";

/**
 * One place for the page's scroll choreography. Elements opt in with data attributes:
 *  - data-reveal          fade/rise once on enter (stagger within a batch)
 *  - data-rise            headline lines rise from a clipped box ("load" = on mount, else on enter)
 *  - data-wipe            clip-path wipe upward + inner image settles from 1.15 scale
 *  - data-parallax="n"    inner element drifts n% of its height while its parent scrolls through
 */
export default function Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Reveals: "load" ones run on mount (first viewport); the rest on scroll-enter.
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      gsap.set(reveals, { y: 28 });
      const onLoad = reveals.filter((el) => el.dataset.reveal === "load");
      const onScroll = reveals.filter((el) => el.dataset.reveal !== "load");
      gsap.to(onLoad, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.12, delay: 0.7 });
      ScrollTrigger.batch(onScroll, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.09, overwrite: true }),
      });

      // Rising headline lines
      gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((block) => {
        const lines = block.querySelectorAll<HTMLElement>(":scope > span > span");
        // Take over from the CSS initial state with GSAP's own transform so the tween owns it.
        gsap.set(lines, { yPercent: 115, y: 0 });
        const tween = { yPercent: 0, duration: 1.3, ease: EASE, stagger: 0.09 };
        if (block.dataset.rise === "load") {
          gsap.to(lines, { ...tween, delay: 0.25 });
        } else {
          gsap.to(lines, { ...tween, scrollTrigger: { trigger: block, start: "top 85%", once: true } });
        }
      });

      // Photo wipes
      gsap.utils.toArray<HTMLElement>("[data-wipe]").forEach((box) => {
        const img = box.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: box, start: "top 82%", once: true } });
        tl.to(box, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: EASE }, 0);
        if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: EASE }, 0);
      });

      // Parallax
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax ?? 8);
        const trigger = el.parentElement ?? el;
        gsap.fromTo(
          el,
          { yPercent: -amount },
          { yPercent: amount, ease: "none", scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      document.fonts?.ready.then(refresh);
      return () => window.removeEventListener("load", refresh);
    });

    return () => mm.revert();
  });

  return null;
}
