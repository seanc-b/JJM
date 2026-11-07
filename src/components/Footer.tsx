import Image from "next/image";
import Link from "next/link";
import { IconInstagram, IconPhone } from "@/components/Icons";
import Placeholder from "@/components/Placeholder";
import { company, nav, partners, sameDay } from "@/content/home";

function Chip({ label, value, href }: { label: string; value: string; href?: string }) {
  const inner = (
    <>
      <span className="label text-ink">{label}</span>
      <span className="text-[clamp(1rem,1.3vw,1.3rem)] font-bold text-navy">{value}</span>
    </>
  );
  const cls = "inline-flex flex-wrap items-baseline gap-x-3 bg-white px-5 py-2.5 transition-colors duration-400";
  return href ? (
    <a href={href} className={`${cls} hover:bg-navy [&>span]:transition-colors [&>span]:duration-400 hover:[&>span]:text-white`}>
      {inner}
    </a>
  ) : (
    <span className={cls}>{inner}</span>
  );
}

export default function Footer() {
  return (
    <footer>
      <p data-reveal className="site py-[clamp(36px,5vw,72px)] text-center text-[clamp(1.5rem,3.2vw,3rem)] leading-tight text-navy">
        {sameDay}
      </p>

      {/* Contact panel */}
      <section aria-label="Contact details" className="relative overflow-hidden bg-mist py-[clamp(36px,4vw,56px)]">
        <Image src="/icons/bg-flame.svg" alt="" aria-hidden width={396} height={626} className="pointer-events-none absolute right-[8%] top-1/2 h-[150%] w-auto -translate-y-1/2 opacity-80 brightness-[2.3] saturate-0 mix-blend-soft-light" />
        <div className="site relative grid gap-10 md:grid-cols-[1fr_auto]" data-reveal>
          <ul className="flex flex-col items-start gap-3">
            <li><Chip label="Office" value={company.phone} href={company.phoneHref} /></li>
            <li><Chip label="General inquiries" value={company.email} href={`mailto:${company.email}`} /></li>
            <li><Chip label="Accounting" value={company.accountingEmail} href={`mailto:${company.accountingEmail}`} /></li>
            <li><Chip label="Address" value={company.address} href="https://maps.google.com/?q=8331+Eastlake+Dr+%23107+Burnaby+BC+V5A+4W2" /></li>
            <li className="mt-2">
              <a href={company.instagramHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 text-navy transition-opacity duration-300 hover:opacity-70">
                <span className="label">Stay connected</span>
                <IconInstagram className="size-7" />
                <span className="font-bold">{company.instagram}</span>
              </a>
            </li>
          </ul>
          <a href={company.phoneHref} className="flex items-start gap-3 text-navy transition-opacity duration-300 hover:opacity-70 md:justify-self-end">
            <span className="flex size-7 items-center justify-center rounded-full bg-blue text-white">
              <IconPhone className="size-4" />
            </span>
            <span className="text-[clamp(1.1rem,1.4vw,1.4rem)] uppercase leading-none tracking-[0.04em]">
              Emergency <strong className="ml-1 font-bold normal-case tracking-normal">{company.phone}</strong>
            </span>
          </a>
        </div>
      </section>

      {/* Footer nav */}
      <nav aria-label="Footer" className="bg-frost">
        <ul className="site flex flex-wrap justify-center gap-x-[clamp(20px,3.5vw,52px)] gap-y-2 py-5">
          {nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="navlink text-[0.875rem] font-semibold uppercase tracking-[0.06em] text-navy">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Partners */}
      <div className="site">
        <ul aria-label="Memberships and partners" className="flex flex-wrap items-center justify-center gap-x-9 gap-y-4 py-8">
          {partners.map((name) => (
            <li key={name} className="flex items-center gap-2 text-[0.8125rem] font-semibold uppercase tracking-[0.08em] text-ink">
              <span className="block h-7 w-[1.5px] bg-blue/40" aria-hidden />
              {name}
              <Placeholder />
            </li>
          ))}
        </ul>
        <div className="rule-dotted" />
        <p className="py-4 text-center text-[0.75rem] font-light text-ink">
          © {company.year} {company.name} | All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
