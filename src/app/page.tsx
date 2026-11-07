import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import News from "@/components/News";
import Banner from "@/components/Banner";
import ServiceSection from "@/components/ServiceSection";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import { bannerCustomers, bannerSince, sections } from "@/content/home";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <News />
        <Banner image={bannerSince.image} lines={bannerSince.lines} />
        {sections.map((section) => (
          <ServiceSection key={section.id} section={section} />
        ))}
        <Banner image={bannerCustomers.image} lines={bannerCustomers.lines} align="centre" />
      </main>
      <Footer />
      {/* Mounted last so its effects run after this page's DOM has hydrated. */}
      <Motion />
    </>
  );
}
