import { useMemo, useState } from "react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Link } from "react-router-dom";

/* ===========================
   Datos mock (reemplazables)
   =========================== */
type Pred = {
  id: string;
  hora: string;         // "08:00"
  zona: string;         // "Centro", "Equipetrol", etc.
  pm25: number;         // μg/m³ (predicho)
  ica: number;          // 0-100 (mock)
  riesgo: "Alto" | "Medio" | "Bajo";
  confianza: number;    // %
  serie: number[];      // para sparkline
};

const BASE: Pred[] = [
  { id: "P-1001", hora: "08:00", zona: "Centro",     pm25: 42, ica: 78, riesgo: "Alto",  confianza: 86, serie: [24,28,31,36,40,42,41] },
  { id: "P-1002", hora: "09:00", zona: "Norte",      pm25: 33, ica: 70, riesgo: "Medio", confianza: 81, serie: [20,22,25,28,31,33,30] },
  { id: "P-1003", hora: "10:00", zona: "Equipetrol", pm25: 21, ica: 52, riesgo: "Bajo",  confianza: 74, serie: [12,14,16,18,20,21,19] },
  { id: "P-1004", hora: "11:00", zona: "Plan 3,000", pm25: 37, ica: 73, riesgo: "Medio", confianza: 79, serie: [21,24,27,30,34,37,35] },
  { id: "P-1005", hora: "12:00", zona: "Sur",        pm25: 46, ica: 82, riesgo: "Alto",  confianza: 88, serie: [26,30,33,38,42,46,44] },
];

/* Colores de marca */
const brandStart = "#f39a2e"; // naranja claro
const brandEnd   = "#f07a09"; // naranja intenso
const brandAlt   = "#ff9900"; // otra acentuación

function BadgeRiesgo({ r }: { r: Pred["riesgo"] }) {
  const cls =
    r === "Alto"
      ? "bg-red-100 text-red-700"
      : r === "Medio"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>
      {r}
    </span>
  );
}

function Kpi({ title, value, suffix }: { title: string; value: number; suffix?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-1 text-3xl font-bold text-slate-800">
        {value}
        {suffix && <span className="ml-1 text-lg font-semibold text-slate-500">{suffix}</span>}
      </h3>
    </div>
  );
}

