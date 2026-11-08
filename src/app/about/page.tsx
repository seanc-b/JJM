import ServicePage, { serviceMetadata } from "@/components/ServicePage";

export const metadata = serviceMetadata("about");

export default function Page() {
  return <ServicePage slug="about" />;
}
