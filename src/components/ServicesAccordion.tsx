"use client";

import Image from "next/image";
import { useState, type MouseEvent } from "react";
import Button from "@/components/Button";
import { useLenis } from "@/components/SmoothScroll";
import { IconChevron, IconPlus } from "@/components/Icons";
import { sections } from "@/content/home";
import { noWidow } from "@/lib/text";

/** Gap left between the sticky menu pill and an opened item's top edge. */
const PILL_GAP = 24;

/** Where an opened item's top should land: just below the sticky menu pill, measured at the time. */
function topOffset() {
  const pill = document.querySelector<HTMLElement>("[data-compact-pill]");
  return (pill?.offsetHeight ?? 52) + PILL_GAP;
}

/**
 * Services as an accordion: the first open, the rest collapsed, one open at a time.
 * Used below md and whenever the visitor prefers reduced motion.
 * Opening an item scrolls it smoothly to the top of the screen, so its title stays in view and its
 * content opens below it.
 */
export default function ServicesAccordion() {
  const [open, setOpen] = useState(sections[0].id);
  const lenis = useLenis();

  const toggle = (id: string) => (e: MouseEvent<HTMLButtonElement>) => {
    if (open === id) return setOpen("");
    const item = e.currentTarget.closest("li");
    if (item) {
      // Where the item will sit once it has settled: if the panel closing at the same time is above it,
      // everything below moves up by that panel's height while both animate.
      let top = item.getBoundingClientRect().top + window.scrollY;
      const prev = open ? document.getElementById(`panel-${open}`) : null;
      if (prev && prev.compareDocumentPosition(item) & Node.DOCUMENT_POSITION_FOLLOWING) {
        top -= prev.getBoundingClientRect().height;
      }
      const offset = topOffset();
      const target = Math.max(0, top - offset);
      // Once there, check where the item actually landed (a touch scroll still coasting, or the panels
      // still settling, can leave it short) and ease it the rest of the way below the pill.
      const settle = () => {
        const off = item.getBoundingClientRect().top - offset;
        if (Math.abs(off) < 3) return;
        if (lenis) lenis.scrollTo(window.scrollY + off, { duration: 0.5 });
        else window.scrollTo({ top: window.scrollY + off, behavior: "smooth" });
      };
      if (lenis) lenis.scrollTo(target, { duration: 1.1, onComplete: () => setTimeout(settle, 150) });
      else {
        window.scrollTo({ top: target, behavior: "smooth" });
        setTimeout(settle, 1100);
      }
    }
    setOpen(id);
  };

  return (
    <section aria-label="Services" className="md:hidden motion-reduce:md:block">
      <ul className="site my-[clamp(40px,6vw,80px)] divide-y divide-blue/40 border-y border-blue/40">
        {sections.map((s) => {
          const isOpen = open === s.id;
          return (
            <li key={s.id}>
              <h2>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`panel-${s.id}`}
                  onClick={toggle(s.id)}
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <Image src={s.icon} alt="" width={40} height={40} className="size-10 shrink-0" />
                  <span className="display text-[clamp(1.1rem,3.5vw,1.5rem)] text-navy">{s.title.join(" ")}</span>
                  <IconChevron className={`ml-auto size-5 shrink-0 text-blue transition-transform duration-500 ease-[var(--ease-out-expo)] ${isOpen ? "rotate-180" : ""}`} />
                </button>
              </h2>
              <div
                id={`panel-${s.id}`}
                inert={!isOpen}
                className="grid transition-[grid-template-rows] duration-600 ease-[var(--ease-out-expo)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className={`pb-8 transition-opacity duration-500 ${isOpen ? "opacity-100 delay-150" : "opacity-0"}`}>
                    <p className="max-w-[42ch] text-pretty text-[clamp(1.05rem,4vw,1.3rem)] leading-[1.45] text-ink">
                      <strong className="font-bold text-black">{s.lead}</strong>
                      {noWidow(s.body)}
                    </p>
                    <div className="mt-6">
                      <Button href={s.href} tone="solid" icon={<IconPlus />}>
                        {s.cta}
                      </Button>
                    </div>
                    <ul className="mt-8 flex flex-col gap-4 md:grid md:grid-cols-3">
                      {s.images.map((img) => (
                        <li key={img.src} className="frame relative aspect-[4/3] bg-frost">
                          <Image src={img.src} alt={img.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
