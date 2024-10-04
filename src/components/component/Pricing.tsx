"use client";

export default function PricingSection() {
  return (
    <section className="relative py-16 overflow-hidden bg-black">
      {/* Warp Speed Stars */}
      <div className="absolute inset-0 z-0">
        <div className="warp-stars white-stars"></div>
        <div className="warp-stars blue-stars"></div>
        <div className="warp-stars yellow-stars"></div>
        <div className="warp-stars red-stars"></div>
      </div>

      {/* Pricing Content */}
      <div className="relative z-10 text-center text-white max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">Nuestros precios</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-4">
          {/* General Price */}
          <div className="bg-white text-black p-8 rounded-lg shadow-lg bg-opacity-90">
            <h3 className="text-6xl font-bold text-gray-400">$170</h3>
            <p className="text-2xl font-semibold mt-4">Precio general</p>
            <ul className="mt-6 space-y-2 text-left text-gray-600">
              <li>• Acceso al bootcamp 4 fechas</li>
              <li>• Material educativo</li>
              <li>• Tutorías online</li>
              <li>• Evento presencial networking</li>
            </ul>
          </div>

          {/* Andino Price */}
          <div className="bg-white text-black p-8 rounded-lg shadow-lg bg-opacity-90">
            <h3 className="text-6xl font-bold text-gray-400">$100</h3>
            <p className="text-2xl font-semibold mt-4">Precio Andino</p>
            <p className="text-sm text-gray-500">
              (Descuento a miembros de Andino VIP)
            </p>
            <ul className="mt-6 space-y-2 text-left text-gray-600">
              <li>• Acceso al bootcamp 4 fechas</li>
              <li>• Material educativo</li>
              <li>• Tutorías online</li>
              <li>• Evento presencial networking</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Styles for Stars */}
      <style jsx>{`
        /* Warp Stars Effect */
        .warp-stars {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: transparent;
          z-index: 0;
        }

        /* White Stars */
        .white-stars {
          background: radial-gradient(circle, white 2px, transparent 4px);
          background-size: 100px 100px; /* Increased star density */
          animation: warpSpeed 4.25s linear infinite; /* 15% faster */
        }

        /* Blue Stars */
        .blue-stars {
          background: radial-gradient(circle, blue 2px, transparent 4px);
          background-size: 125px 125px; /* Increased star density */
          animation: warpSpeed 5.1s linear infinite; /* 15% faster */
        }

        /* Yellow Stars */
        .yellow-stars {
          background: radial-gradient(circle, yellow 2px, transparent 4px);
          background-size: 150px 150px; /* Increased star density */
          animation: warpSpeed 5.95s linear infinite; /* 15% faster */
        }

        /* Red Stars */
        .red-stars {
          background: radial-gradient(circle, red 2px, transparent 4px);
          background-size: 175px 175px; /* Increased star density */
          animation: warpSpeed 6.8s linear infinite; /* 15% faster */
        }

        @keyframes warpSpeed {
          0% {
            transform: translateZ(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateZ(500px) scale(3);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}
