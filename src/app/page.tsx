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
import { fillYear } from "@/lib/content/year";

export default async function Home() {
  const { main, currentYear, pastYears, news } = await getContent();
  const { site, event } = main;
  // Danh mục năm đã qua cho dropdown "Năm" ở header: mới → cũ (FR4).
  const years = [...pastYears].sort((a, b) => b.year - a.year).map((y) => y.year);

  return (
    <>
      <SmoothScroll />
      <Cursor />
      <ThemeToggle />
      <BackToTop />
      <Header siteName={site.name} pastYears={years} />
      <main>
        <Hero
          dateLabel={fillYear(event.dateLabel, currentYear)}
          dateISO={event.dateISO}
          tagline={site.tagline}
          subtitle={site.subtitle}
        />
        <About />
        <BannerSlider photos={main.gallery} />
        <News posts={news} currentYear={currentYear} carousel />
        <DonateBand />
        <Register facebook={site.facebook} />
        <Faq faqs={main.faqs} />
        <ExploreGrid />
      </main>
      <Footer />
    </>
  );
}
