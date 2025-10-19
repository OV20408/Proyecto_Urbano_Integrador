import heroImage from "../assets/hero-img1.webp";
import { useEffect, useState } from "react";

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300); // delay suave al entrar
  }, []);

  return (
    <section
      className="relative w-full flex flex-col justify-center items-center text-center text-white h-[130vh] bg-cover bg-center transition-all duration-700"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
        transform: "scale(1.35)", // pequeño zoom tipo plantilla
      }}
    >
      {/* capa sutil de color (como en la original) */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-400/30 to-orange-800/50" />

      {/* contenido */}
      <div
        className={`relative z-10 mt-28 transition-all duration-1000 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-10"
        }`}
      >
        <h3 className="text-sm uppercase tracking-widest mb-3">
          Proyecto Integrador – UNIVALLE
        </h3>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg leading-tight">
          Plataforma Ambiental Urbana Predictiva
        </h1>
        <p className="text-lg max-w-xl mx-auto mb-8 drop-shadow-sm">
          Promoviendo ciudades sostenibles mediante análisis predictivo y
          automatización ambiental.
        </p>
        <button
          className="px-8 py-3 font-semibold rounded-full transition-transform transform hover:scale-105 shadow-md text-white"
          style={{
            background:
              "linear-gradient(90deg, #ff6600 0%, #ffa733 100%)", // gradiente exacto del botón original
          }}
        >
          Explorar Proyecto
        </button>
      </div>
    </section>
  );
};

export default Hero;
