import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import News from "@/components/News";
import Banner from "@/components/Banner";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";
import { bannerCustomers, bannerSince } from "@/content/home";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <News />
        <Banner image={bannerSince.image} lines={bannerSince.lines} />
        <Services />
        <Banner image={bannerCustomers.image} lines={bannerCustomers.lines} align="centre" />
      </main>
      <Footer />
      {/* Mounted last so its effects run after this page's DOM has hydrated. */}
      <Motion />
    </>
  );
}
