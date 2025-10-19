import icon from "../assets/react.svg";

export default function Services() {
  const items = [
    { icon, title: "Industrial Manufacturing" },
    { icon, title: "Automotive Manufacturing" },
    { icon, title: "Mechanical Engineering" },
    { icon, title: "Building Management" },
  ];
  return (
    <section id="services" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <h4 className="text-gradient font-semibold">OUR SERVICES</h4>
          <h2 className="text-3xl md:text-4xl font-extrabold">WHAT WE DO?</h2>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <div
              key={it.title}
              className="flex items-center justify-between border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition bg-white"
            >
              <div className="flex items-center gap-4">
                <img src={it.icon} className="w-10 h-10" alt="" />
                <h4 className="font-semibold">{it.title}</h4>
              </div>
              <a
                className="px-3 py-1 border rounded-full text-xs uppercase hover:bg-orange-50 border-orange-500 text-orange-600"
                href="#"
              >
                details <i className="icofont-double-right ml-1" />
              </a>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <a
            href="#services"
            className="inline-flex items-center px-6 py-3 text-white bg-orange-600 hover:bg-orange-700 rounded-lg"
          >
            Others Service <i className="icofont-double-right ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}
