/**
 * Inner service pages (Property Management, Plumbing, Backflow, About Us): one template, one entry each.
 * Copy is verbatim from the designer's mockups. Shaped for a Payload "Pages" collection in phase two.
 */

export type Img = { src: string; alt: string; /** object-position for the 1500×806 crop */ position?: string };

export type Watermark = {
  src: string;
  /** Natural aspect of the SVG (viewBox width / height). */
  ratio: number;
  /** Position and width on the 1500-wide artboard, in px, measured from the bottom of the hero. */
  x: number;
  y: number;
  width: number;
  /** "centre": x is on the centred 1500 artboard. "left": x is from the viewport's left edge (an icon cropped by it). */
  anchor?: "centre" | "left";
};

export type ServicePage = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  hero: { image: Img; lines: string[]; cta?: { label: string; href: string } };
  /** The centred title between dotted rules, and its section icon. */
  title: string;
  icon: string;
  watermark: Watermark;
  /** Left-column heading, one entry per line as drawn. */
  heading: string[];
  /** Body paragraphs; the first may open with a bold lead-in. */
  lead: string;
  paragraphs: string[];
  photos: Img[];
  /** The statement line above the footer's contact panel. */
  tagline: string;
};

export const servicePages: ServicePage[] = [
  {
    slug: "property-management",
    metaTitle: "Property Management Services | JJM Mechanical Group",
    metaDescription:
      "Reliable, efficient mechanical services for property management companies: preventative maintenance programs, same-day service and equipment condition reports.",
    hero: {
      image: { src: "/images/pm-hero-heater-wall.jpg", alt: "A long row of tankless water heaters with colour-coded supply piping in a residential plant room" },
      lines: ["We specialize", "in property", "management", "services"],
    },
    title: "Property Management Services",
    icon: "/icons/section-property.svg",
    watermark: { src: "/icons/bg-gear.svg", ratio: 524.35 / 568.46, x: 521, y: 178, width: 449 },
    heading: ["Contact us today."],
    lead: "At JJM Mechanical Group,",
    paragraphs: [
      " we specialize in providing reliable and efficient mechanical services tailored to the unique needs of property management companies.",
      "Our comprehensive offerings include preventative maintenance programs designed to ensure the long-term performance and reliability of your plumbing, heating, and mechanical systems.",
      "We provide prompt, same-day service for urgent issues, minimizing downtime for your tenants or facilities. Our team also offers scheduled maintenance services and detailed reports on the condition and lifespan of your mechanical equipment, helping you effectively plan for future capital improvements and repairs.",
    ],
    photos: [
      { src: "/images/pm-heater-supply-lines.jpg", alt: "Wall-hung water heaters with blue and braided supply lines", position: "50% 70%" },
      { src: "/images/pm-boiler-manifold.jpg", alt: "A bank of boilers above black steel manifold piping on a new install", position: "50% 55%" },
      { src: "/images/pm-vancouver-false-creek.jpg", alt: "Aerial view of False Creek and the Burrard Bridge in Vancouver", position: "50% 60%" },
    ],
    tagline: "Provide prompt, same-day emergency service.",
  },
  {
    slug: "plumbing",
    metaTitle: "Plumbing, Heating & Gas Fitting | JJM Mechanical Group",
    metaDescription:
      "Plumbing, heating and gas fitting for residential and commercial clients across the Lower Mainland. Certified Navien Service Specialists and a licensed BC gas contractor.",
    hero: {
      image: { src: "/images/plumbing-hero-boiler-plant.jpg", alt: "A row of condensing boilers with grey venting rising into an old brick building" },
      lines: ["We provide", "comprehensive", "plumbing, heating,", "HVAC, and gas", "services."],
    },
    title: "Plumbing, Heating & Gas Fitting",
    icon: "/icons/section-flame.svg",
    watermark: { src: "/icons/bg-flame.svg", ratio: 395.75 / 625.76, x: 513, y: 0, width: 455 },
    heading: ["We also offer", "customized preventative", "maintenance program"],
    lead: "JJM Mechanical Group",
    paragraphs: [
      " provides comprehensive plumbing, heating, and gas fitting services for residential and commercial clients across the Lower Mainland. Our licensed technicians deliver expert installation, repair, and maintenance for all mechanical systems — including boilers, furnaces, water heaters, and gas-fired appliances.",
      "As certified Navien Service Specialists and a licensed BC gas contractor, we supply and service high-efficiency tankless water heaters and boilers, ensuring reliable performance and energy savings.",
      "We also offer customized preventative maintenance programs, same-day service for commercial contract clients, and detailed equipment assessments to help you plan for future upgrades with confidence. Whether you need emergency repairs, new system installations, or ongoing maintenance, JJM Mechanical Group is your trusted partner for safe, efficient, and long-lasting mechanical solutions.",
    ],
    photos: [
      { src: "/images/plumbing-mechanical-room.jpg", alt: "A mechanical room with wall-hung boilers, copper piping and circulator pumps", position: "50% 40%" },
      { src: "/images/plumbing-water-main-repair.jpg", alt: "A JJM technician standing in an excavation beside a repaired water main", position: "50% 72%" },
      { src: "/images/plumbing-process-piping.jpg", alt: "Two JJM technicians installing process piping on a concrete wall", position: "50% 50%" },
    ],
    tagline: "We provide same-day service for urgent issues.",
  },
  {
    slug: "backflow",
    metaTitle: "Backflow Certification | JJM Mechanical Group",
    metaDescription:
      "A BCWWA member since 2007, JJM installs, tests, repairs and recertifies backflow prevention devices of all makes and sizes, with hazard assessments and water management reports.",
    hero: {
      image: { src: "/images/backflow-hero-rpz.jpg", alt: "A bronze reduced-pressure backflow assembly between two yellow-handled ball valves" },
      lines: ["Proud member", "of the BCWWA", "since 2007"],
    },
    title: "Backflow Certification",
    icon: "/icons/section-backflow.svg",
    watermark: { src: "/icons/bg-backflow.svg", ratio: 344.16 / 426.38, x: 563, y: 0, width: 344 },
    heading: ["No project is too small", "or too big for us"],
    lead: "As a proud member of the BCWWA since 2007",
    paragraphs: [
      ", JJM Mechanical Group is fully certified to install, test, and repair all makes and sizes of backflow prevention devices. We also provide comprehensive testing and recertification services to ensure your systems remain in top working order.",
      "In addition to backflow services, we offer detailed hazard assessments and water management planning reports. Please note that, as of December 19, 2014, all backflow prevention devices and related potable water fittings in British Columbia must comply with lead-free regulations and include both testable and non-testable devices, as well as brass fittings.",
    ],
    photos: [
      { src: "/images/backflow-assembly.jpg", alt: "A red and green double check valve backflow assembly with test tags", position: "50% 30%" },
      { src: "/images/backflow-valve.jpg", alt: "A red OS&Y valve with a tamper switch and a JJM test tag", position: "50% 52%" },
    ],
    tagline: "We provide prompt, same-day service for urgent issues",
  },
  {
    slug: "about",
    metaTitle: "About Us | JJM Mechanical Group",
    metaDescription:
      "Founded in 2012 by Jay Mallan, JJM Mechanical Group is built on superior workmanship, exceptional customer care and meticulous attention to detail.",
    hero: {
      image: { src: "/images/plumbing-process-piping.jpg", alt: "Two JJM technicians installing process piping on a concrete wall" },
      lines: ["We deliver", "high-quality", "service &", "precision", "installations"],
      cta: { label: "Contact us", href: "/contact" },
    },
    title: "About Us",
    icon: "/icons/section-about.svg",
    // The icon's gear sits about 60px in from the viewport's left edge; the figures run off it.
    watermark: { src: "/icons/bg-about-team.svg", ratio: 1, x: -450, y: 164, width: 1020, anchor: "left" },
    heading: ["JJM has over 20 years", "of experience"],
    lead: "With over 20 years of experience",
    paragraphs: [
      " in the mechanical trade, Jay Mallan (founder of JJM Mechanical Group) has built a reputation for delivering high-quality service and precision installations.",
      "In 2012, JJM Mechanical Group was founded on the principles of superior workmanship and exceptional customer care. After gaining valuable experience working with Vancouver’s top mechanical contractors, Jay envisioned a company that could offer even better service.",
      "Today, JJM Mechanical Group continues to exceed customer expectations with meticulous attention to detail in every project.",
    ],
    photos: [
      { src: "/images/about-fleet.jpg", alt: "JJM's fleet of white service trucks and vans lined up outside the shop", position: "50% 60%" },
      { src: "/images/about-team-crane-wide.jpg", alt: "The JJM team in hard hats and hi-vis in front of a crane lift downtown", position: "50% 62%" },
    ],
    tagline: "20 years of experience & a qualified team.",
  },
];
