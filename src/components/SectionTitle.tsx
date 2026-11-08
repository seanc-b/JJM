import Image from "next/image";

type Props = {
  title: string;
  icon: string;
  id?: string;
};

/** A section title with its brand icon between two full-bleed dotted rules: left-aligned with the icon at the right on phones, centred from md. */
export default function SectionTitle({ title, icon, id }: Props) {
  return (
    <div data-reveal>
      <div className="rule-dotted" />
      <h2
        id={id}
        // Phones: title on the left, icon on the right, as in the home services list. From md: centred, icon beside it.
        className="site flex flex-row-reverse items-center justify-between gap-4 py-[clamp(12px,1.2vw,18px)] text-left md:flex-row md:justify-center md:gap-[clamp(10px,1vw,16px)] md:text-center text-[clamp(1.75rem,2.67vw,2.5rem)] font-bold uppercase leading-[1.04] tracking-[-0.005em] text-navy"
      >
        <Image src={icon} alt="" width={44} height={44} className="size-[clamp(30px,2.9vw,44px)] shrink-0" />
        <span className="text-balance">{title}</span>
      </h2>
      <div className="rule-dotted" />
    </div>
  );
}
