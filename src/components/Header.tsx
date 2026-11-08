"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, useGSAP, EASE, motionAllowed } from "@/lib/gsap";
import { useLenis } from "@/components/SmoothScroll";
import { company, nav, type NavLink } from "@/content/home";
import CopyButton from "@/components/CopyButton";
import { IconClose, IconMail, IconMenu, IconPhone } from "@/components/Icons";

/** White ring icons for the menu, with a navy twin shown on hover and for the current page. */
const menuIcon = (icon: NavLink["icon"], tone: "white" | "navy") => `/icons/menu/${icon}-${tone}.svg`;

/**
 * A header contact icon. Clicking it does the native thing (open mail, dial). On devices with a mouse or
 * trackpad, hovering or focusing it shows a small panel with the address or number and a Copy button
 * (.contact-pop in globals.css); the panel's top padding bridges the gap so the pointer can reach it.
 */
function ContactIcon({
  href,
  label,
  value,
  copyLabel,
  children,
  className = "hidden sm:block",
}: {
  href: string;
  label: string;
  value: string;
  copyLabel: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`contact-pop-trigger relative ${className}`}>
      <a href={href} aria-label={label} className="block transition-opacity duration-300 hover:opacity-70">
        {children}
      </a>
      <div className="contact-pop absolute right-0 top-full z-40 pt-3">
        <div className="flex items-center gap-3 whitespace-nowrap bg-white py-1.5 pl-4 pr-1.5 text-navy shadow-[0_12px_32px_-12px_rgba(23,53,93,0.5)]">
          <span className="text-[0.9375rem] font-semibold">{value}</span>
          <CopyButton
            value={value}
            label={copyLabel}
            text="Copy"
            className="inline-flex cursor-pointer items-center gap-1.5 bg-navy px-2.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-blue"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * The nav dot pops in on a fresh page load only (.navdot-pop in globals.css). After a client navigation the
 * page-change animation moves or scales it instead, so later pages skip the pop. Module state survives
 * client navigations; on the server it is never set, so the first render matches on both sides.
 */
let firstPath: string | null = null;
let navigated = false;
function isFirstPage(pathname: string) {
  if (typeof window === "undefined") return true;
  if (firstPath === null) firstPath = pathname;
  else if (pathname !== firstPath) navigated = true;
  return !navigated;
}

export default function Header() {
  const [compact, setCompact] = useState(false);
  // Whether the header (and its dot) is still on screen; see the nav dot below.
  const [headerInView, setHeaderInView] = useState(true);
  const [open, setOpen] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const popDot = isFirstPage(pathname);
  // Compact pill once the hero has mostly scrolled away.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setCompact(window.scrollY > window.innerHeight * 0.55);
      setHeaderInView(window.scrollY < 60);
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
    // Everything outside the dialog becomes inert so Tab stays within the menu.
    const outside = Array.from(document.querySelectorAll<HTMLElement>("main, footer, header"));
    outside.forEach((el) => (el.inert = true));
    lenis?.stop();
    document.documentElement.classList.add("overflow-hidden");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    firstLinkRef.current?.focus();
    return () => {
      outside.forEach((el) => (el.inert = false));
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
      gsap.fromTo(panels, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: EASE, stagger: 0.06, clearProps: "clipPath" });
      gsap.fromTo(items, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: EASE, stagger: 0.05, delay: 0.2 });
    },
    { dependencies: [open] },
  );

  return (
    <>
      {/* Full header over the hero */}
      <header style={{ viewTransitionName: "site-header" }} className="absolute inset-x-0 top-0 z-30 border-b border-white/35 text-white">
        <div className="site flex h-[84px] items-center justify-between">
          <Link href="/" aria-label="JJM Mechanical Group, home" className="block transition-opacity duration-300 hover:opacity-80">
            <Image src="/brand/jjm-logo-white.svg" alt="" width={140} height={45} priority className="h-[42px] w-auto md:h-[46px]" />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="navlist flex items-center gap-[clamp(18px,2.2vw,34px)]">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} aria-current={item.href === pathname ? "page" : undefined} className="navlink text-[0.8125rem] font-semibold uppercase tracking-[0.06em] xl:text-[0.875rem]">
                    {item.label}
                    {/* One dot per page, under the current link. Its view-transition name lets the browser
                        glide it from the old link to the new one as the page changes (globals.css). Once the
                        header has scrolled away (say, leaving through the sticky menu) the old dot drops its
                        name, so it doesn't swoop in from above the screen: the new one scales up in place. */}
                    {item.href === pathname && (
                      <span aria-hidden className={popDot ? "navdot navdot-pop" : "navdot"} style={{ viewTransitionName: headerInView ? "nav-dot" : "none" }} />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-5">
            <ContactIcon href={`mailto:${company.email}`} label="Email JJM" value={company.email} copyLabel="email address">
              <IconMail className="size-6" />
            </ContactIcon>
            <ContactIcon href={company.phoneHref} label={`Call ${company.phone}`} value={company.phone} copyLabel="phone number">
              <IconPhone className="size-6" />
            </ContactIcon>
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
        data-compact-pill
        className={`fixed left-1/2 top-0 z-40 -translate-x-1/2 transition-transform duration-700 ease-[var(--ease-out-expo)] ${
          compact || open ? "translate-y-0" : "-translate-y-[120%]"
        }`}
      >
        {/* The whole pill is one button that opens and closes the menu. */}
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          className="flex cursor-pointer items-center gap-5 bg-navy px-6 py-2.5 text-white shadow-[0_12px_40px_-12px_rgba(23,53,93,0.6)] transition-colors duration-300 hover:bg-blue"
        >
          <Image src="/brand/jjm-wordmark-white.svg" alt="" width={88} height={23} className="h-[24px] w-auto" />
          <span className="p-1">{open ? <IconClose className="size-6" /> : <IconMenu className="size-6" />}</span>
        </button>
      </div>

      {/* Sticky call button, top right on phones, arriving with the pill once the full header has scrolled
          away. Desktop has none: the header's phone icon and the menu cover it. */}
      <a
        href={company.phoneHref}
        aria-label={`Call ${company.phone}`}
        tabIndex={compact && !open ? undefined : -1}
        className={`fixed right-[clamp(12px,2vw,24px)] top-0 z-40 flex items-center gap-2.5 bg-navy px-3.5 py-3.5 text-white shadow-[0_12px_40px_-12px_rgba(23,53,93,0.6)] transition-[transform,background-color] duration-700 ease-[var(--ease-out-expo)] hover:bg-blue md:hidden ${
          compact && !open ? "translate-y-0" : "-translate-y-[120%]"
        }`}
      >
        <IconPhone className="size-6" />
      </a>

      {/* Menu */}
      {open && (
        <div className="fixed inset-0 z-[35]" role="dialog" aria-modal="true" aria-label="Site menu" id="site-menu">
          <button type="button" aria-label="Close menu" onClick={close} className="absolute inset-0 bg-navy/30 backdrop-blur-[8px]" />

          <div ref={menuRef} className="invisible absolute left-1/2 top-[56px] grid w-[min(92vw,812px)] -translate-x-1/2 grid-cols-1 text-white md:grid-cols-[402fr_410fr]">
            <div data-panel className="bg-blue py-[25px] pl-[clamp(20px,3vw,38px)] pr-[clamp(20px,3vw,40px)]">
              <ul className="divide-y divide-dashed divide-white/35">
                {nav.map((item, i) => {
                  const current = item.href === pathname;
                  return (
                    <li key={item.href} data-item>
                      <Link
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={item.href}
                        onClick={close}
                        aria-current={current ? "page" : undefined}
                        className="group flex items-center gap-3 whitespace-nowrap py-[10px] text-[1.0625rem] font-bold uppercase leading-none tracking-[0.02em] transition-colors duration-300 hover:text-navy aria-[current=page]:text-navy md:text-[1.25rem]"
                      >
                        <span className="relative size-7 shrink-0 transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110">
                          <Image src={menuIcon(item.icon, "white")} alt="" width={28} height={28} className="absolute inset-0 size-full transition-opacity duration-300 group-hover:opacity-0 group-aria-[current=page]:opacity-0" />
                          <Image src={menuIcon(item.icon, "navy")} alt="" width={28} height={28} className="absolute inset-0 size-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-aria-[current=page]:opacity-100" />
                        </span>
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div data-panel className="relative flex items-center bg-navy pb-16 pt-10 pl-[clamp(20px,6vw,90px)] pr-[clamp(20px,3vw,44px)] md:py-0">
              {/* Placed from the mockup: flame tip near the top right, rings centred low on the left edge. */}
              {/* Clipped in a layer of its own, not by the panel, so the contact icons' panels can open below the box. */}
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <Image src="/icons/bg-jjm-mark.svg" alt="" width={571} height={557} className="absolute left-[4.4%] top-[-40%] h-[211%] w-auto max-w-none opacity-20" />
              </div>
              <p data-item className="relative text-[1.25rem] font-bold uppercase leading-[1.04] md:text-[1.5rem]">
                We provide comprehensive plumbing, heating, HVAC, and A&#8209;Gas services.
              </p>
              {/* Email and phone as icons in the bottom-right corner, so the statement stays centred. As in the
                  header, hovering (mouse or trackpad) shows the detail with a Copy button; a tap mails or dials. Email
                  sits in the corner so its wider panel, opening right-aligned below it, lines up with the box. */}
              <div data-item className="absolute bottom-[clamp(16px,2.2vw,28px)] right-[clamp(16px,2.2vw,28px)] flex items-center gap-5">
                <ContactIcon href={company.phoneHref} label={`Call ${company.phone}`} value={company.phone} copyLabel="phone number" className="block">
                  <IconPhone className="size-6" />
                </ContactIcon>
                <ContactIcon href={`mailto:${company.email}`} label="Email JJM" value={company.email} copyLabel="email address" className="block">
                  <IconMail className="size-6" />
                </ContactIcon>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
