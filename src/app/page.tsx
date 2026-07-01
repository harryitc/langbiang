import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ThemeToggle from "@/components/ThemeToggle";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/sections/About";
import Journey from "@/components/sections/Journey";
import Activities from "@/components/sections/Activities";
import Timeline from "@/components/sections/Timeline";
import Gallery from "@/components/sections/Gallery";
import Team from "@/components/sections/Team";
import Volunteers from "@/components/sections/Volunteers";
import Sponsors from "@/components/sections/Sponsors";
import News from "@/components/sections/News";
import Fundraising from "@/components/sections/Fundraising";
import Register from "@/components/sections/Register";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <ThemeToggle />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Journey />
        <Activities />
        <Timeline />
        <Gallery />
        <Team />
        <Volunteers />
        <Sponsors />
        <News />
        <Fundraising />
        <Register />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
