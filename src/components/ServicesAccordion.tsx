"use client";

import Image from "next/image";
import { useState } from "react";
import Button from "@/components/Button";
import { IconChevron, IconPlus } from "@/components/Icons";
import { sections } from "@/content/home";

/**
 * Services as an accordion: the first open, the rest collapsed, one open at a time.
 * Used below md and whenever the visitor prefers reduced motion.
 */
export default function ServicesAccordion() {
  const [open, setOpen] = useState(sections[0].id);

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
                  onClick={() => setOpen(isOpen ? "" : s.id)}
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
                    <p className="max-w-[42ch] text-[clamp(1.05rem,4vw,1.3rem)] leading-[1.45] text-ink">
                      <strong className="font-bold text-black">{s.lead}</strong>
                      {s.body}
                    </p>
                    <div className="mt-6">
                      <Button href={s.href} icon={<IconPlus />}>
                        Learn more
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
