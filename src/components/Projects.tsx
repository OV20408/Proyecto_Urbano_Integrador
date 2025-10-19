import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import hero1 from "../assets/hero-img1.webp";
import hero2 from "../assets/hero-img2.webp";
import hero3 from "../assets/hero-img3.webp";

const items = [hero1, hero2, hero3, hero1].map((img) => ({
  img,
  title: "Power Systems",
  cat: "factory / industry",
}));

export default function Projects() {
  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h4 className="text-gradient font-semibold">OUR PORTFOLIO</h4>
          <h2 className="text-3xl md:text-4xl font-extrabold">SOME PROJECT’S</h2>
        </div>

        <div className="mt-10 relative">
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
          >
            {items.map((it, idx) => (
              <SwiperSlide key={idx}>
                <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white">
                  <img src={it.img} className="w-full h-56 object-cover" />
                  <div className="p-5 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{it.title}</h3>
                      <span className="text-xs uppercase tracking-wide text-slate-500">{it.cat}</span>
                    </div>
                    <a
                      href="#"
                      title="details"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 text-orange-600"
                    >
                      <i className="icofont-long-arrow-right" />
                    </a>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="text-center mt-16">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 text-white bg-orange-600 hover:bg-orange-700 rounded-lg"
          >
            All Projects <i className="icofont-double-right ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}
