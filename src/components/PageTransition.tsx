import { ViewTransition, type ReactNode } from "react";

/**
 * Fades a page's content out and the next page's in when the route changes (the browser's View
 * Transitions API, through React). It runs on enter and exit only, so in-page updates such as the
 * contact form's submit don't animate the whole page. Each page wraps its own content because the
 * layout persists across navigations and would never enter or exit. The header stays put (see
 * `site-header` in globals.css). Browsers without view transitions simply switch pages.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      {children}
    </ViewTransition>
  );
}
