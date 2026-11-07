"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, EASE, motionAllowed } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import { company, nav, type NavLink } from "@/content/home";
import { IconClose, IconMail, IconMenu, IconPerson, IconPhone } from "@/components/Icons";
import Placeholder from "@/components/Placeholder";

const menuIcon: Record<NavLink["icon"], string | null> = {
  property: "/icons/section-property.svg",
  flame: "/icons/section-flame.svg",
  backflow: "/icons/section-backflow.svg",
  about: "/icons/section-about.svg",
  contact: null, // no icon supplied yet; drawn placeholder below
};

export default function Header() {
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // Compact pill once the hero has mostly scrolled away.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setCompact(window.scrollY > window.innerHeight * 0.55);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const close = useCallback(() => setOpen(false), []);

  // Lock scroll, Escape to close, return focus.
  useEffect(() => {
    if (!open) return;
    const opener = menuButtonRef.current;
    lenis?.stop();
    document.documentElement.classList.add("overflow-hidden");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    firstLinkRef.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.classList.remove("overflow-hidden");
      window.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open, close, lenis]);

  // Menu entrance
  useGSAP(
    () => {
      if (!open || !menuRef.current || !motionAllowed()) return;
      const panels = menuRef.current.querySelectorAll("[data-panel]");
      const items = menuRef.current.querySelectorAll("[data-item]");
      gsap.set(menuRef.current, { autoAlpha: 1 });
      gsap.fromTo(panels, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: EASE, stagger: 0.06 });
      gsap.fromTo(items, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: EASE, stagger: 0.05, delay: 0.2 });
    },
    { dependencies: [open] },
  );

  return (
    <>
      {/* Full header over the hero */}
      <header className="absolute inset-x-0 top-0 z-30 text-white">
        <div className="site flex h-[84px] items-center justify-between border-b border-white/35">
          <Link href="/" aria-label="JJM Mechanical Group, home" className="block transition-opacity duration-300 hover:opacity-80">
            <Image src="/brand/jjm-logo-white.svg" alt="" width={140} height={45} priority className="h-[42px] w-auto md:h-[46px]" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-[clamp(18px,2.2vw,34px)]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="navlink text-[0.8125rem] font-semibold uppercase tracking-[0.06em] xl:text-[0.875rem]">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <a href={`mailto:${company.email}`} aria-label="Email JJM" className="hidden transition-opacity duration-300 hover:opacity-70 sm:block">
              <IconMail className="size-6" />
            </a>
            <a href={company.phoneHref} aria-label={`Call ${company.phone}`} className="hidden transition-opacity duration-300 hover:opacity-70 sm:block">
              <IconPhone className="size-6" />
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="-mr-2 p-2 lg:hidden"
            >
              <IconMenu className="size-7" />
            </button>
          </div>
        </div>
      </header>

      {/* Compact pill */}
      <div
        className={`fixed left-1/2 top-0 z-40 -translate-x-1/2 transition-transform duration-700 ease-[var(--ease-out-expo)] ${
          compact || open ? "translate-y-0" : "-translate-y-[120%]"
        }`}
      >
        <div className="flex items-center gap-5 rounded-b-md bg-navy/80 px-6 py-2.5 text-white shadow-[0_12px_40px_-12px_rgba(23,53,93,0.6)] backdrop-blur-md">
          <Link href="/" className="text-[1.6rem] font-bold leading-none tracking-[0.04em]" aria-label="JJM Mechanical Group, home">
            JJM
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            className="p-1 transition-opacity duration-300 hover:opacity-70"
          >
            {open ? <IconClose className="size-6" /> : <IconMenu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Menu */}
      {open && (
        <div className="fixed inset-0 z-[35]" role="dialog" aria-modal="true" aria-label="Site menu" id="site-menu">
          <button type="button" aria-label="Close menu" onClick={close} className="absolute inset-0 bg-navy/30 backdrop-blur-[2px]" />
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="absolute right-[clamp(16px,4vw,48px)] top-5 z-10 p-2 text-white transition-opacity duration-300 hover:opacity-70"
          >
            <IconClose className="size-7" />
          </button>

          <div ref={menuRef} className="invisible absolute left-1/2 top-[56px] grid w-[min(92vw,820px)] -translate-x-1/2 grid-cols-1 overflow-hidden text-white md:grid-cols-2">
            <div data-panel className="bg-blue px-[clamp(20px,4vw,44px)] py-8">
              <ul className="divide-y divide-dotted divide-white/40">
                {nav.map((item, i) => (
                  <li key={item.href} data-item>
                    <Link
                      ref={i === 0 ? firstLinkRef : undefined}
                      href={item.href}
                      onClick={close}
                      className="group flex items-center gap-4 py-3.5 text-[0.9375rem] font-bold uppercase tracking-[0.06em] transition-colors duration-300 hover:text-navy"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-blue transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110">
                        {menuIcon[item.icon] ? (
                          <Image src={menuIcon[item.icon]!} alt="" width={22} height={22} className="size-[22px]" />
                        ) : (
                          <IconPerson className="size-[18px]" />
                        )}
                      </span>
                      {item.label}
                      {!menuIcon[item.icon] && <Placeholder className="ml-auto" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div data-panel className="relative overflow-hidden bg-navy px-[clamp(20px,4vw,44px)] py-10 md:py-16">
              <Image src="/icons/bg-flame.svg" alt="" width={396} height={626} aria-hidden className="pointer-events-none absolute -right-10 -top-8 h-[130%] w-auto opacity-70 brightness-200" />
              <p data-item className="display relative max-w-[18ch] text-[1.25rem] leading-[1.15] md:text-[1.375rem]">
                We provide comprehensive plumbing, heating, HVAC, and gas services.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
