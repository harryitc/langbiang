import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BannerSlider from "@/components/BannerSlider";
import News from "@/components/sections/News";
import About from "@/components/sections/About";
import WhyJoin from "@/components/sections/WhyJoin";
import DonateBand from "@/components/DonateBand";
import Register from "@/components/sections/Register";
import Faq from "@/components/sections/Faq";
import ExploreGrid from "@/components/ExploreGrid";
import Sponsors from "@/components/sections/Sponsors";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <ThemeToggle />
      <BackToTop />
      <Header />
      <main>
        <Hero />
        <BannerSlider />
        <News carousel />
        <About />
        <WhyJoin />
        <DonateBand />
        <Register />
        <Faq />
        <ExploreGrid />
        <Sponsors />
      </main>
      <Footer />
    </>
  );
}
