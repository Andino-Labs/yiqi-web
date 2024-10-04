import Image from "next/image";
import PricingSection from "../components/component/Pricing";
import ChatBotSection from "../components/component/Chatbot";
import LearningTrack from "../components/component/LearningTrack";

export default function Home() {
  return (
    <div className="min-h-screen max-w-screen-xl w-full m-auto">
      {/* Header */}
      <header className="flex justify-between items-center py-6 pr-8 max-sm:pr-0 bg-white">
        <div className="w-40 h-auto">
          {/* Logo */}
          <Image
            src="/logo.png" // Replace with the correct path to your logo
            alt="Andino Logo"
            width={160} // Adjust the width according to your logo size
            height={40} // Adjust the height according to your logo size
            objectFit="contain" // Ensures the logo fits well inside the container
          />
        </div>
        <nav className="flex max-sm:space-x-2 space-x-8 ">
          <a
            href="https://www.youtube.com/@andinolabs"
            target="_blank"
            className="text-gray-600"
          >
            Eventos pasados
          </a>
          <a
            href="https://chat.whatsapp.com/HMwENgYBbnX5Qag9lz9YDR"
            target="_blank"
            className="text-gray-600"
          >
            Comunidad
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[533px] rounded-3xl overflow-visible bg-white"
        style={{ backgroundImage: `url('/header.jpeg')` }}
      >
        <div className="absolute inset-0  opacity-50"></div>
        <div className="absolute inset-0 flex flex-col top-[160px] text-white text-center">
          <h1 className="max-sm:text-3xl font-bold max-xl:text-5xl text-6xl max-xl:w-[500px] w-[700px] max-xl:ml-5 max-sm:max-w-full max-sm:m-0">
            Impulsa tu carrera en inteligencia artificial
          </h1>
        </div>
        <Image
          className="absolute right-10 bottom-[-200px] max-sm:bottom-[-100px] max-sm:right-0"
          src="/spaceship.png" // Replace with the correct path to your logo
          alt="spaceship"
          width={600} // Adjust the width according to your logo size
          height={600} // Adjust the height according to your logo size
          objectFit="contain" // Ensures the logo fits well inside the container
        />
      </section>

      <section>
        <p className="max-w-[400px] text-lg mt-2 max-sm:mt-20">
          En Andino Labs, nuestra misión es cerrar la brecha tecnológica
          proporcionando capacitación de alta calidad para impulsar tu carrera.
          Nuestro equipo investiga y aplica constantemente las últimas
          tecnologías en nuestro portafolio de productos para ayudarte a
          comprender casos de uso de alto impacto.
        </p>
      </section>

      {/* Partners Section */}
      {/* <section className="py-12  text-center">
        <h2 className="text-2xl font-bold">Nuestros aliados</h2>
        <div className="flex justify-center space-x-16 mt-8">
          <Image src="/spacex.png" alt="SpaceX" width={100} height={50} />
          <Image src="/nasa.png" alt="NASA" width={100} height={50} />
          <Image src="/boeing.png" alt="Boeing" width={100} height={50} />
          <Image
            src="/astroscale.png"
            alt="Astroscale"
            width={100}
            height={50}
          />
        </div>
      </section> */}

      {/* Bootcamp Section */}
      <section className="py-16 bg-white text-center flex max-xl:flex-row flex-col max-sm:flex-col">
        <h2 className="text-4xl font-bold flex-1 items-center justify-center max-xl:pt-[15%]">
          ¿Qué encontrarás en nuestro Bootcamp?
        </h2>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mt-8 px-8">
          <div>
            <div className="bg-gray-200 h-16 w-16 mx-auto rounded"></div>
            <h3 className="text-xl font-semibold mt-4">Sesiones en vivo</h3>
            <p>
              Cada semana tendremos una sesión de capacitación con un experto en
              el tema con amplia experiencia.
            </p>
          </div>
          <div>
            <div className="bg-gray-200 h-16 w-16 mx-auto rounded"></div>
            <h3 className="text-xl font-semibold mt-4">Proyectos</h3>
            <p>
              Nuestro programa se enfoca en un 80% de práctica con ejercicios y
              tareas en vivo.
            </p>
          </div>
          <div>
            <div className="bg-gray-200 h-16 w-16 mx-auto rounded"></div>
            <h3 className="text-xl font-semibold mt-4">Recompensas</h3>
            <p>
              Premios y recompensas para bonificar la participación y la
              innovación de los participantes.
            </p>
          </div>
          <div>
            <div className="bg-gray-200 h-16 w-16 mx-auto rounded"></div>
            <h3 className="text-xl font-semibold mt-4">Mentorías</h3>
            <p>
              Te asignaremos mentores que resolverán todas tus dudas durante
              sesiones privadas.
            </p>
          </div>
        </div>
      </section>

      <LearningTrack />

      <ChatBotSection />
      {/* AI Chatbot Section */}

      <PricingSection />
      {/* Footer */}
      <footer className="py-12 bg-black text-white text-center">
        <p>© 2024 Odyssey. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
