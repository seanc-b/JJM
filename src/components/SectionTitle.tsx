import Image from "next/image";

type Props = {
  title: string;
  icon: string;
  id?: string;
};

/** A centred section title with its brand icon (above it on phones, beside it from md) between two full-bleed dotted rules. */
export default function SectionTitle({ title, icon, id }: Props) {
  return (
    <div data-reveal>
      <div className="rule-dotted" />
      <h2
        id={id}
        // Phones stack the icon above the title, so a title that wraps stays centred; wider screens set them side by side.
        className="site flex flex-col items-center justify-center gap-2.5 py-[clamp(12px,1.2vw,18px)] md:flex-row md:gap-[clamp(10px,1vw,16px)] text-center text-[clamp(1.35rem,2.67vw,2.5rem)] font-bold uppercase leading-[1.04] tracking-[-0.005em] text-navy"
      >
        <Image src={icon} alt="" width={44} height={44} className="size-[clamp(30px,2.9vw,44px)] shrink-0" />
        <span className="text-balance">{title}</span>
      </h2>
      <div className="rule-dotted" />
    </div>
  );
}
