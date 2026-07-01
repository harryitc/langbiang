import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/sections/About";
import Journey from "@/components/sections/Journey";
import Activities from "@/components/sections/Activities";
import Timeline from "@/components/sections/Timeline";
import Gallery from "@/components/sections/Gallery";
import Register from "@/components/sections/Register";
import Faq from "@/components/sections/Faq";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <Header />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Journey />
        <Activities />
        <Timeline />
        <Gallery />
        <Register />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
