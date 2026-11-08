/**
 * Joins the last two words with a non-breaking space, so a paragraph never ends on a single stray word
 * (a widow) at any width. Pair it with `text-pretty` (CSS text-wrap: pretty), which also rebalances the
 * last lines where the browser supports it.
 */
export function noWidow(text: string) {
  return text.replace(/\s+(\S+)\s*$/, " $1");
}
