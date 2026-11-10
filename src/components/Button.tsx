import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: string;
  icon?: ReactNode;
  /** dark: navy outline on white (content). light: white outline on a photo (hero). solid: filled blue. */
  tone?: "light" | "dark" | "solid";
  className?: string;
  external?: boolean;
};

/** Resting colours, the fill that sweeps in on hover, and the colours over it. */
const tones = {
  dark: { base: "border-navy/45 text-navy group-hover:border-navy group-focus-visible:border-navy", fill: "bg-navy", over: "group-hover:text-white group-focus-visible:text-white" },
  light: { base: "border-white/80 text-white group-hover:border-white group-focus-visible:border-white", fill: "bg-white", over: "group-hover:text-navy group-focus-visible:text-navy" },
  solid: { base: "border-blue bg-blue text-white group-hover:border-navy group-focus-visible:border-navy", fill: "bg-navy", over: "" },
};

const ease = "duration-500 ease-[var(--ease-out-expo)]";

/**
 * The design's button: an outline with softly rounded corners and spaced capitals. On hover or focus a fill
 * sweeps in from the left behind the label, the label turns to the contrasting colour, and it rolls up as its
 * twin rolls in from below.
 */
export default function Button({ href, children, icon, tone = "dark", className = "", external }: Props) {
  const t = tones[tone];
  const roll = `block transition-transform ${ease} group-hover:-translate-y-full group-focus-visible:-translate-y-full`;
  const inner = (
    <>
      <span aria-hidden className={`absolute inset-0 origin-left scale-x-0 transition-transform ${ease} group-hover:scale-x-100 group-focus-visible:scale-x-100 ${t.fill}`} />
      <span className={`relative flex items-center transition-colors ${ease} ${t.over}`}>
        <span className="relative block overflow-hidden leading-none">
          <span className={roll}>{children}</span>
          <span aria-hidden className={`absolute left-0 top-full ${roll}`}>
            {children}
          </span>
        </span>
        {icon && <span className="ml-2 -mr-1 flex size-4 items-center justify-center [&>svg]:size-4">{icon}</span>}
      </span>
    </>
  );
  const cls = `group relative inline-flex items-center overflow-hidden rounded-xl border px-6 py-3 text-[0.8125rem] font-medium uppercase tracking-[0.12em] transition-colors ${ease} ${t.base} ${className}`;

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {inner}
    </Link>
  );
}
