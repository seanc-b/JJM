/** Visible marker for content that must be replaced before launch. */
export default function Placeholder({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-sm bg-amber-300 px-1.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-amber-950 ${className}`}
      title="Placeholder content: replace before launch"
    >
      Placeholder
    </span>
  );
}
