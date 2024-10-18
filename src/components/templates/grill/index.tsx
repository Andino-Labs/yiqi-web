import Evento from "./components/checkout/landing/event";
import Feature from "./components/checkout/landing/feats";
import Footer from "./components/checkout/landing/footer";
import ImageGallery from "./components/checkout/landing/gallery";
import Header from "./components/checkout/landing/header";
import VideoBackground from "./components/checkout/landing/herobg";
import Navbar from "./components/checkout/landing/navbar";
import PrecioEvento from "./components/checkout/landing/pricing";
import { Container, Main, Section } from "./components/checkout/mainLayout";
import { GrillHeaderProps } from "./components/checkout/landing/header";
import { GrillNavbarProps } from "./components/checkout/landing/navbar";
interface GrillTemplateTypes {
  videoBGurl: string;
  navProps: GrillNavbarProps;
  headerProps: GrillHeaderProps;
}

export default function GrillTemplate(props: GrillTemplateTypes) {
  return (
    <>
      <VideoBackground videoUrl={props.videoBGurl} />
      <Navbar cta={props.navProps.cta} navItems={props.navProps.navItems} />
      <Main>
        <Container>
          <Section>
            <Header
              cta={props.headerProps.cta}
              headerDescription={props.headerProps.headerDescription}
              headerTitleSecondary={props.headerProps.headerTitleSecondary}
              headerTitle={props.headerProps.headerTitle}
            />
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
