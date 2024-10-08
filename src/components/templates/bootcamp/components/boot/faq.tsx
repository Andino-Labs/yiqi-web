import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import {
  FileIcon,
  HandIcon,
  RadiobuttonIcon,
  StarFilledIcon,
} from "@radix-ui/react-icons";

function FeatDisplayer(props: {
  icon: ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <Card className="h-full transform transition-transform duration-300 hover:-translate-y-2">
      <CardContent className="p-4 h-full flex flex-col items-start">
        {props.icon}
        <h3 className="text-lg sm:text-xl font-semibold mt-2 break-words">
          {props.title}
        </h3>
        <p className="text-sm text-gray-500 mt-2">{props.subtitle}</p>
      </CardContent>
    </Card>
  );
}

export default function Faq() {
  return (
    <div
      id="faq"
      className="max-w-screen flex flex-col items-center justify-center min-h-screen w-full px-4 py-12 sm:px-6 lg:px-8"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-8 text-center">
        ¿Qué encontrarás en <br className="hidden sm:inline" /> nuestro
        Bootcamp?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
        <FeatDisplayer
          icon={<RadiobuttonIcon className="w-6 h-6" />}
          title="Sesiones en vivo"
          subtitle="Cada semana tendremos una sesión de capacitación con un experto en el tema con amplia experiencia"
        />
        <FeatDisplayer
          icon={<FileIcon className="w-6 h-6" />}
          title="Proyectos"
          subtitle="Nuestro programa se enfoca en un 80% de práctica, con ejercicios, tareas y sesiones en vivo de programación, complementado por un 20% de teoría para consolidar los conceptos clave."
        />
        <FeatDisplayer
          icon={<StarFilledIcon className="w-6 h-6" />}
          title="Recompensas"
          subtitle="Premios y recompensas sorpresa para bonificar la participación e innovación de los participantes."
        />
        <FeatDisplayer
          icon={<HandIcon className="w-6 h-6" />}
          title="Mentorías"
          subtitle="Te asignaremos mentores para que puedas resolver todas tus dudas en una sesión privada fuera de clases."
        />
      </div>
    </div>
  );
}
