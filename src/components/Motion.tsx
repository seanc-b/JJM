"use client";

import { gsap, ScrollTrigger, useGSAP, EASE } from "@/lib/gsap";

/**
 * One place for the page's scroll choreography. Elements opt in with data attributes:
 *  - data-reveal          fade/rise once on enter (stagger within a batch)
 *  - data-rise            headline lines rise from a clipped box ("load" = on mount, else on enter)
 *  - data-wipe            clip-path wipe upward + inner image settles from 1.15 scale
 *  - data-parallax="n"    inner element drifts n% of its height while its parent scrolls through
 *    data-parallax-lag="s" optional: it eases after the scroll, catching up over s seconds
 */
/**
 * With Cache Components, Next keeps up to three visited pages in the DOM, hidden by React's <Activity>
 * (an inline `display: none !important` on each top-level node), and evicts the oldest. A document-wide
 * query would also pick up those hidden pages, leaving this page's ScrollTriggers on elements that are
 * removed later, which crashes ScrollTrigger ("reading 'end'"). So skip anything inside a hidden page;
 * each page sets up its own Motion again when it is shown.
 */
const HIDDEN_PAGE = '[style*="display: none"]';
function onPage(selector: string) {
  return gsap.utils.toArray<HTMLElement>(selector).filter((el) => !el.closest(HIDDEN_PAGE));
}

/**
 * Arrival sequence: the hero photo fades up from navy, then the headline rises, then the rest of the
 * first screen. After an in-app navigation it starts a beat later, once the old page has faded out
 * (PageTransition). Module state survives client navigations, so this tells the first load apart.
 */
let arrivedBefore = false;

export default function Motion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    const start = arrivedBefore ? 0.3 : 0.1;
    arrivedBefore = true;

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(onPage("[data-hero-photo]"), { opacity: 1, duration: 1.2, ease: "power2.out", delay: start });

      // Reveals: "load" ones run on mount (first viewport); the rest on scroll-enter.
      const reveals = onPage("[data-reveal]");
      gsap.set(reveals, { y: 28 });
      const onLoad = reveals.filter((el) => el.dataset.reveal === "load");
      const onScroll = reveals.filter((el) => el.dataset.reveal !== "load");
      gsap.to(onLoad, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.12, delay: start + 1 });
      ScrollTrigger.batch(onScroll, {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.09, overwrite: true }),
      });

      // Rising headline lines
      onPage("[data-rise]").forEach((block) => {
        const lines = block.querySelectorAll<HTMLElement>(":scope > span > span");
        // Take over from the CSS initial state with GSAP's own transform so the tween owns it.
        gsap.set(lines, { yPercent: 115, y: 0 });
        const tween = { yPercent: 0, duration: 1.3, ease: EASE, stagger: 0.09 };
        if (block.dataset.rise === "load") {
          gsap.to(lines, { ...tween, delay: start + 0.5 });
        } else {
          // Wait until the whole heading is on screen, so the rise is seen from the first line to the last.
          gsap.to(lines, { ...tween, scrollTrigger: { trigger: block, start: "center 70%", once: true } });
        }
      });

      // Heading hairlines draw in from the left
      onPage("[data-rules]").forEach((block) => {
        gsap.to(block, { "--rule": 1, duration: 1.4, ease: EASE, scrollTrigger: { trigger: block, start: "top 88%", once: true } });
      });

      // Photo wipes
      onPage("[data-wipe]").forEach((box) => {
        const img = box.querySelector("img");
        const tl = gsap.timeline({ scrollTrigger: { trigger: box, start: "top 82%", once: true } });
        tl.to(box, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: EASE }, 0);
        if (img) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: EASE }, 0);
      });

      // Footer contact chips: each chip's white wipes in from the left, a beat after the one above, and
      // its label and value rise into their masks as the white finishes. Like the news captions.
      onPage("[data-chip-intro]").forEach((group) => {
        const chips = Array.from(group.querySelectorAll<HTMLElement>("[data-chip-bg]")).map((bg) => bg.parentElement!);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: group, start: "top 88%", once: true },
          onComplete: () => {
            group.dataset.risen = "";
            gsap.set(group.querySelectorAll("[data-chip-bg], [data-chip-text]"), { clearProps: "clipPath,transform" });
          },
        });
        chips.forEach((chip, i) => {
          tl.fromTo(
            chip.querySelector("[data-chip-bg]"),
            { clipPath: "inset(0% 100% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.out" },
            i * 0.1,
          );
          tl.fromTo(
            chip.querySelectorAll("[data-chip-text]"),
            { yPercent: 110, y: 0 },
            { yPercent: 0, duration: 1.1, ease: EASE, stagger: 0.04 },
            0.3 + i * 0.1,
          );
        });
      });

      // Parallax
      onPage("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax ?? 8);
        const scrub = el.dataset.parallaxLag ? Number(el.dataset.parallaxLag) : true;
        const trigger = el.parentElement ?? el;
        gsap.fromTo(
          el,
          { yPercent: -amount },
          { yPercent: amount, ease: "none", scrollTrigger: { trigger, start: "top bottom", end: "bottom top", scrub } },
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
