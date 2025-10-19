import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import logo from "../assets/react.svg";

export default function ClientLogos() {
  const logos = Array.from({ length: 6 }).map(() => logo);
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-b-2 border-slate-200 pb-12">
          <Swiper spaceBetween={30} slidesPerView={2} breakpoints={{ 640: { slidesPerView: 3 }, 1024: { slidesPerView: 6 } }}>
            {logos.map((l, idx) => (
              <SwiperSlide key={idx}>
                <a href="#" className="flex items-center justify-center">
                  <img src={l} className="h-10" />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
