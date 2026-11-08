import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  // The live site's address, so shared links and the sharing image (opengraph-image.tsx) get full URLs.
  metadataBase: new URL("https://jjmmechanicalgroup.ca"),
  title: "JJM Mechanical Group | Plumbing, Heating & Mechanical Contractor, Burnaby BC",
  description:
    "JJM Mechanical Group provides property management services, plumbing, heating, gas fitting and backflow certification across Metro Vancouver and the Lower Mainland.",
};

// Adds the `motion` class before first paint when the visitor allows motion,
// so reveal targets start hidden only when they will actually be animated.
const motionScript =
  "if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion')}";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script below adds a class before React hydrates.
    // The navy background is inline so the canvas is navy from the very first paint, before CSS loads.
    <html lang="en" className={`${workSans.variable} h-full`} style={{ backgroundColor: "#17355d" }} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
