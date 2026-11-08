"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { IconCheck, IconCopy } from "@/components/Icons";

/** Puts text on the clipboard, falling back to a hidden textarea where the async API is unavailable. */
async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

type Props = {
  /** What lands on the clipboard. */
  value: string;
  /** What it is, for the accessible name: "Copy email address". */
  label: string;
  className?: string;
  /** Visible text beside the icon; it reads "Copied" for a moment after copying. Omit for an icon-only button. */
  text?: ReactNode;
};

/**
 * A copy-to-clipboard button. After copying, the icon turns to a check (and any text to "Copied") for a
 * moment, and screen readers hear "Copied". It sits beside an email or phone link, never inside it: the
 * link keeps doing the native thing (open mail, dial) and this is the extra option for desktop visitors.
 */
export default function CopyButton({ value, label, className = "", text }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    if (!(await copyText(value))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };

  return (
    <button type="button" onClick={onClick} aria-label={`Copy ${label}`} title={copied ? "Copied" : `Copy ${label}`} className={className}>
      {copied ? <IconCheck className="size-4 shrink-0" /> : <IconCopy className="size-4 shrink-0" />}
      {text !== undefined && <span>{copied ? "Copied" : text}</span>}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied" : ""}
      </span>
    </button>
  );
}
