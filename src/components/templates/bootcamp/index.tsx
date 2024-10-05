import Faq from "./components/boot/faq";
import ContactSection from "./components/contactsection";
import { Curricula } from "./components/curricula/curricula";
import MinimalisticFooter from "./components/footer";
import ResponsiveVideoHero from "./components/hero/hero";
import Navbar from "./components/navbar/navbar";
import Pricing from "./components/pricing";
import TrustedByCarousel from "./components/trusted/trusted";

export default async function BootcampTemplate1() {
  return (
    <main className="absolute flex flex-col max-w-screen items-center justify-center w-full md:px-16 p-7">
      <Navbar />
      <ResponsiveVideoHero />
      <TrustedByCarousel />
      <Faq />
      <Curricula />
      <Pricing />
      <ContactSection />
      <MinimalisticFooter />
    </main>
  );
}
