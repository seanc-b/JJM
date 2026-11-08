import Button from "@/components/Button";
import { IconPhone } from "@/components/Icons";
import { company } from "@/content/home";

/** The two ways to get in touch, as buttons: the contact form, and a call. Used under the Property Management paragraphs ("Contact us today."). */
export default function ContactActions({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <Button href="/contact" tone="solid">
        Request service
      </Button>
      <Button href={company.phoneHref} icon={<IconPhone />}>
        {`Call ${company.phone}`}
      </Button>
    </div>
  );
}
