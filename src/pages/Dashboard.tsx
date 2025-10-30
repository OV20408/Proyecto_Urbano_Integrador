 import React from "react";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { useNavigate } from "react-router-dom";
import { WebSocketDemo } from "../components/WebSocketDemo";

/** =========================
 *  Datos de ejemplo (hardcodeados)
 *  ========================= */
type TrendPoint = { time: string; aqi: number };
type AlertsByType = { type: string; count: number };
type SourceShare = { name: string; value: number };
type RecentAlert = { id: string; zone: string; pollutant: string; level: string; time: string };

const aqiTrend: TrendPoint[] = [
  { time: "08:00", aqi: 42 },
  { time: "10:00", aqi: 55 },
  { time: "12:00", aqi: 71 },
  { time: "14:00", aqi: 64 },
  { time: "16:00", aqi: 59 },
  { time: "18:00", aqi: 48 },
  { time: "20:00", aqi: 45 },
];

const alertsData: AlertsByType[] = [
  { type: "Humo", count: 12 },
  { type: "Olores", count: 8 },
  { type: "Ruido", count: 15 },
  { type: "Tráfico", count: 10 },
];

const sourcesShare: SourceShare[] = [
  { name: "Industrial", value: 45 },
  { name: "Tránsito", value: 30 },
  { name: "Doméstico", value: 15 },
  { name: "Otros", value: 10 },
];

const recentAlerts: RecentAlert[] = [
  { id: "AL-1021", zone: "Centro", pollutant: "PM2.5", level: "Alto", time: "hoy 10:35" },
  { id: "AL-1020", zone: "Equipetrol", pollutant: "NO₂", level: "Medio", time: "hoy 09:50" },
  { id: "AL-1019", zone: "Plan 3,000", pollutant: "PM10", level: "Alto", time: "ayer 18:12" },
  { id: "AL-1018", zone: "Villa 1ro de Mayo", pollutant: "O₃", level: "Bajo", time: "ayer 16:40" },
];

/** Paleta alineada al landing */
const ORANGE = "#f39a2e";
const DEEP_ORANGE = "#f07a09";
const LIGHT_ORANGE = "#f09e47";
const WARN = "#ff9900";
const PIE_COLORS = [ORANGE, DEEP_ORANGE, LIGHT_ORANGE, WARN];

