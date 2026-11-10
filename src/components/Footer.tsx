import Image from "next/image";
import Link from "next/link";
import CopyButton from "@/components/CopyButton";
import LogoStrip from "@/components/LogoStrip";
import { IconInstagram, IconPhone } from "@/components/Icons";
import { company, nav, partners, sameDay } from "@/content/home";

/**
 * A white contact chip. Its white is a layer of its own (data-chip-bg) and its label and value each sit in
 * a mask (data-chip-text), so the panel's entrance can wipe the white in and raise the text (Motion).
 * A linked chip also carries a navy copy of itself, white text and all, laid exactly on top and clipped to
 * nothing; hovering or focusing it opens the clip from left to right (.wipe in globals.css).
 */
function Chip({ label, value, href, copy }: { label: string; value: string; href?: string; copy?: string }) {
  const layout = "inline-flex flex-wrap items-baseline gap-x-3 px-5 py-2.5";
  const labelCls = "label";
  const valueCls = "text-[clamp(1rem,1.3vw,1.3rem)] font-semibold";
  // The mask clips only below each text's box, so the text can rise into it without being seen first.
  const masked = (cls: string, tone: string, text: string) => (
    <span className={`relative ${cls} [clip-path:inset(-0.5em_-0.5em_0_-0.5em)]`}>
      <span data-chip-text className={`block ${tone}`}>
        {text}
      </span>
    </span>
  );
  const plain = (tone: "dark" | "light") => (
    <>
      <span className={`${labelCls} ${tone === "dark" ? "text-ink" : "text-white"}`}>{label}</span>
      <span className={`${valueCls} ${tone === "dark" ? "text-navy" : "text-white"}`}>{value}</span>
    </>
  );
  const content = (
    <>
      <span data-chip-bg aria-hidden className="absolute inset-0 bg-white" />
      {masked(labelCls, "text-ink", label)}
      {masked(valueCls, "text-navy", value)}
    </>
  );
  if (!href) return <span className={`relative ${layout}`}>{content}</span>;
  const link = (
    <a href={href} className={`wipe relative ${layout}`}>
      {content}
      <span aria-hidden className={`wipe-fill absolute inset-0 ${layout} bg-navy`}>
        {plain("light")}
      </span>
    </a>
  );
  if (!copy) return link;
  // The link still opens mail or dials; a copy button sits just off its right edge, showing on hover or
  // focus, on devices with a mouse or trackpad only (touch taps do the native thing). The padding bridges
  // the gap so the pointer can cross to it without the chip losing hover.
  return (
    <span className="group/chip relative inline-flex">
      {link}
      <span className="absolute inset-y-0 left-full hidden pl-1.5 [@media(hover:hover)_and_(pointer:fine)]:flex">
        <CopyButton
          value={copy}
          label={`${label.toLowerCase()} ${copy.includes("@") ? "email" : "phone number"}`}
          className="flex aspect-square h-full cursor-pointer items-center justify-center bg-white text-navy opacity-0 transition-[opacity,background-color,color] duration-300 group-hover/chip:opacity-100 hover:bg-navy hover:text-white focus-visible:opacity-100"
        />
      </span>
    </span>
  );
}

/**
 * The phone version of a contact chip: the white hugs the text, one bar per line like the news captions, with
 * the label on a short bar of its own above the value. No hover wipe (touch has no hover); a tap darkens it.
 */
function LineChip({ label, value, href }: { label: string; value: string; href: string }) {
  const bar = "box-decoration-clone bg-white px-3 transition-colors duration-200 group-active:bg-frost";
  return (
    <a href={href} className="group block">
      <span className={`label inline-block pb-0.5 pt-2 text-ink ${bar}`}>{label}</span>
      <br />
      <span className={`py-[0.3em] text-[1.0625rem] font-semibold leading-[1.6] text-navy ${bar}`}>{value}</span>
    </a>
  );
}

type Props = {
  /** The statement line above the contact panel; each page sets its own. */
  tagline?: string;
  /** The current page's href, set in bold in the footer nav as drawn. */
  current?: string;
};

