import { assets } from "../assets/assets";

export default function WorkingProcess() {
  const steps = [
    {
      id: 1,
      title: "Integración de datos",
      desc:
        "Unificamos fuentes confiables (clima, calidad del aire y registros urbanos/industriales) en un modelo común listo para análisis.",
      img: assets.workingImage1,
    },
    {
      id: 2,
      title: "Análisis y predicción",
      desc:
        "Normalizamos indicadores y generamos pronósticos locales de 24–72 h para anticipar episodios y tomar acciones preventivas.",
      img: assets.workingImage2,
    },
    {
      id: 3,
      title: "Alertas y publicación",
      desc:
        "Reglas por umbral y severidad con notificaciones oportunas y paneles web/móvil para autoridades, empresas y ciudadanía.",
      img: assets.workingImage3,
    },
  ];

  return (
    <section className="relative py-20 bg-gradient-to-b from-orange-50 via-white to-white overflow-hidden">
      {/* Glow de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(600px 220px at 85% 0%, rgba(243,154,46,.15), transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Encabezado */}
        <div className="mb-12">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full text-white"
            style={{ background: "linear-gradient(90deg,#f39a2e 0%,#f07a09 100%)" }}
          >
            Flujo de trabajo
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-['Teko'] font-medium text-slate-900">
            ¿Cómo funciona?
          </h2>
          <p className="mt-2 text-slate-600 max-w-2xl">
            De la integración de datos a la acción: un proceso simple, trazable y enfocado en
            decisiones oportunas.
          </p>
        </div>

        {/* Línea de tiempo (conector) */}
        <div className="relative mt-12">
          {/* Línea horizontal solo en md+ */}
          <div className="hidden md:block absolute left-0 right-0 top-12 h-0.5 bg-gradient-to-r from-orange-200 via-orange-300 to-orange-200 rounded-full" />

          {/* Puntos sobre la línea (md+) */}
          <div className="hidden md:block absolute top-[40px] left-0 right-0">
            <div className="relative h-0">
              <span className="absolute left-[16.66%] -translate-x-1/2 w-4 h-4 rounded-full bg-white ring-4 ring-orange-200 shadow" />
              <span className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white ring-4 ring-orange-300 shadow" />
              <span className="absolute left-[83.33%] -translate-x-1/2 w-4 h-4 rounded-full bg-white ring-4 ring-orange-200 shadow" />
            </div>
          </div>

          {/* Tarjetas */}
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <li key={s.id} className="relative">
                <div className="group h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-xl transition-all">
                  {/* Badge + ícono redondo */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      {/* aura */}
                      <div
                        aria-hidden
                        className="absolute -inset-2 rounded-full blur-lg opacity-20"
                        style={{
                          background:
                            "linear-gradient(90deg,#f39a2e 0%,#f07a09 100%)",
                        }}
                      />
                      <div className="w-24 h-24 rounded-full bg-white grid place-content-center shadow-xl ring-4 ring-white relative z-10 group-hover:scale-105 transition">
                        <img
                          src={s.img}
                          alt={s.title}
                          className="w-14 h-14 object-contain"
                        />
                      </div>
                      {/* número */}
                      <span
                        className="absolute -top-2 -right-2 text-xs font-bold text-white px-2 py-1 rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg,#f39a2e 0%,#f07a09 100%)",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Título */}
                    <h3 className="mt-5 text-2xl md:text-3xl font-['Teko'] font-medium text-slate-900">
                      {s.title}
                    </h3>

                    {/* Descripción */}
                    <p className="mt-2 text-slate-600 max-w-xs">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* CTA inferior */}
        
      </div>
    </section>
  );
}
