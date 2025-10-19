import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import img1 from "../assets/hero-img1.webp";
import img2 from "../assets/hero-img2.webp";

export default function BlogFeed() {
  const posts = [
    { img: img1, date: "03.02.2021", like: "08K", comment: "15K", title: "Business plan will help you figure out how much money you’ll need to start." },
    { img: img2, date: "03.02.2021", like: "08K", comment: "15K", title: "The Truth About Power Is About To Be Revealed." },
  ];
  return (
    <section id="blog" className="py-20">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid items-center grid-cols-1 xl:grid-cols-2 gap-10">
          <div>
            <h4 className="text-gradient font-semibold">BLOG POST</h4>
            <h2 className="text-3xl md:text-4xl font-extrabold">LATEST NEWS FROM OUR BLOG</h2>
            <p className="mt-3 text-slate-600">Lorem Ipsum is simply dummy text of been the industry standard.</p>
            <a href="#" className="inline-flex items-center mt-6 px-6 py-3 text-white bg-orange-600 hover:bg-orange-700 rounded-lg">
              View All Blog
            </a>
          </div>
          <div>
            <Swiper spaceBetween={20} slidesPerView={1} breakpoints={{ 1024: { slidesPerView: 2 } }}>
              {posts.map((p, idx) => (
                <SwiperSlide key={idx}>
                  <article className="rounded-2xl overflow-hidden border border-slate-100 bg-white">
                    <a href="#"><img src={p.img} className="w-full h-48 object-cover" /></a>
                    <div className="p-5">
                      <ul className="flex items-center gap-4 text-xs text-slate-500">
                        <li className="flex items-center gap-1"><i className="icofont-ui-calendar" /><span>{p.date}</span></li>
                        <li className="flex items-center gap-1"><i className="icofont-heart" /><span>{p.like}</span></li>
                        <li className="flex items-center gap-1"><i className="icofont-comment" /><span>{p.comment}</span></li>
                      </ul>
                      <h3 className="mt-3 font-semibold leading-snug"><a href="#">{p.title}</a></h3>
                      <a href="#" className="inline-flex items-center mt-4 text-orange-600 border border-orange-500 rounded-full px-3 py-1 uppercase text-xs">
                        read more <i className="icofont-double-right ml-2" />
                      </a>
                    </div>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
