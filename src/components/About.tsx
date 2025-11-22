import bg from "../assets/hero-img2.webp";

export default function About() {
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-3xl overflow-hidden">
          <img src={bg} alt="Panorámica urbana de Santa Cruz" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/50" />
          <div className="relative grid md:grid-cols-2 gap-10 p-10 md:p-16">
            {/* Lado izquierdo: títulos */}
            <div>
              <span
                className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full text-white"
                style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
              >
                SOBRE LA PLATAFORMA
              </span>

              <h2 className="text-3xl md:text-4xl font-extrabold text-white mt-4">
                Plataforma Ambiental Urbana Predictiva{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: "linear-gradient(90deg, #f39a2e, #f07a09)" }}
                >
                  (PAUP)
                </span>
              </h2>

              <h3 className="text-xl md:text-2xl text-white/90 mt-3">
                Datos unificados, pronóstico local y alertas claras para decidir antes y exponerse menos.
              </h3>
            </div>

            {/* Lado derecho: descripción */}
            <div className="text-white/90 space-y-4">


              <p>
                La plataforma ofrece estado actual y <strong>pronóstico de 24–72 horas por zona</strong>, con umbrales
                y reglas de alerta parametrizables. Así, autoridades, industrias y ciudadanía pueden anticipar medidas
                (ajustes de jornada, actividades al aire libre, protocolos de protección) con una base común y trazable.
              </p>

              <p>
                Nuestro foco es el <strong>ODS&nbsp;11</strong> (ciudades y comunidades sostenibles): mejorar la
                comunicación del riesgo, reducir la exposición de grupos sensibles y facilitar decisiones preventivas con
                paneles por rol, reportes claros y un canal único, transparente y confiable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
