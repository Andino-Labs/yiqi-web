"use client";

export default function CourseTimeline() {
  return (
    <section className="py-16 bg-black text-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <h2 className="text-4xl font-bold text-center mb-6">
          ¿Cuál es el plan de estudios del Bootcamp?
        </h2>

        {/* Subheader */}
        <p className="text-center text-gray-400 mb-12">
          Este bootcamp está diseñado tanto para gerentes de producto como para
          ingenieros. Comenzamos con la teoría y luego nos adentramos en la
          parte técnica y de arquitectura de soluciones. Nuestras clases se
          componen de sesiones virtuales y presenciales. Al final de estas
          sesiones, debería comprender lo siguiente: posibilidades de la
          tecnología, limitaciones, arquitectura de soluciones y monitoreo.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-px bg-gray-600 h-full"></div>

          {/* Course Items */}
          <div className="flex flex-col space-y-12 lg:space-y-16">
            {/* Course 1 */}
            <div className="relative flex">
              {/* Left Content */}
              <div className="w-1/2 pr-8 text-right">
                <h3 className="text-xl font-bold">
                  Introducción a la IA generativa
                </h3>
                <p className="text-gray-400">Modalidad 100% - Flex</p>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full"></div>

              {/* Right Description */}
              <div className="w-1/2 pl-8">
                <p className="text-gray-400">
                  Breve historia de los sistemas de IA y el aprendizaje
                  automático. OpenAI y sus competidores. Comprender las
                  limitaciones actuales y lo que es posible. El consumo de
                  energía y las necesidades de datos del futuro. La necesidad de
                  regulación y los peligros del futuro. Worldcoin como una
                  posible solución.
                </p>
              </div>
            </div>

            {/* Course 2 */}
            <div className="relative flex">
              {/* Left Content */}
              <div className="w-1/2 pr-8 text-right">
                <h3 className="text-xl font-bold">
                  Soluciones de arquitectura
                </h3>
                <p className="text-gray-400">Modalidad 100% en vivo - Flex</p>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full"></div>

              {/* Right Description */}
              <div className="w-1/2 pl-8">
                <p className="text-gray-400">
                  Breve explicación de chatgpt. Ingeniería de Prompt y su
                  evolución. Uso de bases de datos vectoriales. Trabajo dentro
                  de las limitaciones. Agentes y tareas.
                </p>
              </div>
            </div>

            {/* Course 3 */}
            <div className="relative flex">
              {/* Left Content */}
              <div className="w-1/2 pr-8 text-right">
                <h3 className="text-xl font-bold">Optimizar y Medir</h3>
                <p className="text-gray-400">Modalidad 100% en vivo - Flex</p>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-500 rounded-full"></div>

              {/* Right Description */}
              <div className="w-1/2 pl-8">
                <p className="text-gray-400">
                  Langchain y Langsmith. Control de costes y limitaciones.
                  Presupuesto a largo plazo. Predicción de costes a largo plazo.
                  Paneles de administración y responsabilidades legales.
                </p>
              </div>
            </div>

            {/* Course 4 - Highlighted */}
            <div className="relative flex">
              {/* Left Content */}
              <div className="w-1/2 pr-8 text-right">
                <h3 className="text-xl font-bold text-yellow-500">
                  Combinando diferentes modelos
                </h3>
                <p className="text-gray-400">Modalidad 100% en vivo</p>
              </div>

              {/* Timeline Dot */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-500 rounded-full"></div>

              {/* Right Description */}
              <div className="w-1/2 pl-8">
                <p className="text-gray-400">
                  Ejemplos de agentes como cursor y replit. Comprender su rol
                  como ingeniero de IA. Agregar voz a la mezcla. Autogen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
