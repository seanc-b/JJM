import Image from "next/image";

type Props = {
  image: { src: string; alt: string };
  lines: string[];
  /** Headline column start on large screens (12-col grid). */
  align?: "right" | "centre";
};

/** Full-bleed photo tinted navy with a rising headline. */
export default function Banner({ image, lines, align = "right" }: Props) {
  const col = align === "right" ? "lg:col-span-5 lg:col-start-8 md:col-span-6 md:col-start-7" : "lg:col-span-5 lg:col-start-7 md:col-span-6 md:col-start-6";
  return (
    <section className="relative isolate overflow-hidden bg-navy text-white" style={{ height: "clamp(440px, 46vw, 720px)" }}>
      <div className="tint absolute inset-0">
        <div data-parallax="9" className="absolute inset-0">
          <Image src={image.src} alt={image.alt} fill sizes="100vw" className="scale-[1.14] object-cover" />
        </div>
      </div>
      <div className="site relative grid h-full grid-cols-12 items-center">
        <h2 data-rise className={`display col-span-12 text-[clamp(1.7rem,3.3vw,3.05rem)] ${col}`}>
          {lines.map((line) => (
            <span key={line}>
              <span>{line}</span>
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}
