import Faq from './components/boot/faq'
import ContactSection from './components/contactsection'
import { Curricula } from './components/curricula/curricula'
import MinimalisticFooter from './components/footer'
import ResponsiveVideoHero from './components/hero/hero'
import Navbar from './components/navbar/navbar'
import Pricing from './components/pricing'
import TrustedByCarousel from './components/trusted/trusted'

// ResponsiveVideoHero props
const videoSrc = '/e.mp4'
const videoText = 'Your browser does not support the video tag.'
const title = 'Impulsa tu carrera en inteligencia artificial'
const description =
  'Unete al futuro de la industria tecnologica con este bootcamp hecho por expertos de la industria'
const ctaUrl1 = '#contacto'
const cta1 = 'Quiero empezar!'
const ctaUrl2 = '#curricula'
const cta2 = 'Quiero saber más'

// trusted by carousel

const TrustedTitle = 'Hemos capacitado a equipos de:'

// FAQ

const header1 = '¿Qué encontrarás en'
const header2 = ' nuestro Bootcamp?'
const feat1 = {
  title: 'Sesiones en vivo',
  subtitle:
    'Cada semana tendremos una sesión de capacitación con un experto en el tema con amplia experiencia'
}

const feat2 = {
  title: 'Proyectos',
  subtitle:
    'Nuestro programa se enfoca en un 80% de práctica, con ejercicios, tareas y sesiones en vivo de programación, complementado por un 20% de teoría para consolidar los conceptos clave.'
}

const feat3 = {
  title: 'Recompensas',
  subtitle:
    'Premios y recompensas sorpresa para bonificar la participación e innovación de los participantes.'
}

const feat4 = {
  title: 'Mentorías',
  subtitle:
    'Te asignaremos mentores para que puedas resolver todas tus dudas en una sesión privada fuera de clases.'
}

export default async function BootcampTemplate1() {
  return (
    <main className="absolute flex flex-col max-w-screen items-center justify-center w-full md:px-16 p-7">
      <Navbar />
      <ResponsiveVideoHero
        videoText={videoText}
        cta1={cta1}
        cta2={cta2}
        ctaUrl1={ctaUrl1}
        ctaUrl2={ctaUrl2}
        description={description}
        title={title}
        videoSrc={videoSrc}
      />
      <TrustedByCarousel title={TrustedTitle} />
      <Faq
        feat1={feat1}
        feat2={feat2}
        feat3={feat3}
        feat4={feat4}
        header1={header1}
        header2={header2}
      />
      <Curricula />
      <Pricing />
      <ContactSection />
      <MinimalisticFooter />
    </main>
  )
}
