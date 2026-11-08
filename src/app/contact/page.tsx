import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SectionTitle from "@/components/SectionTitle";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Motion from "@/components/Motion";
import ContactForm from "@/components/ContactForm";
import { PageIntro, WatermarkIcon, artboardUnit, heroIcon } from "@/components/ServicePage";
import { company } from "@/content/home";

export const metadata: Metadata = {
  title: "Contact | JJM Mechanical Group",
  description: `Call ${company.phone}, email ${company.email} or send us a message. JJM Mechanical Group is at ${company.address}.`,
};

const mapQuery = encodeURIComponent(`${company.name}, ${company.address}`);
const mapHref = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

const details = [
  { label: "Office", value: company.phone, href: company.phoneHref },
  { label: "General inquiries", value: company.email, href: `mailto:${company.email}` },
  { label: "Accounting", value: company.accountingEmail, href: `mailto:${company.accountingEmail}` },
  { label: "Address", value: ["8331 Eastlake Dr Unit 107,", "Burnaby, BC V5A 4W2, Canada"], href: mapHref },
];

/** Gap between a title band and what follows it, matching the 58 px under the hero. */
const bandGap = "mt-[clamp(32px,3.9vw,58px)]";

export default function Page() {
  return (
    <>
      <Header />
      <PageTransition>
      <main>
        <Hero
          size="page"
          image={{ src: "/images/news-van.jpg", alt: "A JJM Mechanical Group service van" }}
          lines={["Providing", "services", "across the", "Lower", "Mainland"]}
          eyebrow={{ label: "Contact", icon: heroIcon("/contact") }}
        />

        {/* The map-pin watermark runs from the intro down towards the form, so one container holds
            them all; the pin sits under everything, the form's photo band included, so it never
            covers the form however far its parallax carries it. */}
        <div className="relative isolate overflow-hidden" style={artboardUnit}>
          <div aria-hidden className="pointer-events-none absolute inset-0 z-[1]">
            <WatermarkIcon src="/icons/bg-pin.svg" ratio={469.39 / 735.57} x={510} y={112} width={469} />
          </div>

          <section aria-labelledby="contact-title" className="relative z-[2] pt-[clamp(32px,3.9vw,58px)]">
            <SectionTitle id="contact-title" title="Let’s talk" icon="/icons/section-person.svg" />
            <PageIntro heading={["Contact us for more", "information"]} className="pb-[clamp(48px,5.2vw,78px)]">
              {/* Pulled up so the first line's capitals sit on the heading's top rule (half-leading + ascender). */}
              <dl className="space-y-[1.15em] text-[clamp(1.05rem,1.33vw,1.25rem)] leading-[1.25] md:-mt-[0.32em]">
                {details.map((d) => (
                  <div key={d.label} data-reveal>
                    <dt className="font-bold uppercase text-navy">{d.label}</dt>
                    <dd>
                      <a
                        href={d.href}
                        {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-ink underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:text-blue hover:decoration-current"
                      >
                        {Array.isArray(d.value)
                          ? d.value.map((line) => (
                              <span key={line} className="block">
                                {line}
                              </span>
                            ))
                          : d.value}
                      </a>
                    </dd>
                  </div>
                ))}
              </dl>
            </PageIntro>
          </section>

          <section aria-labelledby="message-title">
            <div className="relative z-[2]">
              <SectionTitle id="message-title" title="Send us a message" icon="/icons/section-pen.svg" />
            </div>

            <div className={`relative z-[2] ${bandGap}`}>
              <div aria-hidden className="absolute inset-0 z-0">
                <Image src="/images/contact-form-ductwork.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_40%] grayscale" />
                {/* Washed back to the mockup's pale steel so the fields read; a soft shade along the top edge. */}
                <div className="absolute inset-0 bg-[#dfe2ea]/80" />
                <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-navy/15 to-transparent" />
              </div>
              <div className="site relative z-[2] pb-[clamp(56px,7.7vw,116px)] pt-[clamp(48px,6.1vw,92px)]">
                {/* A comfortable single column, narrower than the intro above; the photo band stays full width. */}
                <div className="mx-auto max-w-[760px]">
                  <ContactForm />
                </div>
              </div>
            </div>
          </section>
        </div>

        <section aria-labelledby="find-title" className="mt-[clamp(32px,3.2vw,48px)]">
          <SectionTitle id="find-title" title="Find us" icon="/icons/section-flame.svg" />
          <div className="relative mt-[clamp(32px,3.33vw,50px)]">
            {/* Navy bar with a notch pointing down at the map, as drawn. */}
            <div aria-hidden className="relative z-[1] h-[clamp(6px,0.67vw,10px)] bg-navy">
              <div className="absolute left-1/2 top-full h-[clamp(10px,1.07vw,16px)] w-[clamp(20px,2.13vw,32px)] -translate-x-1/2 bg-navy [clip-path:polygon(0_0,100%_0,50%_100%)]" />
            </div>
            <iframe
              title={`Map showing ${company.name} at ${company.address}`}
              src={`https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[clamp(340px,32.4vw,486px)] w-full border-0 [filter:saturate(0.55)_contrast(0.95)]"
            />
          </div>
        </section>
      </main>
      {/* The mockup's line ends in "Lorem ipsum"; the rest of the sentence is still to be written. */}
      <Footer tagline="We are located in Burnaby, BC." current="/contact" />
      </PageTransition>
      <Motion />
    </>
  );
}
