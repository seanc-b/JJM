import Image from "next/image";
import Button from "@/components/Button";
import { IconPlus } from "@/components/Icons";
import type { Section } from "@/content/home";

/**
 * Text left, photo right, oversized brand icon behind. Only images[0] renders for now;
 * the alternates stay in content for the deferred scroll-swap effect.
 */
export default function ServiceSection({ section }: { section: Section }) {
  const [image] = section.images;
  return (
    <section id={section.id} aria-labelledby={`${section.id}-title`} className="relative isolate overflow-hidden py-[clamp(56px,7vw,110px)]">
      <Image
        src={section.bgIcon}
        alt=""
        aria-hidden
        width={520}
        height={568}
        data-parallax="14"
        className={`pointer-events-none absolute -z-10 h-auto select-none ${section.bgClass}`}
      />

      <div className="site grid grid-cols-12 items-center gap-y-12">
        {/* One reveal for the text column; the heading's hairlines draw themselves (data-rules). */}
        <div data-reveal className="col-span-12 md:col-span-5 lg:col-span-4 lg:col-start-1">
          <div data-rules className="ruled flex items-start justify-between gap-6 py-4">
            <h2 id={`${section.id}-title`} className="display text-[clamp(1.5rem,2.1vw,1.9rem)] text-navy">
              {section.title.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <Image src={section.icon} alt="" width={44} height={44} className="size-11 shrink-0" />
          </div>
          <p className="mt-7 max-w-[42ch] text-[clamp(1.1rem,1.6vw,1.5rem)] leading-[1.45] text-ink">
            <strong className="font-bold text-black">{section.lead}</strong>
            {section.body}
          </p>
          <div className="mt-8">
            <Button href={section.href} icon={<IconPlus />}>
              Learn more
            </Button>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
          <div data-wipe className={`frame bg-frost ${section.aspect} w-full`}>
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 42vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
