// src/pages/Dashboard.tsx
import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { WebSocketDemo } from "../components/WebSocketDemo";
import { useDashboardData } from "../hooks/useDashboardData";

const ORANGE = "#f39a2e";
const DEEP_ORANGE = "#f07a09";
const LIGHT_ORANGE = "#f09e47";
const BLUE = "#3b82f6";

const KpiCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) => (
  <div className="rounded-2xl p-5 bg-white shadow hover:shadow-lg transition border border-orange-100">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="mt-2 text-3xl font-bold text-gray-800">{value}</div>
    {hint && <div className="mt-1 text-xs text-gray-500">{hint}</div>}
  </div>
);

const DashboardHeader = () => {
  const navigate = useNavigate();
  return (
    <div
      className="rounded-3xl px-6 py-6 md:px-10 md:py-8 text-white shadow"
      style={{
        background: `linear-gradient(90deg, ${ORANGE} 0%, ${DEEP_ORANGE} 100%)`,
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Panel Ambiental — Santa Cruz
          </h1>
          <p className="text-white/90 text-sm">
            Vista general de los datos ambientales en tiempo real.
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
  const token = localStorage.getItem("token") ?? "";
  const { loading, pm25Trend, mediciones, realtimeKpi } =
    useDashboardData(token);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Cargando datos…
      </div>
    );
  }

  // 24 últimas mediciones
  const ultimas24 = mediciones.slice(0, 24);

  const pm10Trend = ultimas24.map((m) => ({
    time: new Date(m.fecha_hora).getHours() + ":00",
    value: m.pm10,
  }));

  const no2Trend = ultimas24.map((m) => ({
    time: new Date(m.fecha_hora).getHours() + ":00",
    value: m.no2,
  }));

  const tempHumTrend = ultimas24.map((m) => ({
    time: new Date(m.fecha_hora).getHours() + ":00",
    temp: m.temperatura,
    hum: m.humedad_relativa,
  }));

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">

        <DashboardHeader />

        {/* ==================== KPIs ==================== */}
        <section className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            label="PM2.5 actual"
            value={`${realtimeKpi?.pm25 ?? "--"} µg/m³`}
          />
          <KpiCard
            label="PM10 actual"
            value={`${realtimeKpi?.pm10 ?? "--"} µg/m³`}
          />
          <KpiCard
            label="NO₂ actual"
            value={`${realtimeKpi?.no2 ?? "--"} µg/m³`}
          />
          <KpiCard
            label="Temperatura"
            value={`${realtimeKpi?.temperatura ?? "--"} °C`}
          />
        </section>

        {/* ==================== POWER BI (NO SE TOCA) ==================== */}
        <section className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white shadow border border-orange-100 overflow-hidden xl:col-span-3">
            <div className="p-5">
              <h2 className="text-lg font-semibold text-gray-700">
                Power BI — Calidad del Aire Santa Cruz
              </h2>
            </div>
            <div className="w-full h-[700px]">
              <iframe
                title="powerbi_urbano"
                src="https://app.powerbi.com/view?r=eyJrIjoiNGZjNDJkMWEtMjBiYy00ZjliLWE0MTAtNTBhOGFiNzdlMWM1IiwidCI6Ijg5ZTg3ZmNkLTc3NTUtNDY5NC1hZmMzLTNjZWY4NDVjZjViNCIsImMiOjR9"
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        {/* ==================== GRÁFICOS REALES ==================== */}
        <section className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Tendencia PM2.5 */}
          <div className="rounded-3xl bg-white shadow border border-orange-100 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Tendencia PM2.5 (últimas horas)
            </h2>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={pm25Trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke={ORANGE} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tendencia PM10 */}
          <div className="rounded-3xl bg-white shadow border border-orange-100 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Tendencia PM10 (últimas horas)
            </h2>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={pm10Trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke={DEEP_ORANGE} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tendencia NO2 */}
          <div className="rounded-3xl bg-white shadow border border-orange-100 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Tendencia NO₂ (últimas horas)
            </h2>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={no2Trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke={BLUE} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </section>

        {/* ==================== TEMPERATURA / HUMEDAD ==================== */}
        <section className="mt-6">
          <div className="rounded-3xl bg-white shadow border border-orange-100 p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Temperatura y humedad (últimas horas)
            </h2>

            <div className="h-80">
              <ResponsiveContainer>
                <BarChart data={tempHumTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="temp" fill={ORANGE} name="Temp (°C)" />
                  <Bar dataKey="hum" fill={BLUE} name="Humedad (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* WebSocket */}
        <section className="mt-6">
          <WebSocketDemo />
        </section>
      </div>
    </main>
  );
};

export default Dashboard;
