import { useMemo, useState } from "react";
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import { getPredictionData, generateSampleInput } from "../../services/apiModelo";

/* ===========================
   Datos mock iniciales (se reemplazarán con la API)
   =========================== */
type Pred = {
  id: string;
  horaPred: string;
  horizonte: string;        // "1hr", "12hr", "24hr", etc.
  pm25: number;         // μg/m³ (predicho)
  ica: number;          // 1-6 (API)
  riesgo: "Alto" | "Medio" | "Bajo";
  confianza: number;    // %
  serie: number[];      // para sparkline
};

const ICA_LABELS = {
  1: "Buena",
  2: "Aceptable",
  3: "Moderada",
  4: "Mala",
  5: "Muy mala",
  6: "Extremadamente desfavorable",
} as const;

function getIcaLabel(value: number) {
  return ICA_LABELS[value as keyof typeof ICA_LABELS] ?? "Sin dato";
}

const BASE: Pred[] = [
  { id: "P-1001", horaPred: "08:00", horizonte: "1hr", pm25: 42, ica: 3, riesgo: "Alto", confianza: 86, serie: [24, 28, 31, 36, 40, 42, 41] },
  { id: "P-1002", horaPred: "09:00", horizonte: "12hr", pm25: 33, ica: 2, riesgo: "Medio", confianza: 81, serie: [20, 22, 25, 28, 31, 33, 30] },
  { id: "P-1003", horaPred: "10:00", horizonte: "24hr", pm25: 21, ica: 1, riesgo: "Bajo", confianza: 74, serie: [12, 14, 16, 18, 20, 21, 19] },
  { id: "P-1004", horaPred: "11:00", horizonte: "72hr", pm25: 37, ica: 2, riesgo: "Medio", confianza: 79, serie: [21, 24, 27, 30, 34, 37, 35] },
  { id: "P-1005", horaPred: "12:00", horizonte: "168hr", pm25: 46, ica: 4, riesgo: "Alto", confianza: 88, serie: [26, 30, 33, 38, 42, 46, 44] },
];

/* Colores de marca */
const brandStart = "#f39a2e"; // naranja claro
const brandEnd = "#f07a09"; // naranja intenso
const brandAlt = "#ff9900"; // otra acentuación

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [qHorizonte, setQHorizonte] = useState<string>("Todos");
  const [qRiesgo, setQRiesgo] = useState<string>("Todos");
  const [qBuscar, setQBuscar] = useState<string>("");

  const horizontes = useMemo(() => ["Todos", ...Array.from(new Set(BASE.map(b => b.horizonte)))], []);
  const riesgos = ["Todos", "Alto", "Medio", "Bajo"];

  const filtrado = useMemo(() => {
    return data.filter((p) => {
      const h = qHorizonte === "Todos" || p.horizonte === qHorizonte;
      const r = qRiesgo === "Todos" || p.riesgo === qRiesgo;
      const b =
        !qBuscar ||
        p.horizonte.toLowerCase().includes(qBuscar.toLowerCase()) ||
        p.horaPred.includes(qBuscar) ||
        p.id.toLowerCase().includes(qBuscar.toLowerCase());
      return h && r && b;
    });
  }, [data, qHorizonte, qRiesgo, qBuscar]);

  const kpis = useMemo(() => {
    const total = filtrado.length;
    const alto = filtrado.filter(p => p.riesgo === "Alto").length;
    const medio = filtrado.filter(p => p.riesgo === "Medio").length;
    const bajo = filtrado.filter(p => p.riesgo === "Bajo").length;
    return { total, alto, medio, bajo };
  }, [filtrado]);

  const regenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Generar datos de entrada (mock de 24h)
      const inputData = generateSampleInput();

      // 2. Configuración de filas que queremos mostrar
      const rowsConfig = [
        { id: "P-1001", horizonHours: 1, label: "1hr" },
        { id: "P-1002", horizonHours: 12, label: "12hr" },
        { id: "P-1003", horizonHours: 24, label: "24hr" },
        { id: "P-1004", horizonHours: 72, label: "72hr" },
        { id: "P-1005", horizonHours: 168, label: "168hr" },
      ];

      // 3. Obtener predicciones en paralelo para cada fila
      const newPredictions = await Promise.all(
        rowsConfig.map(async (row) => {
          // Llamada a la API all-in-one
          const apiData = await getPredictionData(inputData, row.horizonHours);

          // Calcular horaPred (hora actual + horizonte)
          const now = new Date();
          const targetTime = new Date(now.getTime() + row.horizonHours * 60 * 60 * 1000);
          const horaPred = targetTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          return {
            id: row.id,
            horaPred: horaPred,
            horizonte: row.label,
            pm25: Math.round(apiData.pm25),
            ica: apiData.ica, // Valor 1-6
            riesgo: apiData.riesgo,
            confianza: apiData.confianza,
            serie: apiData.tendencia, // Array de 5 valores
          };
        })
      );

      setData(newPredictions);
    } catch (err: any) {
      console.error("Error fetching predictions:", err);
      // Mostrar el mensaje real del error para depuración
      setError(err.message || "Error desconocido al conectar con la API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Predicciones</h1>
            <p className="text-sm text-slate-500">Modelos predictivos (XGBoost) · Santa Cruz</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={regenerate}
              disabled={loading}
              className={`rounded-full px-4 py-2 text-sm font-semibold text-white shadow transition-transform ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'
                }`}
              style={{ background: `linear-gradient(90deg, ${brandStart} 0%, ${brandEnd} 100%)` }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generando...
                </span>
              ) : (
                "Generar ahora"
              )}
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
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

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
                value={qHorizonte}
                onChange={(e) => setQHorizonte(e.target.value)}
                className="rounded-full border-slate-300 text-sm px-3 py-2"
              >
                {horizontes.map(h => <option key={h}>{h}</option>)}
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
                placeholder="Buscar (ID, hora)"
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
                  <th className="py-3 px-3">Horizonte</th>
                  <th className="py-3 px-3">PM2.5 (μg/m³)</th>
                  <th className="py-3 px-3">ICA</th>
                  <th className="py-3 px-3">Riesgo</th>
                  <th className="py-3 px-3">Confianza</th>
                  <th className="py-3 px-3">Tendencia</th>
                  {/* <th className="py-3 px-3">Acciones</th> */}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtrado.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-semibold text-slate-800">{p.id}</td>
                    <td className="py-3 px-3">{p.horaPred}</td>
                    <td className="py-3 px-3">{p.horizonte}</td>
                    <td className="py-3 px-3 font-medium">{p.pm25}</td>
                    <td className="py-3 px-3">{`${p.ica} · ${getIcaLabel(p.ica)}`}</td>
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
                      {/* <div className="flex gap-2">
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
                      </div> */}
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
            <li><b>PM2.5</b> es la concentración (μg/m³). Umbrales: &lt;35 = Bajo, 35–55 = Medio, &gt;55 = Alto.</li>
            <li><b>ICA</b> (Índice de Calidad del Aire) nivel 1 (Buena) a 6 (Extremadamente desfavorable).</li>
            <li><b>Confianza</b> es el R2 promedio del modelo para el target PM2.5.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
