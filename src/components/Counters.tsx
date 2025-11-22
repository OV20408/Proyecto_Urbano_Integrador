import { useState, useEffect, useRef } from "react";

type CounterItem = {
  value: number;
  target: number;
  suffix?: string;
  label: string;
};

export default function Counters() {
  const [counters, setCounters] = useState<CounterItem[]>([
    { value: 0, target: 24, suffix: "", label: "Zonas monitoreadas" },
    { value: 0, target: 1250, suffix: "+", label: "Alertas emitidas (demo)" },
    { value: 0, target: 589, suffix: "K", label: "Registros procesados" },
  ]);

  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
      // limpia timers si el componente se desmonta durante la animación
      timersRef.current.forEach((t) => window.clearInterval(t));
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 1800;
    const steps = 60;
    const interval = duration / steps;

    counters.forEach((counter, index) => {
      let current = 0;
      const increment = counter.target / steps;

      const timer = window.setInterval(() => {
        current += increment;
        if (current >= counter.target) {
          current = counter.target;
          window.clearInterval(timer);
        }
        setCounters((prev) => {
          const copy = [...prev];
          copy[index] = { ...copy[index], value: Math.floor(current) };
          return copy;
        });
      }, interval);

      timersRef.current.push(timer);
    });
  };

  const Icon = ({ i }: { i: number }) => {
    const base =
      "w-16 h-16 rounded-2xl grid place-content-center shadow-lg ring-1 ring-orange-100 bg-white";
    return (
      <div className={`${base}`}>
        {i === 0 && (
          // Mapa / zonas
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.13 2 5 5.08 5 8.88c0 4.93 5.54 10.38 6.01 10.83a1.4 1.4 0 0 0 1.98 0C13.46 19.26 19 13.81 19 8.88 19 5.08 15.87 2 12 2Zm0 9.25a2.37 2.37 0 1 1 0-4.75 2.37 2.37 0 0 1 0 4.75Z"
              fill="url(#g1)"
            />
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="24" y2="24">
                <stop stopColor="#f39a2e" />
                <stop offset="1" stopColor="#f07a09" />
              </linearGradient>
            </defs>
          </svg>
        )}
        {i === 1 && (
          // Campana / alertas
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 8a6 6 0 1 0-12 0c0 4-2 5-2 5h16s-2-1-2-5Zm-6 12a3 3 0 0 0 3-3H9a3 3 0 0 0 3 3Z"
              fill="url(#g2)"
            />
            <defs>
              <linearGradient id="g2" x1="0" y1="0" x2="24" y2="24">
                <stop stopColor="#f39a2e" />
                <stop offset="1" stopColor="#f07a09" />
              </linearGradient>
            </defs>
          </svg>
        )}
        {i === 2 && (
          // Base de datos / registros
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 6c0-2 4-3 8-3s8 1 8 3-4 3-8 3-8-1-8-3Zm0 4c0 2 4 3 8 3s8-1 8-3m-16 4c0 2 4 3 8 3s8-1 8-3"
              stroke="url(#g3)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="g3" x1="0" y1="0" x2="24" y2="24">
                <stop stopColor="#f39a2e" />
                <stop offset="1" stopColor="#f07a09" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          {counters.map((c, i) => (
            <div key={c.label} className="flex items-center gap-6 justify-center md:justify-start">
              <Icon i={i} />
              <div>
                <h2 className="text-5xl md:text-6xl font-['Teko'] font-medium mb-1 bg-clip-text text-transparent bg-gradient-to-r from-[#f39a2e] to-[#f07a09]">
                  {c.value.toLocaleString()}
                  {c.suffix}
                </h2>
                <span className="text-slate-600 text-sm uppercase tracking-wider">{c.label}</span>
              </div>
            </div>
          ))}

          {/* Separadores verticales sólo en md+ */}
          <div className="hidden md:block absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-px h-20 bg-orange-200" />
          <div className="hidden md:block absolute top-1/2 left-2/3 -translate-x-1/2 -translate-y-1/2 w-px h-20 bg-orange-200" />
        </div>
      </div>
    </section>
  );
}
