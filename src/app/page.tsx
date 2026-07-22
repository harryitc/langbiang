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
import Sponsors from "@/components/sections/Sponsors";
import Faq from "@/components/sections/Faq";
import ExploreGrid from "@/components/ExploreGrid";
import Footer from "@/components/sections/Footer";
import { getContent } from "@/lib/content/store";
import { eventDateLabel } from "@/lib/content/year";
import {
  activeRegisterForm,
  COUNTDOWN_LABEL_MAC_DINH,
} from "@/lib/content/schema";

export default async function Home() {
  const { main, currentYear, pastYears, news } = await getContent();
  const { site, event, sponsorTiers } = main;
  // Form đăng ký admin chọn hiển thị ở trang chủ (id hỏng -> lùi về form đầu).
  const registerForm = activeRegisterForm(
    main.registerForms,
    main.activeRegisterFormId
  );
  // Danh mục năm đã qua cho dropdown "Năm" ở header: mới → cũ (FR4).
  const years = [...pastYears].sort((a, b) => b.year - a.year).map((y) => y.year);

  return (
    <>
      <SmoothScroll />
      {/* <Cursor /> */}
      <ThemeToggle />
      <BackToTop />
      <Header
        siteName={site.name}
        headerTitle={site.headerTitle}
        headerTagline={site.headerTagline}
        logo={site.logo}
        pastYears={years}
      />
      <main>
        <Hero
          dateLabel={eventDateLabel(event.dateLabel, currentYear)}
          dateISO={event.dateISO}
          countdownLabel={
            event.countdownLabel?.trim() || COUNTDOWN_LABEL_MAC_DINH
          }
          tagline={site.heroTagline?.trim() || site.tagline}
          subtitle={site.subtitle}
          photos={main.heroPhotos}
        />
        <About />
        <BannerSlider photos={main.gallery} />
        <News posts={news} currentYear={currentYear} carousel limit={5} />
        <DonateBand />
        {registerForm ? (
          <Register facebook={site.facebook} content={registerForm} />
        ) : null}
        <Sponsors tiers={sponsorTiers} currentYear={currentYear} header={main.sponsorsHeader} />
        <Faq faqs={main.faqs} />
        <ExploreGrid />
      </main>
      <Footer />
    </>
  );
}
