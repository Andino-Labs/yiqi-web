import Evento from "./components/checkout/landing/event";
import Feature from "./components/checkout/landing/feats";
import Footer from "./components/checkout/landing/footer";
import ImageGallery from "./components/checkout/landing/gallery";
import Header from "./components/checkout/landing/header";
import VideoBackground from "./components/checkout/landing/herobg";
import Navbar from "./components/checkout/landing/navbar";
import PrecioEvento from "./components/checkout/landing/pricing";
import { Container, Main, Section } from "./components/checkout/mainLayout";

export default function Home() {
  return (
    <>
      <VideoBackground />
      <Navbar />
      <Main>
        <Container>
          <Section>
            <Header />
            <Evento />
            <Feature />
            <PrecioEvento />
            <ImageGallery />
            <Footer />
          </Section>
        </Container>
      </Main>
    </>
  );
}
