import ServicesScroller from "@/components/ServicesScroller";
import ServicesAccordion from "@/components/ServicesAccordion";

/** Both renditions ship; CSS picks one by viewport width and motion preference. */
export default function Services() {
  return (
    <>
      <ServicesScroller />
      <ServicesAccordion />
    </>
  );
}
