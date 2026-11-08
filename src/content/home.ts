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
  /** YouTube video id, played in the video modal. */
  youtubeId: string;
  /** The video on YouTube: the link when JavaScript is off or opened in a new tab. */
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
    youtubeId: "q_gBUxBfcHc",
    videoUrl: "https://www.youtube.com/watch?v=q_gBUxBfcHc",
    placeholder: true,
  },
  {
    source: "Geotab",
    subtitle: "Improving Safety & Productivity",
    date: "01.10.2026",
    title: "How Fleet Telematics Keeps JJM's Service Vans Safe and On Time Across the Lower Mainland",
    image: { src: "/images/news-van.jpg", alt: "A JJM Mechanical Group service van" },
    youtubeId: "h2nErrkXQ8g",
    videoUrl: "https://www.youtube.com/watch?v=h2nErrkXQ8g",
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
  /** Short name for the services switcher, matching the header nav. */
  navLabel: string;
  icon: string;
  bgIcon: string;
  lead: string;
  body: string;
  href: string;
  /** Shown in order by the pinned services scroller; w and h are the file's real pixel size. */
  images: { src: string; alt: string; w: number; h: number }[];
  aspect: string;
};

export const sections: Section[] = [
  {
    id: "property-management",
    title: ["Property", "Management", "Services"],
    navLabel: "Property",
    icon: "/icons/section-property.svg",
    bgIcon: "/icons/bg-gear.svg",
    lead: "At JJM Mechanical Group",
    body: ", we specialize in providing reliable and efficient mechanical services tailored to the unique needs of property management companies.",
    href: "/property-management",
    images: [
      { src: "/images/property-crane-aerial.jpg", w: 1200, h: 1600, alt: "Aerial view of a crane lifting mechanical equipment onto a downtown rooftop" },
      { src: "/images/property-boiler-skid.jpg", w: 1980, h: 1820, alt: "A packaged boiler skid with manifold piping before installation" },
      { src: "/images/property-navien-wall.jpg", w: 2650, h: 2191, alt: "A wall of Navien water heaters with blue and braided supply lines" },
    ],
    aspect: "aspect-[5/6]",
  },
  {
    id: "plumbing",
    title: ["Plumbing", "Heating", "& Gas Fitting"],
    navLabel: "Plumbing",
    icon: "/icons/section-flame.svg",
    bgIcon: "/icons/bg-flame.svg",
    lead: "JJM Mechanical Group",
    body: " provides comprehensive plumbing, heating, and gas fitting services for residential and commercial clients across the Lower Mainland.",
    href: "/plumbing",
    images: [
      { src: "/images/plumbing-boiler-room.jpg", w: 1476, h: 1129, alt: "A finished boiler room with copper piping, pumps and expansion tanks" },
      { src: "/images/plumbing-meters.jpg", w: 893, h: 1359, alt: "Three brass water meters on insulated white pipes" },
      { src: "/images/plumbing-unit-open.jpg", w: 1036, h: 1500, alt: "The open control panel of a condensing water heater during commissioning" },
    ],
    aspect: "aspect-square",
  },
  {
    id: "backflow",
    title: ["Backflow", "Certification"],
    navLabel: "Backflow",
    icon: "/icons/section-backflow.svg",
    bgIcon: "/icons/bg-backflow.svg",
    lead: "As a proud member of the BCWWA since 2007",
    body: ", JJM Mechanical Group is fully certified to install, test, and repair all makes and sizes of backflow prevention devices.",
    href: "/backflow",
    images: [
      { src: "/images/backflow-assembly.jpg", w: 2560, h: 1903, alt: "A red and green double check valve backflow assembly with test tags" },
      { src: "/images/backflow-gauge.jpg", w: 1220, h: 1500, alt: "A technician holding a backflow test gauge" },
      { src: "/images/backflow-valve.jpg", w: 2475, h: 3000, alt: "A red OS&Y backflow valve with a tamper switch" },
    ],
    aspect: "aspect-[3/2]",
  },
  {
    id: "about",
    title: ["About", "Us"],
    navLabel: "About",
    icon: "/icons/section-about.svg",
    bgIcon: "/icons/bg-about.svg",
    lead: "JJM Mechanical Group has over 20 years of experience",
    body: " in the mechanical trade.",
    href: "/about",
    images: [
      { src: "/images/about-crew-trench.jpg", w: 1014, h: 1499, alt: "The JJM crew replacing a ring main valve in an excavated trench" },
      { src: "/images/about-team-shop.jpg", w: 1500, h: 708, alt: "Five JJM team members in the shop in front of mechanical equipment" },
      { src: "/images/about-team-crane.jpg", w: 921, h: 1500, alt: "The JJM team in hard hats and hi-vis in front of a downtown crane lift" },
    ],
    aspect: "aspect-[5/7]",
  },
];

export const sameDay = "We provide same-day service for urgent issues.";

export type Partner = { name: string; src: string; w: number; h: number; height: number };

/**
 * Footer logos, trimmed to their artwork. height is the displayed height in px on desktop, set by eye
 * so a round seal and a long wordmark look the same visual weight in one row.
 */
export const partners: Partner[] = [
  { name: "British Columbia Safety Authority", src: "/partners/bc-safety-authority.png", w: 176, h: 85, height: 40 },
  { name: "BCWWA, BC Water & Waste Association", src: "/partners/bcwwa.png", w: 292, h: 70, height: 30 },
  { name: "Interprovincial Standard Red Seal", src: "/partners/red-seal.png", w: 151, h: 153, height: 50 },
  { name: "FortisBC", src: "/partners/fortisbc.png", w: 333, h: 72, height: 26 },
  { name: "Proud TECA Member, Thermal Environmental Comfort Association", src: "/partners/teca-member.png", w: 247, h: 81, height: 34 },
  { name: "Navien", src: "/partners/navien.png", w: 342, h: 46, height: 22 },
  { name: "WorkSafeBC", src: "/partners/worksafebc.png", w: 342, h: 65, height: 26 },
];
