import { ViewTransition, type ReactNode } from "react";

/**
 * Dissolves one page into the next when the route changes (the browser's View Transitions API, through
 * React). The new page is in place at once underneath, its hero plain navy until Motion fades the photo
 * up, and the old page fades away on top of it, so nothing is ever see-through. It runs on enter and
 * exit only, so in-page updates such as the contact form's submit don't animate the page. Each page
 * wraps its own content because the layout persists across navigations and would never enter or exit.
 * The header stays put (`site-header` in globals.css). Browsers without view transitions just switch.
 */
export default function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}
