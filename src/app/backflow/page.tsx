import ServicePage, { serviceMetadata } from "@/components/ServicePage";

export const metadata = serviceMetadata("backflow");

export default function Page() {
  return <ServicePage slug="backflow" />;
}
