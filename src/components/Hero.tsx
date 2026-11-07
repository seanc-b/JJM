import Image from "next/image";
import Button from "@/components/Button";
import { IconInstagram, IconPhone } from "@/components/Icons";
import { company, hero } from "@/content/home";

export default function Hero() {
  return (
    <section className="relative isolate min-h-[640px] overflow-hidden bg-navy text-white" style={{ height: "100svh" }}>
      <div className="tint absolute inset-0">
        <div data-parallax="10" className="absolute inset-0">
          <Image src={hero.image.src} alt={hero.image.alt} fill priority sizes="100vw" className="scale-[1.12] object-cover object-[60%_center]" />
        </div>
      </div>

      <div className="site relative grid h-full grid-cols-12 items-center pt-[84px]">
        <div className="col-span-12 md:col-span-7 md:col-start-6 lg:col-span-6 lg:col-start-7">
          <h1 data-rise="load" className="display text-[clamp(2.1rem,4.6vw,3.05rem)]">
            {hero.lines.map((line) => (
              <span key={line}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
          <div data-reveal="load" className="mt-8">
            <Button href={hero.cta.href} tone="light">
              {hero.cta.label}
            </Button>
          </div>
        </div>
      </div>

      <div className="site absolute inset-x-0 bottom-0 flex items-center justify-between pb-7 text-[0.8125rem] font-semibold uppercase tracking-[0.08em]">
        <a href={company.phoneHref} data-reveal="load" className="group flex items-center gap-3 transition-opacity duration-300 hover:opacity-80">
          <span className="flex size-7 items-center justify-center rounded-full bg-blue">
            <IconPhone className="size-4" />
          </span>
          <span>
            Emergency <span className="ml-1 text-[1.25rem] font-bold normal-case tracking-normal">{company.phone}</span>
          </span>
        </a>
        <a href={company.instagramHref} data-reveal="load" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-80">
          <span className="hidden sm:inline">Stay connected</span>
          <IconInstagram className="size-6" />
          <span className="normal-case tracking-normal">{company.instagram}</span>
        </a>
      </div>
    </section>
  );
}
