import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: string;
  icon?: ReactNode;
  /** solid: blue block, the main call to action. dark: pale block on white, the secondary one. light: white block on a photo. */
  tone?: "light" | "dark" | "solid";
  className?: string;
  external?: boolean;
};

/** Each tone's resting colours, and the copy that wipes across on hover. */
const tones = {
  solid: { base: "bg-blue text-white", fill: "bg-navy text-white" },
  dark: { base: "bg-frost text-navy", fill: "bg-navy text-white" },
  light: { base: "bg-white text-navy", fill: "bg-blue text-white" },
};

const layout = "inline-flex items-center gap-2.5 px-5 py-3 text-[0.8125rem] font-semibold uppercase leading-none tracking-[0.14em]";
const iconCls = "flex size-4 items-center justify-center transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 [&>svg]:size-4";

/**
 * A square block button in the style of the news Play button: on hover or focus a navy copy of it (white
 * text) wipes across from left to right (.wipe and .wipe-fill in globals.css).
 */
export default function Button({ href, children, icon, tone = "dark", className = "", external }: Props) {
  const t = tones[tone];
  const content = (
    <>
      {children}
      {icon && <span className={iconCls}>{icon}</span>}
    </>
  );
  const inner = (
    <>
      {content}
      <span aria-hidden className={`wipe-fill absolute inset-0 ${layout} ${t.fill}`}>
        {content}
      </span>
    </>
  );
  const cls = `wipe group relative ${layout} ${t.base} ${className}`;

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
