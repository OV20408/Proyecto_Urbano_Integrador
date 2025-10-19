import reactLogo from "../assets/react.svg";

export default function Features() {
  const items = [
    { icon: reactLogo, title: "Smart Solution", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
    { icon: reactLogo, title: "Award Winning", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
    { icon: reactLogo, title: "Great Support", text: "Lorem Ipsum is simply dummy text of the printing and typesetting industry." },
  ];
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.title} className="border border-slate-100 rounded-2xl p-8 hover:shadow-xl transition bg-white">
            <img src={it.icon} className="w-12 h-12" alt="" />
            <h4 className="mt-4 text-xl font-semibold">{it.title}</h4>
            <p className="mt-2 text-slate-600">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
