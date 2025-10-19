// src/components/HeroSlider.tsx
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";

import hero1 from "../assets/hero-img1.webp";
import hero2 from "../assets/hero-img2.webp";
import hero3 from "../assets/hero-img3.webp";

const slides = [
  {
    img: hero1,
    title: "Plataforma Ambiental",
    titleSecond: "Urbana Predictiva",
  },
  {
    img: hero2,
    subtitle: "INNOVACIÓN Y SOSTENIBILIDAD",
    title: "Análisis Predictivo",
    titleSecond: "Para Tu Ciudad",
    description: "Tecnología avanzada para un futuro más verde",
  },
  {
    img: hero3,
    subtitle: "ODS 11 - CIUDADES SOSTENIBLES",
    title: "Automatización",
    titleSecond: "Ambiental Inteligente",
    description: "Soluciones inteligentes para el medio ambiente urbano",
  },
];

const HeroSlider = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        effect="fade"
        pagination={{ clickable: true }}
        className="hero-swiper h-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full">
              {/* Imagen con zoom lento */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.img}
                  className="w-full h-full object-cover animate-slowZoom"
                  alt={`Hero ${idx + 1}`}
                />
              </div>

              {/* Overlay naranja suave */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(247,154,53,0.4) 0%, rgba(240,122,9,0.5) 100%)",
                }}
              />

              {/* Contenido centrado */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6 md:px-10 z-10">
                <p className="uppercase tracking-[0.3em] text-xs md:text-sm mb-6 font-medium animate-fadeDown">
                  {slide.subtitle}
                </p>

                <h1
                  className="font-bold uppercase leading-[0.9] text-[56px] md:text-[90px] lg:text-[120px] mb-2 animate-fadeDown tracking-tight"
                  style={{ animationDelay: "100ms" }}
                >
                  {slide.title}
                </h1>

                <h2
                  className="font-bold uppercase text-[42px] md:text-[70px] lg:text-[90px] mb-8 animate-fadeDown tracking-tight"
                  style={{ animationDelay: "200ms" }}
                >
                  {slide.titleSecond}
                </h2>

                <p
                  className="text-base md:text-lg max-w-2xl mb-10 animate-fadeDown"
                  style={{ animationDelay: "300ms" }}
                >
                  {slide.description}
                </p>

                <button
                  className="text-white font-semibold px-12 py-4 rounded-full shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fadeDown text-base md:text-lg uppercase tracking-wide"
                  style={{
                    background:
                      "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)",
                    animationDelay: "400ms",
                  }}
                >
                  Explorar Proyecto »
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default HeroSlider;