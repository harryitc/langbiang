import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import BackToTop from "@/components/BackToTop";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/sections/About";
import Journey from "@/components/sections/Journey";
import Activities from "@/components/sections/Activities";
import Timeline from "@/components/sections/Timeline";
import Retro2025Callout from "@/components/Retro2025Callout";
import MorePages from "@/components/MorePages";
import Register from "@/components/sections/Register";
import Faq from "@/components/sections/Faq";
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
        <Marquee />
        <About />
        <Journey />
        <Activities />
        <Timeline />
        <Retro2025Callout />
        <MorePages />
        <Register />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
