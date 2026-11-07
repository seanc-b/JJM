import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: string;
  icon?: ReactNode;
  tone?: "light" | "dark" | "solid";
  className?: string;
  external?: boolean;
};

const tones = {
  light: "border-white/80 text-white hover:bg-white hover:text-navy",
  dark: "border-navy/45 text-navy hover:bg-navy hover:text-white hover:border-navy",
  solid: "border-blue bg-blue text-white hover:bg-navy hover:border-navy",
};

/** Outlined pill. On hover the label slides up and its twin slides in from below. */
export default function Button({ href, children, icon, tone = "dark", className = "", external }: Props) {
  const inner = (
    <>
      <span className="relative block overflow-hidden leading-none">
        <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
          {children}
        </span>
        <span aria-hidden className="absolute left-0 top-full block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">
          {children}
        </span>
      </span>
      {icon && <span className="ml-2 -mr-1 flex size-4 items-center justify-center [&>svg]:size-4">{icon}</span>}
    </>
  );
  const cls = `group inline-flex items-center rounded-full border px-6 py-3 text-[0.8125rem] font-medium uppercase tracking-[0.12em] transition-colors duration-500 ${tones[tone]} ${className}`;

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
