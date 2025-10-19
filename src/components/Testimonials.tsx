import { useState } from "react";
import avatar from "../assets/react.svg";

const testimonials = [
  { id: 1, name: "Tonya Anderson", desig: "CEO OF INDUSTE, USA", text: "It is a long established fact that a reader will be distracted by readable content.", img: avatar },
  { id: 2, name: "Kevin L. Davis", desig: "CEO OF INDUSTE, USA", text: "It is a long established fact that a reader will be distracted by readable content.", img: avatar },
  { id: 3, name: "Todd A. Hogan", desig: "CEO OF INDUSTE, USA", text: "It is a long established fact that a reader will be distracted by readable content.", img: avatar },
  { id: 4, name: "Harold S. Powers", desig: "CEO OF INDUSTE, USA", text: "It is a long established fact that a reader will be distracted by readable content.", img: avatar },
  { id: 5, name: "Adriana M. Hennessy", desig: "CEO OF INDUSTE, USA", text: "It is a long established fact that a reader will be distracted by readable content.", img: avatar },
  { id: 6, name: "Paula M. Miller", desig: "CEO OF INDUSTE, USA", text: "It is a long established fact that a reader will be distracted by readable content.", img: avatar },
  { id: 7, name: "Nicky F. Eickhoff", desig: "CEO OF INDUSTE, USA", text: "It is a long established fact that a reader will be distracted by readable content.", img: avatar },
];

export default function Testimonials() {
  const [active, setActive] = useState(1);
  const t = testimonials.find((x) => x.id === active)!;
  return (
    <section className="py-20 bg-slate-50 relative">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          <div>
            <div className="text-center xl:text-left">
              <h4 className="text-gradient font-semibold">happy customer</h4>
              <h2 className="text-3xl md:text-4xl font-extrabold">SAY ABOUT US.</h2>
            </div>
            <div className="mt-8 bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <p className="text-slate-600">{t.text}</p>
              <h3 className="mt-6 text-2xl font-bold">{t.name}</h3>
              <span className="text-sm uppercase tracking-wide text-slate-500">{t.desig}</span>
            </div>
          </div>
          <div className="hidden xl:block">
            <div className="w-40 h-40 rounded-full bg-orange-100 mx-auto" />
          </div>
        </div>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {testimonials.map((x) => (
            <li key={x.id}>
              <button
                onClick={() => setActive(x.id)}
                className={`rounded-full border ${active === x.id ? "border-orange-500" : "border-transparent"} p-1 transition`}
              >
                <img src={x.img} className="w-14 h-14 rounded-full" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