/** Utils de UI */
function KpiCard({
  label,
  value,
  hint,
}: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl p-5 bg-white/90 shadow hover:shadow-lg transition border border-orange-100">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-gray-800">{value}</div>
      {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
    </div>
  );
}

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-3xl px-6 py-6 md:px-10 md:py-8 text-white shadow"
      style={{ background: `linear-gradient(90deg, ${ORANGE} 0%, ${DEEP_ORANGE} 100%)` }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Panel Ambiental — Santa Cruz
          </h1>
          <p className="text-white/90 text-sm">
            Vista general de datos Estadisticos.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 transition text-sm"
          >
            Ir al Home
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-full bg-white text-[#f07a09] font-semibold hover:opacity-90 transition text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Header */}
        <DashboardHeader />

        {/* KPIs */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="ICA promedio (hoy)" value="58 — Moderado" hint="08:00–20:00" />
          <KpiCard label="Zonas en alerta" value="3" hint="Centro, P3K, Equipetrol" />
          <KpiCard label="Alertas enviadas" value="27" hint="Últimas 24 h" />
          <KpiCard label="Quejas ciudadanas" value="12" hint="Últimas 24 h" />
        </section>

        {/* Gráficos principales */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tendencia AQI (línea) */}
          <div className="col-span-1 lg:col-span-2 rounded-3xl bg-white shadow border border-orange-100">
            <div className="p-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Tendencia de ICA (hoy)</h2>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background: `${ORANGE}15`, color: DEEP_ORANGE }}
              >
                Actualizado: 20:00
              </span>
            </div>
            <div className="h-72 px-2 pb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={aqiTrend}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#eee" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="aqi"
                    stroke={DEEP_ORANGE}
                    strokeWidth={3}
                    dot={{ r: 3 }}
                    name="ICA"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alertas por tipo (barras) */}
          <div className="col-span-1 rounded-3xl bg-white shadow border border-orange-100">
            <div className="p-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Alertas por tipo (24 h)</h2>
              <span className="text-xs px-3 py-1 rounded-full"
                style={{ background: `${WARN}15`, color: WARN }}
              >
                Alerta
              </span>
            </div>
            <div className="h-72 px-2 pb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={alertsData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#eee" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} fill={ORANGE} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Fuente/Composición + Power BI + Tabla */}
        <section className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Pie de fuentes */}
          <div className="rounded-3xl bg-white shadow border border-orange-100">
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-700">Contribución por fuente</h2>
            </div>
            <div className="h-72 px-2 pb-6">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourcesShare}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {sourcesShare.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Power BI Placeholder (reemplazar después) */}
          <div className="rounded-3xl bg-white shadow border border-orange-100 overflow-hidden">
            <div className="p-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Power BI — Informe</h2>
              <span className="text-xs text-gray-500">Placeholder</span>
            </div>
            <div className="aspect-video bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center text-orange-900/80">
              <div className="text-center px-6">
                <div className="font-semibold">Aquí irá el informe de Power BI</div>
                <div className="text-sm mt-2">
                  Reemplaza este bloque por un <code>&lt;iframe&gt;</code> (Publicar en web) o integra con <code>powerbi-client</code>.
                </div>
                {/* EJEMPLO (público):
                <iframe
                  title="Reporte Ambiental"
                  width="100%"
                  height="100%"
                  src="https://app.powerbi.com/view?r=TU_URL_PUBLICA"
                  allowFullScreen
                />
                */}

                {/* EJEMPLO (seguro con SDK):
                import * as powerbi from "powerbi-client";
                const models = powerbi.models;
                const embedConfig = {
                  type: "report",
                  tokenType: models.TokenType.Embed,
                  accessToken: "EMBED_TOKEN",
                  embedUrl: "https://app.powerbi.com/reportEmbed?reportId=...&groupId=...",
                  settings: { panes: { filters: { visible: false } } }
                };
                const reportContainer = document.getElementById("reportContainer");
                powerbi.service.hEmbed(reportContainer, embedConfig);
                */}
              </div>
            </div>
          </div>

          {/* Tabla — alertas recientes */}
          <div className="rounded-3xl bg-white shadow border border-orange-100 overflow-hidden">
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-700">Alertas recientes</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-orange-50 text-gray-600">
                  <tr>
                    <th className="text-left py-3 px-4">ID</th>
                    <th className="text-left py-3 px-4">Zona</th>
                    <th className="text-left py-3 px-4">Contaminante</th>
                    <th className="text-left py-3 px-4">Nivel</th>
                    <th className="text-left py-3 px-4">Hora</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAlerts.map((a, i) => (
                    <tr key={a.id} className={i % 2 === 0 ? "bg-white" : "bg-orange-50/40"}>
                      <td className="py-3 px-4 font-medium">{a.id}</td>
                      <td className="py-3 px-4">{a.zone}</td>
                      <td className="py-3 px-4">{a.pollutant}</td>
                      <td className="py-3 px-4">
                        <span
                          className="px-2 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background:
                              a.level === "Alto"
                                ? `${WARN}20`
                                : a.level === "Medio"
                                ? `${ORANGE}20`
                                : "#ecfeff",
                            color:
                              a.level === "Alto"
                                ? WARN
                                : a.level === "Medio"
                                ? ORANGE
                                : "#0ea5e9",
                          }}
                        >
                          {a.level}
                        </span>
                      </td>
                      <td className="py-3 px-4">{a.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 text-right">
              <button
                className="text-sm px-4 py-2 rounded-full text-white shadow"
                style={{ background: `linear-gradient(90deg, ${ORANGE} 0%, ${DEEP_ORANGE} 100%)` }}
              >
                Exportar CSV
              </button>
            </div>
          </div>
        </section>

        {/* WebSocket Demo */}
        <section className="mt-6">
          <WebSocketDemo />
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
