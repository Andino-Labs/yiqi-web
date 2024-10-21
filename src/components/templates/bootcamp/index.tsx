import Faq, { FAQProps } from './components/boot/faq'
import ContactSection, { ContactProps } from './components/contactsection'
import { Curricula, CurriculaProps } from './components/curricula/curricula'
import MinimalisticFooter, {
  MinimalisticFooterProps
} from './components/footer'
import ResponsiveVideoHero, {
  ResponsiveVideoHeroProps
} from './components/hero/hero'
import Navbar, { NavBarProps } from './components/navbar/navbar'
import Pricing, { pricingProps } from './components/pricing'
import TrustedByCarousel, {
  TrustedByCarouselProps
} from './components/trusted/trusted'

interface BootcampTemplateProp {
  Navprop: NavBarProps
  ResponsiveProp: ResponsiveVideoHeroProps
  TrustedByprop: TrustedByCarouselProps
  FaqProp: FAQProps
  CurriculaProps: CurriculaProps
  pricingProp: pricingProps
  ContactProp: ContactProps
  FooterProps: MinimalisticFooterProps
}

export default async function BootcampTemplate1(props: BootcampTemplateProp) {
  return (
    <main className="absolute flex flex-col max-w-screen items-center justify-center w-full md:px-16 p-7">
      <Navbar
        imgSrc={props.Navprop.imgSrc}
        url={props.Navprop.url}
        cta={props.Navprop.cta}
      />
      <ResponsiveVideoHero videoProps={props.ResponsiveProp.videoProps} />
      <TrustedByCarousel title={props.TrustedByprop.title} />
      <Faq
        feat1={props.FaqProp.feat1}
        feat2={props.FaqProp.feat2}
        feat3={props.FaqProp.feat3}
        feat4={props.FaqProp.feat4}
        header1={props.FaqProp.header1}
        header2={props.FaqProp.header2}
      />
      <Curricula
        dummyContent={props.CurriculaProps.dummyContent}
        title={props.CurriculaProps.title}
        url={props.CurriculaProps.url}
      />
      <Pricing
        imageSrc={props.pricingProp.imageSrc}
        priceDetails={props.pricingProp.priceDetails}
        title={props.pricingProp.title}
      />
      <ContactSection
        header={props.ContactProp.header}
        videoSrc={props.ContactProp.videoSrc}
        videoText={props.ContactProp.videoText}
      />
      <MinimalisticFooter
        imageSrc={props.FooterProps.imageSrc}
        socials={props.FooterProps.socials}
      />
    </main>
  )
}
