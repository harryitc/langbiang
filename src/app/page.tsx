import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BannerSlider from "@/components/BannerSlider";
import News from "@/components/sections/News";
import About from "@/components/sections/About";
import DonateBand from "@/components/DonateBand";
import Register from "@/components/sections/Register";
import Faq from "@/components/sections/Faq";
import ExploreGrid from "@/components/ExploreGrid";
import Footer from "@/components/sections/Footer";
import { getContent } from "@/lib/content/store";

export default async function Home() {
  const { news, gallery, faqs, site: meta } = await getContent();
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <ThemeToggle />
      <BackToTop />
      <Header />
      <main>
        <Hero dateLabel={meta.dateLabel} />
        <About />
        <BannerSlider items={gallery} />
        <News carousel posts={news} />
        <DonateBand />
        <Register facebook={meta.facebook} />
        <Faq items={faqs} />
        <ExploreGrid />
      </main>
      <Footer />
    </>
  );
}
