import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import News from "@/components/News";
import Banner from "@/components/Banner";
import Services from "@/components/Services";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";
import Motion from "@/components/Motion";
import { bannerCustomers, bannerSince, hero } from "@/content/home";

export default function Home() {
  return (
    <>
      <Header />
      <PageTransition>
      <main>
        <Hero image={hero.image} lines={hero.lines} cta={hero.cta} />
        <Marquee />
        <News />
        <Banner image={bannerSince.image} lines={bannerSince.lines} />
        <Services />
        <Banner image={bannerCustomers.image} lines={bannerCustomers.lines} align="centre" />
      </main>
      <Footer />
      </PageTransition>
      {/* Mounted last so its effects run after this page's DOM has hydrated. */}
      <Motion />
    </>
  );
}
