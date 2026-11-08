import type { Metadata } from "next";
import Button from "@/components/Button";
import { IconArrow } from "@/components/Icons";

export const metadata: Metadata = { title: "Contact | JJM Mechanical Group" };

/** Stand-in until the Contact page is built (see PAGES.md). */
export default function Page() {
  return (
    <main className="site flex min-h-svh flex-col justify-center py-24 text-navy">
      <p className="label text-blue">In progress</p>
      <h1 className="display mt-4 text-[clamp(2rem,5vw,4rem)]">Contact</h1>
      <p className="mt-6 max-w-[48ch] text-lg text-ink">This page is being designed.</p>
      <div className="mt-10">
        <Button href="/" icon={<IconArrow />}>
          Back to home
        </Button>
      </div>
    </main>
  );
}
