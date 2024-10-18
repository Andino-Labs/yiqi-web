import Evento, { GrillEventProps } from "./components/checkout/landing/event";
import Feature from "./components/checkout/landing/feats";
import Footer from "./components/checkout/landing/footer";
import ImageGallery from "./components/checkout/landing/gallery";
import Header from "./components/checkout/landing/header";
import VideoBackground from "./components/checkout/landing/herobg";
import Navbar from "./components/checkout/landing/navbar";
import PrecioEvento, {
  GrillPricingProps,
} from "./components/checkout/landing/pricing";
import { Container, Main, Section } from "./components/checkout/mainLayout";
import { GrillHeaderProps } from "./components/checkout/landing/header";
import { GrillNavbarProps } from "./components/checkout/landing/navbar";
import { GrillFeatureProps } from "./components/checkout/landing/feats";
import { GrillGalleryProps } from "./components/checkout/landing/gallery";

interface GrillTemplateTypes {
  videoBGurl: string
  navProps: GrillNavbarProps
  headerProps: GrillHeaderProps
  eventProps: GrillEventProps
  featureProps: GrillFeatureProps
  pricingProps: GrillPricingProps
  galleryProps: GrillGalleryProps
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
            <Evento
              videoSrc={props.eventProps.videoSrc}
              videoText={props.eventProps.videoText}
              balanceText={props.eventProps.balanceText}
              paymentText={props.eventProps.paymentText}
              motionHeader={props.eventProps.motionHeader}
            />
            <Feature
              featCta={props.featureProps.featCta}
              featMotion1={props.featureProps.featMotion1}
              featMotion2={props.featureProps.featMotion2}
              featureText={props.featureProps.featureText}
            />
            <PrecioEvento
              texts={props.pricingProps.texts}
              title={props.pricingProps.title}
              dateTime={props.pricingProps.dateTime}
              cta={props.pricingProps.cta}
              location={props.pricingProps.location}
              description={props.pricingProps.description}
              videoSrc={props.pricingProps.videoSrc}
              balanceText={props.pricingProps.balanceText}
              videoText={props.pricingProps.videoText}
            />
            <ImageGallery
              header1={props.galleryProps.header1}
              images={props.galleryProps.images}
            />
            <Footer />
          </Section>
        </Container>
      </Main>
    </>
  )
}