export default function Footer({ tagline = sameDay, current }: Props) {
  return (
    <footer>
      <p data-reveal className="site py-[clamp(36px,5vw,72px)] text-center text-[clamp(1.5rem,3.2vw,3rem)] leading-tight text-navy">
        {tagline}
      </p>

      {/* Contact panel */}
      <section aria-label="Contact details" className="relative overflow-hidden bg-mist py-[clamp(36px,4vw,56px)]">
        {/* The JJM mark, supplied white at 25% opacity, oversized and bleeding off the right edge as drawn.
            Centring lives on the wrapper so the parallax transform on the image doesn't fight it. */}
        <div className="pointer-events-none absolute -right-[12%] top-1/2 h-[110%] -translate-y-1/2 select-none md:-right-[1%] md:h-[165%]" aria-hidden>
          <Image src="/icons/bg-jjm-mark.svg" alt="" width={571} height={557} data-parallax="8" className="h-full w-auto" />
        </div>
        <div className="site relative grid gap-10 md:grid-cols-[1fr_auto]" data-reveal>
          <ul data-chip-intro className="flex flex-col items-start gap-3">
            <li>
              <span className="hidden md:inline-flex"><Chip label="Office" value={company.phone} href={company.phoneHref} copy={company.phone} /></span>
              <span className="md:hidden"><LineChip label="Office" value={company.phone} href={company.phoneHref} /></span>
            </li>
            <li>
              <span className="hidden md:inline-flex"><Chip label="General inquiries" value={company.email} href={`mailto:${company.email}`} copy={company.email} /></span>
              <span className="md:hidden"><LineChip label="General inquiries" value={company.email} href={`mailto:${company.email}`} /></span>
            </li>
            <li>
              <span className="hidden md:inline-flex"><Chip label="Accounting" value={company.accountingEmail} href={`mailto:${company.accountingEmail}`} copy={company.accountingEmail} /></span>
              <span className="md:hidden"><LineChip label="Accounting" value={company.accountingEmail} href={`mailto:${company.accountingEmail}`} /></span>
            </li>
            <li>
              <span className="hidden md:inline-flex"><Chip label="Address" value={company.address} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.name}, ${company.address}`)}`} /></span>
              <span className="md:hidden"><LineChip label="Address" value={company.address} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${company.name}, ${company.address}`)}`} /></span>
            </li>
            <li className="mt-2">
              {/* Phones show just the icon; the words come in from md. */}
              <a
                href={company.instagramHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`JJM on Instagram, @${company.instagram}`}
                className="inline-flex items-center gap-3 text-navy transition-opacity duration-300 hover:opacity-70"
              >
                <span aria-hidden className="label hidden md:inline">Stay connected</span>
                <IconInstagram className="size-8 md:size-7" />
                <span aria-hidden className="hidden font-semibold md:inline">{company.instagram}</span>
              </a>
            </li>
          </ul>
          {/* Desktop only: on phones the office number is right above, and the sticky call button is always there. */}
          <a href={company.phoneHref} className="hidden items-start gap-3 text-navy transition-opacity duration-300 hover:opacity-70 md:flex md:justify-self-end">
            <span className="flex size-7 items-center justify-center rounded-full bg-blue text-white">
              <IconPhone className="size-4" />
            </span>
            <span className="text-[clamp(1.1rem,1.4vw,1.4rem)] uppercase leading-none tracking-[0.04em]">
              Emergency <strong className="ml-1 font-semibold normal-case tracking-normal">{company.phone}</strong>
            </span>
          </a>
        </div>
      </section>

      {/* Footer nav. Desktop only: on phones the sticky menu is always a tap away. */}
      <nav aria-label="Footer" className="hidden bg-frost md:block">
        <ul className="site flex flex-wrap justify-center gap-x-[clamp(20px,3.5vw,52px)] gap-y-2 py-5">
          {nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={item.href === current ? "page" : undefined}
                className={`text-[0.875rem] uppercase tracking-[0.06em] ${item.href === current ? "font-semibold text-black" : "font-semibold text-navy transition-colors duration-300 hover:text-blue"}`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Partners: one still row where they fit, a slow draggable strip where they don't (LogoStrip). */}
      <div className="site">
        <LogoStrip partners={partners} />
      </div>
      {/* Edge to edge, like the section titles' dotted rules. */}
      <div className="rule-dotted" />
      <p className="site py-4 text-center text-[0.75rem] font-light text-ink">
        © {company.year} {company.name} | All Rights Reserved
      </p>
    </footer>
  );
}
