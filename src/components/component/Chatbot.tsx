"use client";

export default function ChatBotSection() {
  return (
    <section className="relative py-16 mb-24 bg-black max-sm:h-full max-sm:mt-10 h-[400px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 rounded-2xl"
        style={{ backgroundImage: "url('/planet.jpeg')" }}
      ></div>

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-50 z-0 rounded-2xl"></div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-4 lg:px-8">
        {/* Left Side Text */}
        <div className="text-white max-w-lg">
          <h2 className="text-5xl font-bold mb-6 leading-tight text-center">
            Crearemos juntos un chat bot de inteligencia artificial
          </h2>
        </div>

        {/* Chatbot Example */}
        <div className="bg-white  rounded-lg shadow-lg mt-10 lg:mt-0 lg:ml-8 flex-shrink-0 p-8 relative max-w-md w-full">
          {/* Support Bot Header */}
          <div className="absolute top-4 left-4 text-blue-600 flex items-center space-x-2">
            <div className="rounded-full bg-blue-600 h-4 w-4"></div>
            <h4 className="text-lg font-bold">Support Bot</h4>
            <span className="text-gray-500">Online</span>
          </div>

          {/* Chat Messages */}
          <div className="mt-10">
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <p className="text-gray-600">
                👋 Welcome to Support Bot. I&apos;m ChatBot, your AI assistant.
                Let me know how I can help you.
              </p>
            </div>
            <div className="bg-blue-500 text-white rounded-lg p-4 mb-4">
              <p className="font-semibold">
                Hi, How much time do I have left for my order to be returned?
              </p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-600">
                You can return your items within 30 days of receiving your
                package from the store.
              </p>
            </div>
          </div>

          {/* Disabled Button */}
          <button
            className="bg-black text-white py-2 px-4 rounded mt-6 block mx-auto cursor-not-allowed opacity-50"
            disabled
          >
            Pruébalo tú mismo
          </button>
        </div>
      </div>
    </section>
  );
}
