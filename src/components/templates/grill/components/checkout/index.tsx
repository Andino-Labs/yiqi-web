import Evento from "./landing/event";
import Feature from "./landing/feats";
import Footer from "./landing/footer";
import ImageGallery from "./landing/gallery";
import Header from "./landing/header";
import VideoBackground from "./landing/herobg";
import Navbar from "./landing/navbar";
import PrecioEvento from "./landing/pricing";
import { Container, Main, Section } from "./mainLayout";

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
