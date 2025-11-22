import { Link } from "react-router-dom";

function IconPrediccion() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 15l4-5 3 3 5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconAlerta() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 17a3 3 0 0 0 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
function IconDashboards() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
function IconReportes() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M7 3h6l4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2" />
      <path d="M13 3v5h5" stroke="currentColor" strokeWidth="2" />
      <path d="M9 13h6M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Services() {
  const items = [
    {
      key: "pred",
      title: "Pronóstico 24–72 h por zona",
      text:
        "Modelos locales para anticipar episodios de mala calidad del aire y planificar clases, turnos y actividades.",
      icon: <IconPrediccion />,
      to: "/predicciones",
    },
    {
      key: "alert",
      title: "Alertas y automatización",
      text:
        "Reglas por umbral y severidad con notificaciones oportunas para autoridades, industrias y ciudadanía.",
      icon: <IconAlerta />,
      to: "/alertas",
    },
    {
      key: "dash",
      title: "Dashboards y KPIs",
      text:
        "Paneles operativos y públicos, con métricas claras y visuales; listos para integrar fuentes confiables.",
      icon: <IconDashboards />,
      to: "/dashboard",
    },
    {
      key: "rep",
      title: "Reportes y trazabilidad",
      text:
        "Resúmenes automáticos, evidencias y bitácoras para decisiones auditables y comunicación transparente.",
      icon: <IconReportes />,
      to: "/reportes",
    },
  ];

  return (
    <section id="services" className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full text-white"
            style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
          >
            NUESTROS SERVICIOS
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-3">¿Qué hacemos?</h2>
        </div>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((it) => (
            <div
              key={it.key}
              className="flex flex-col border border-slate-100 rounded-2xl p-6 hover:shadow-lg transition bg-white"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
                >
                  {it.icon}
                </div>
                <h4 className="font-semibold">{it.title}</h4>
              </div>
              <p className="mt-3 text-slate-600 flex-1">{it.text}</p>

              <div className="mt-4">
                <Link
                  to={it.to}
                  className="px-3 py-1.5 border rounded-full text-xs uppercase hover:bg-orange-50 border-orange-500 text-orange-600 inline-flex items-center gap-1"
                >
                  Ver detalles
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-0.5">
                    <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 text-white rounded-lg"
            style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
          >
            Ver panel principal
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-2">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
