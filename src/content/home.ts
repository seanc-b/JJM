/**
 * Home page content. Shaped to match the Payload collections planned for phase two
 * (Navigation, Hero, NewsItems, Banners, ServiceSections, Contact, Partners).
 */

export const company = {
  name: "JJM Mechanical Group",
  phone: "604.422.0204",
  phoneHref: "tel:+16044220204",
  email: "jjm@jjmmechanicalgroup.ca",
  accountingEmail: "accounts@jjmmechanicalgroup.ca",
  address: "8331 Eastlake Dr, #107, Burnaby, BC V5A 4W2",
  instagram: "jjmmech",
  instagramHref: "https://www.instagram.com/jjmmech",
  year: 2026,
};

export type NavLink = { label: string; href: string; icon: "property" | "flame" | "backflow" | "about" | "contact" };

export const nav: NavLink[] = [
  { label: "Property Management", href: "/property-management", icon: "property" },
  { label: "Plumbing", href: "/plumbing", icon: "flame" },
  { label: "Backflow", href: "/backflow", icon: "backflow" },
  { label: "About Us", href: "/about", icon: "about" },
  { label: "Contact", href: "/contact", icon: "contact" },
];

export const hero = {
  image: { src: "/images/hero-navien-plant-room.jpg", alt: "A row of Navien tankless water heaters installed by JJM in a commercial plant room" },
  lines: ["Built on trust,", "driven by", "customer", "satisfaction"],
  cta: { label: "Contact us", href: "/contact" },
};

export const marquee = ["Property Management Services", "Plumbing, Heating & Gas Fitting", "Backflow Certification"];

export type NewsItem = {
  source: string;
  subtitle: string;
  date: string;
  title: string;
  image: { src: string; alt: string };
  videoUrl: string;
  placeholder?: boolean;
};

export const news: NewsItem[] = [
  {
    source: "Navien",
    subtitle: "Innovation in Action",
    date: "01.10.2026",
    title: "Residential Tower Eliminates Hot-Water Complaints with Navien's Tankless Water Heaters",
    image: { src: "/images/property-navien-wall.jpg", alt: "Navien tankless water heaters mounted in a row" },
    videoUrl: "https://www.youtube.com/@navieninc",
    placeholder: true,
  },
  {
    source: "Geotab",
    subtitle: "Improving Safety & Productivity",
    date: "01.10.2026",
    title: "How Fleet Telematics Keeps JJM's Service Vans Safe and On Time Across the Lower Mainland",
    image: { src: "/images/news-van.jpg", alt: "A JJM Mechanical Group service van" },
    videoUrl: "https://www.youtube.com/@geotab",
    placeholder: true,
  },
];

export const bannerSince = {
  image: { src: "/images/banner-technician-ladder.jpg", alt: "A JJM technician on a ladder servicing overhead mechanical piping" },
  lines: ["Delivering", "high-quality", "mechanical", "installations,", "service, and", "maintenance", "since 2012."],
};

export const bannerCustomers = {
  image: { src: "/images/banner-fleet.jpg", alt: "JJM's fleet of white service trucks and vans parked outside the shop" },
  lines: ["Better", "business", "begins with", "satisfied", "customers."],
};

export type Section = {
  id: string;
  title: string[];
  icon: string;
  bgIcon: string;
  /** Tailwind classes positioning the oversized background icon. */
  bgClass: string;
  lead: string;
  body: string;
  href: string;
  /** First image shows now; the rest are the alternates for the deferred scroll effect. */
  images: { src: string; alt: string }[];
  aspect: string;
};

export const sections: Section[] = [
  {
    id: "property-management",
    title: ["Property", "Management", "Services"],
    icon: "/icons/section-property.svg",
    bgIcon: "/icons/bg-gear.svg",
    bgClass: "w-[34vw] max-w-[520px] left-[22%] -top-[10%]",
    lead: "At JJM Mechanical Group",
    body: ", we specialize in providing reliable and efficient mechanical services tailored to the unique needs of property management companies.",
    href: "/property-management",
    images: [
      { src: "/images/property-crane-aerial.jpg", alt: "Aerial view of a crane lifting mechanical equipment onto a downtown rooftop" },
      { src: "/images/property-boiler-skid.jpg", alt: "A packaged boiler skid with manifold piping before installation" },
      { src: "/images/property-navien-wall.jpg", alt: "A wall of Navien water heaters with blue and braided supply lines" },
    ],
    aspect: "aspect-[5/6]",
  },
  {
    id: "plumbing",
    title: ["Plumbing", "Heating", "& Gas Fitting"],
    icon: "/icons/section-flame.svg",
    bgIcon: "/icons/bg-flame.svg",
    bgClass: "w-[22vw] max-w-[340px] left-[36%] top-[6%]",
    lead: "JJM Mechanical Group",
    body: " provides comprehensive plumbing, heating, and gas fitting services for residential and commercial clients across the Lower Mainland.",
    href: "/plumbing",
    images: [
      { src: "/images/plumbing-boiler-room.jpg", alt: "A finished boiler room with copper piping, pumps and expansion tanks" },
      { src: "/images/plumbing-meters.jpg", alt: "Three brass water meters on insulated white pipes" },
      { src: "/images/plumbing-unit-open.jpg", alt: "The open control panel of a condensing water heater during commissioning" },
    ],
    aspect: "aspect-square",
  },
  {
    id: "backflow",
    title: ["Backflow", "Certification"],
    icon: "/icons/section-backflow.svg",
    bgIcon: "/icons/bg-backflow.svg",
    bgClass: "w-[22vw] max-w-[320px] -left-[2%] top-[2%]",
    lead: "As a proud member of the BCWWA since 2007",
    body: ", JJM Mechanical Group is fully certified to install, test, and repair all makes and sizes of backflow prevention devices.",
    href: "/backflow",
    images: [
      { src: "/images/backflow-assembly.jpg", alt: "A red and green double check valve backflow assembly with test tags" },
      { src: "/images/backflow-gauge.jpg", alt: "A technician holding a backflow test gauge" },
      { src: "/images/backflow-valve.jpg", alt: "A red OS&Y backflow valve with a tamper switch" },
    ],
    aspect: "aspect-[3/2]",
  },
  {
    id: "about",
    title: ["About", "Us"],
    icon: "/icons/section-about.svg",
    bgIcon: "/icons/bg-about.svg",
    bgClass: "w-[20vw] max-w-[300px] left-[36%] top-[30%]",
    lead: "JJM Mechanical Group has over 20 years of experience",
    body: " in the mechanical trade.",
    href: "/about",
    images: [
      { src: "/images/about-crew-trench.jpg", alt: "The JJM crew replacing a ring main valve in an excavated trench" },
      { src: "/images/about-team-shop.jpg", alt: "Five JJM team members in the shop in front of mechanical equipment" },
      { src: "/images/about-team-crane.jpg", alt: "The JJM team in hard hats and hi-vis in front of a downtown crane lift" },
    ],
    aspect: "aspect-[5/7]",
  },
];

export const sameDay = "We provide same-day service for urgent issues.";

export const partners = [
  "BC Safety Authority",
  "BCWWA",
  "Canadian Business",
  "FortisBC",
  "TECA Member",
  "Navien",
  "WorkSafeBC",
];
