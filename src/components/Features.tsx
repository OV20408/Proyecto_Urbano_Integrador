// src/components/Features.tsx
import { MapPin, BellRing, LayoutDashboard, ShieldCheck, Plug, Users } from "lucide-react";

type Feature = {
  title: string;
  text: string;
  icon: React.ElementType;
};

const items: Feature[] = [
  {
    title: "Pronóstico por zonas (24–72 h)",
    text: "Mapa urbano con niveles actuales y predicción por distrito/barrio para anticipar decisiones operativas.",
    icon: MapPin,
  },
  {
    title: "Alertas tempranas y reglas",
    text: "Umbrales configurables por contaminante y zona, con notificaciones por email o in-app y cooldown anti-spam.",
    icon: BellRing,
  },
  {
    title: "Paneles por rol",
    text: "Vistas diferenciadas para autoridad, industria y ciudadanía: KPIs, tendencias, cumplimiento y recomendaciones.",
    icon: LayoutDashboard,
  },
  {
    title: "Transparencia y trazabilidad",
    text: "Bitácora de cambios, versión de modelos y fuentes de datos visibles para auditorías y confianza pública.",
    icon: ShieldCheck,
  },
  {
    title: "Integraciones y automatización",
    text: "Conectores a APIs confiables y workflows automáticos que convierten predicciones en acciones concretas.",
    icon: Plug,
  },
  {
    title: "Acceso ciudadano claro",
    text: "Indicadores comprensibles (ICA) y recomendaciones de salud para reducir exposición y desinformación.",
    icon: Users,
  },
];

export default function Features() {
  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-4">
        <header className="text-center mb-10">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full text-white"
            style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
          >
            Plataforma Ambiental Urbana Predictiva
          </span>
          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-slate-800">
            Decidir antes, exponerse menos
          </h2>
          <p className="mt-2 text-slate-600">
            Unificamos datos, anticipamos escenarios y comunicamos el riesgo en un lenguaje claro.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map(({ title, text, icon: Icon }) => (
            <div
              key={title}
              className="border border-slate-100 rounded-2xl p-8 bg-white hover:shadow-xl transition hover:-translate-y-0.5"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                style={{ background: "linear-gradient(90deg, #f39a2e22 0%, #f07a0922 100%)" }}
                aria-hidden="true"
              >
                <Icon className="w-6 h-6"
                  style={{ color: "#f07a09" }}
                  aria-hidden="true"
                />
              </div>
              <h4 className="mt-4 text-xl font-semibold text-slate-800">{title}</h4>
              <p className="mt-2 text-slate-600">{text}</p>
              <div className="mt-4 h-1 w-14 rounded-full"
                   style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
