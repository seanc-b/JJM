import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionTitle from "@/components/SectionTitle";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Motion from "@/components/Motion";
import { servicePages, type ServicePage as Page, type Watermark } from "@/content/pages";

/**
 * The oversized 12% brand icon behind the title band and intro, placed in 1500-wide artboard px.
 * --u is one artboard px: 1px at 1500 wide and up, scaling down with the viewport to a 0.5px floor
 * so the icon still reads on phones.
 */
export function WatermarkIcon({ src, ratio, x, y, width, anchor = "centre" }: Watermark) {
  const style: CSSProperties = {
    left: anchor === "left" ? `calc(${x} * var(--u))` : `calc(50% + ${x - 750} * var(--u))`,
    top: `calc(${y} * var(--u))`,
    width: `calc(${width} * var(--u))`,
  };
  return (
    <Image
      src={src}
      alt=""
      aria-hidden
      width={Math.round(width)}
      height={Math.round(width / ratio)}
      data-parallax="18"
      data-parallax-lag="1.2"
      className="pointer-events-none absolute h-auto max-w-none select-none"
      style={style}
    />
  );
}

/** Sets --u (one artboard px) for WatermarkIcon on the element that positions it. */
export const artboardUnit = { "--u": "clamp(0.5px, calc(100vw / 1500), 1px)" } as CSSProperties;

/**
 * The centred two-column intro under a title band: the ruled heading on the left, the page's own
 * content (paragraphs, a contact list) on the right.
 */
export function PageIntro({ heading, children, className = "pb-[clamp(56px,7.3vw,110px)]" }: { heading: string[]; children: ReactNode; className?: string }) {
  return (
    <div className={`site pt-[clamp(48px,6.9vw,104px)] ${className}`}>
      <div className="mx-auto grid max-w-[966px] gap-10 md:grid-cols-[450fr_466fr] md:gap-[clamp(32px,3.33vw,50px)]">
        <div data-reveal data-rules className="ruled self-start py-4">
          <h3 className="text-[clamp(1.125rem,2vw,1.875rem)] font-bold uppercase leading-[1.04] tracking-[-0.005em] text-navy">
            {heading.map((line, i) => (
              <span key={line} className="md:block">
                {line}
                {i < heading.length - 1 && " "}
              </span>
            ))}
          </h3>
        </div>
        {children}
      </div>
    </div>
  );
}

function getPage(slug: string): Page {
  const page = servicePages.find((p) => p.slug === slug);
  if (!page) throw new Error(`No service page content for "${slug}"`);
  return page;
}

export function serviceMetadata(slug: string): Metadata {
  const page = getPage(slug);
  return { title: page.metaTitle, description: page.metaDescription };
}

export default function ServicePage({ slug }: { slug: string }) {
  const page = getPage(slug);
  const href = `/${page.slug}`;
  const titleId = `${page.slug}-title`;
  return (
    <>
      <Header />
      <PageTransition>
      <main>
        <Hero size="page" image={page.hero.image} lines={page.hero.lines} cta={page.hero.cta} />

        <section
          aria-labelledby={titleId}
          className="relative isolate overflow-hidden"
          style={artboardUnit}
        >
          <WatermarkIcon {...page.watermark} />

          <div className="relative pt-[clamp(32px,3.9vw,58px)]">
            <SectionTitle id={titleId} title={page.title} icon={page.icon} />

            <PageIntro heading={page.heading}>
              {/* Pulled up so the first line's capitals sit on the heading's top rule (half-leading + ascender). */}
              <div className="space-y-[1.25em] text-[clamp(1.05rem,1.33vw,1.25rem)] leading-[1.3] text-ink md:-mt-[0.34em]">
                {page.paragraphs.map((text, i) => (
                  <p key={i} data-reveal>
                    {i === 0 && <strong className="font-bold text-black">{page.lead}</strong>}
                    {text}
                  </p>
                ))}
              </div>
            </PageIntro>
          </div>
        </section>

        <div className="flex flex-col gap-[clamp(10px,1.6vw,24px)]">
          {page.photos.map((photo) => (
            <div key={photo.src} data-wipe className="frame relative aspect-[4/3] bg-frost md:aspect-[1500/806]">
              <Image src={photo.src} alt={photo.alt} fill sizes="100vw" className="object-cover" style={{ objectPosition: photo.position }} />
            </div>
          ))}
        </div>
      </main>
      <Footer tagline={page.tagline} current={href} />
      </PageTransition>
      {/* Mounted last so its effects run after this page's DOM has hydrated. */}
      <Motion />
    </>
  );
}