export default function Predicciones() {
  const [data, setData] = useState<Pred[]>(BASE);
  const [qZona, setQZona] = useState<string>("Todas");
  const [qRiesgo, setQRiesgo] = useState<string>("Todos");
  const [qBuscar, setQBuscar] = useState<string>("");

  const zonas = useMemo(() => ["Todas", ...Array.from(new Set(BASE.map(b => b.zona)))], []);
  const riesgos = ["Todos", "Alto", "Medio", "Bajo"];

  const filtrado = useMemo(() => {
    return data.filter((p) => {
      const z = qZona === "Todas" || p.zona === qZona;
      const r = qRiesgo === "Todos" || p.riesgo === qRiesgo;
      const b =
        !qBuscar ||
        p.zona.toLowerCase().includes(qBuscar.toLowerCase()) ||
        p.hora.includes(qBuscar) ||
        p.id.toLowerCase().includes(qBuscar.toLowerCase());
      return z && r && b;
    });
  }, [data, qZona, qRiesgo, qBuscar]);

  const kpis = useMemo(() => {
    const total = filtrado.length;
    const alto = filtrado.filter(p => p.riesgo === "Alto").length;
    const medio = filtrado.filter(p => p.riesgo === "Medio").length;
    const bajo = filtrado.filter(p => p.riesgo === "Bajo").length;
    return { total, alto, medio, bajo };
  }, [filtrado]);

  const regenerate = () => {
    // Simula “Generar ahora”: varía valores +/- y reordena un poco la serie
    setData(prev =>
      prev.map(p => {
        const delta = (Math.random() * 6) - 3;     // -3 a +3
        const pm25 = Math.max(8, Math.round(p.pm25 + delta));
        const ica  = Math.max(35, Math.min(100, Math.round(p.ica + delta * 1.5)));
        const conf = Math.max(60, Math.min(95, Math.round(p.confianza + (Math.random() * 6 - 3))));
        let riesgo: Pred["riesgo"] = p.riesgo;
        if (pm25 >= 40) riesgo = "Alto";
        else if (pm25 >= 25) riesgo = "Medio";
        else riesgo = "Bajo";
        const serie = [...p.serie.slice(1), pm25 - Math.round(Math.random()*4)];
        return { ...p, pm25, ica, confianza: conf, riesgo, serie };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Predicciones</h1>
            <p className="text-sm text-slate-500">Modelos predictivos (mock) · Santa Cruz</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={regenerate}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition-transform hover:scale-[1.02]"
              style={{ background: `linear-gradient(90deg, ${brandStart} 0%, ${brandEnd} 100%)` }}
            >
              Generar ahora
            </button>
            <Link
              to="/workflows"
              className="rounded-full px-4 py-2 text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Ver flujos n8n
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Kpi title="Total hoy" value={kpis.total} />
          <Kpi title="Riesgo alto" value={kpis.alto} />
          <Kpi title="Riesgo medio" value={kpis.medio} />
          <Kpi title="Riesgo bajo" value={kpis.bajo} />
        </section>

        {/* Filtros */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              <select
                value={qZona}
                onChange={(e) => setQZona(e.target.value)}
                className="rounded-full border-slate-300 text-sm px-3 py-2"
              >
                {zonas.map(z => <option key={z}>{z}</option>)}
              </select>

              <select
                value={qRiesgo}
                onChange={(e) => setQRiesgo(e.target.value)}
                className="rounded-full border-slate-300 text-sm px-3 py-2"
              >
                {riesgos.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>

            <div className="relative">
              <input
                value={qBuscar}
                onChange={(e) => setQBuscar(e.target.value)}
                placeholder="Buscar (ID, zona, hora)"
                className="rounded-full border border-slate-300 text-sm px-4 py-2 pr-8 w-[260px]"
              />
              <span className="absolute right-3 top-2.5 text-slate-400">⌕</span>
            </div>
          </div>
        </section>

        {/* Tabla + sparklines */}
        <section className="rounded-2xl border border-slate-200 bg-white p-2 md:p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600 border-b">
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Hora</th>
                  <th className="py-3 px-3">Zona</th>
                  <th className="py-3 px-3">PM2.5 (μg/m³)</th>
                  <th className="py-3 px-3">ICA</th>
                  <th className="py-3 px-3">Riesgo</th>
                  <th className="py-3 px-3">Confianza</th>
                  <th className="py-3 px-3">Tendencia</th>
                  <th className="py-3 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtrado.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-slate-800">{p.id}</td>
                    <td className="py-3 px-3">{p.hora}</td>
                    <td className="py-3 px-3">{p.zona}</td>
                    <td className="py-3 px-3 font-medium">{p.pm25}</td>
                    <td className="py-3 px-3">{p.ica}</td>
                    <td className="py-3 px-3"><BadgeRiesgo r={p.riesgo} /></td>
                    <td className="py-3 px-3">{p.confianza}%</td>
                    <td className="py-2 px-3">
                      <div className="h-[36px] w-[140px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={p.serie.map((y, i) => ({ x: i, y }))}
                            margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={brandAlt} stopOpacity={0.9} />
                                <stop offset="100%" stopColor={brandAlt} stopOpacity={0.05} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="x" hide />
                            <YAxis hide />
                            <Tooltip />
                            <Area type="monotone" dataKey="y" stroke={brandAlt} fill="url(#spark)" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-1 rounded-full text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100"
                          title="Ver detalle (mock)"
                        >
                          Detalle
                        </button>
                        <button
                          onClick={regenerate}
                          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                          style={{ background: `linear-gradient(90deg, ${brandStart} 0%, ${brandEnd} 100%)` }}
                          title="Regenerar predicciones (mock)"
                        >
                          Generar ahora
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtrado.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-slate-500">
                      Sin resultados que coincidan con los filtros actuales.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Notas / criterios (mock) */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-2">Notas</h3>
          <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
            <li><b>PM2.5</b> es la concentración (μg/m³). Umbrales mock: &lt;25 = Bajo, 25–39 = Medio, ≥40 = Alto.</li>
            <li><b>ICA</b> (Índice de Calidad del Aire) normalizado 0–100 (mock para demo).</li>
            <li><b>Confianza</b> es la seguridad del modelo (mock). Luego vendrá del servicio real.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
