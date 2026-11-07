import { notFound } from "next/navigation";
import { nav } from "@/content/home";
import Button from "@/components/Button";
import { IconArrow } from "@/components/Icons";

/** Temporary stand-ins so the home page's links resolve until each page is designed. */
export function generateStaticParams() {
  return nav.map((item) => ({ slug: item.href.slice(1) }));
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const item = nav.find((n) => n.href === `/${slug}`);
  if (!item) notFound();

  return (
    <main className="site flex min-h-svh flex-col justify-center py-24 text-navy">
      <p className="label text-blue">In progress</p>
      <h1 className="display mt-4 text-[clamp(2rem,5vw,4rem)]">{item.label}</h1>
      <p className="mt-6 max-w-[48ch] text-lg text-ink">This page is being designed. The home page is the first surface in the build.</p>
      <div className="mt-10">
        <Button href="/" icon={<IconArrow />}>
          Back to home
        </Button>
      </div>
    </main>
  );
}
