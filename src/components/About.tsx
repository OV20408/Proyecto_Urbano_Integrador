import bg from "../assets/hero-img2.webp";

export default function About() {
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          <img src={bg} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/40" />
          <div className="relative grid md:grid-cols-2 gap-10 p-10 md:p-16">
            <div>
              <h4 className="text-gradient font-semibold">ABOUT COMPANY</h4>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
                CONNECT WITH <span className="orange-text-marker-dark">INDUSTE.</span>
              </h2>
              <h3 className="text-xl md:text-2xl text-white/90 mt-2">
                WE HAVE <span className="orange-text-marker-light">28 YEARS</span> OF EXPERIENCE with 100% job success.
              </h3>
            </div>
            <div className="text-white/90 space-y-3">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard printer.
              </p>
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                industry's standard printer.
              </p>
              <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
