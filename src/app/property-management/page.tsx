import ServicePage, { serviceMetadata } from "@/components/ServicePage";

export const metadata = serviceMetadata("property-management");

export default function Page() {
  return <ServicePage slug="property-management" />;
}
