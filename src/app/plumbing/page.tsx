import ServicePage, { serviceMetadata } from "@/components/ServicePage";

export const metadata = serviceMetadata("plumbing");

export default function Page() {
  return <ServicePage slug="plumbing" />;
}
