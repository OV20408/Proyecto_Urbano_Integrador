import { useMemo, useState } from "react";
import type { AlertItem, Severity, Status, Source } from "../types/alerts";
import {Link} from "react-router-dom";

// ---- MOCK DATA ----
const seedAlerts: AlertItem[] = [
  {
    id: "A-1001",
    title: "PM2.5 elevado en 2do anillo Norte",
    message: "El modelo anticipa excedencia en 3 horas.",
    severity: "high",
    status: "open",
    source: "modelo",
    createdAt: "2025-10-25T14:30:00Z",
    cityZone: "2do anillo Norte",
    metric: "PM2.5",
    value: 48,
    threshold: 35,
  },
  {
    id: "A-1002",
    title: "NO₂ cerca a polo industrial",
    message: "Incremento sostenido 24h (percentil P95 alto).",
    severity: "medium",
    status: "ack",
    source: "api",
    createdAt: "2025-10-24T09:10:00Z",
    cityZone: "Paila",
    metric: "NO₂",
    value: 80,
    threshold: 70,
  },
  {
    id: "A-1003",
    title: "Incumplimiento normativo (reporte mensual)",
    message: "Reporte con campos faltantes.",
    severity: "low",
    status: "muted",
    source: "normativa",
    createdAt: "2025-10-23T18:05:00Z",
  },
  {
    id: "A-1004",
    title: "O₃ alto en Equipetrol",
    message: "Pico en franja 12:00–16:00 según predicción.",
    severity: "critical",
    status: "open",
    source: "modelo",
    createdAt: "2025-10-26T12:20:00Z",
    cityZone: "Equipetrol",
    metric: "O₃",
    value: 182,
    threshold: 160,
  },
];

const sevColor: Record<Severity, string> = {
  critical: "bg-red-600",
  high: "bg-orange-500",
  medium: "bg-amber-400",
  low: "bg-emerald-400",
};

const statusLabel: Record<Status, string> = {
  open: "Abierto",
  ack: "Reconocido",
  resolved: "Resuelto",
  muted: "Silenciado",
};

const sourceLabel: Record<Source, string> = {
  modelo: "Modelo",
  api: "API",
  normativa: "Normativa",
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<AlertItem[]>(seedAlerts);
  const [query, setQuery] = useState("");
  const [sev, setSev] = useState<"" | Severity>("");
  const [stat, setStat] = useState<"" | Status>("");
  const [src, setSrc] = useState<"" | Source>("");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [openDetail, setOpenDetail] = useState<AlertItem | null>(null);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      const q =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.message.toLowerCase().includes(query.toLowerCase()) ||
        (a.cityZone ?? "").toLowerCase().includes(query.toLowerCase());
      const s1 = !sev || a.severity === sev;
      const s2 = !stat || a.status === stat;
      const s3 = !src || a.source === src;
      const d1 = !from || new Date(a.createdAt) >= new Date(from);
      const d2 = !to || new Date(a.createdAt) <= new Date(to);
      return q && s1 && s2 && s3 && d1 && d2;
    });
  }, [alerts, query, sev, stat, src, from, to]);

  const setStatus = (id: string, status: Status) =>
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const quickBtn = (label: string, active: boolean) =>
    `px-3 py-1 rounded-full text-sm border ${
      active ? "bg-slate-900 text-white border-slate-900" : "bg-white"
    }`;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Filtros */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="rounded-xl bg-white border border-slate-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              placeholder="Buscar (zona, título, mensaje)…"
              className="col-span-2 px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-amber-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="px-3 py-2 rounded-lg border border-slate-300"
              value={sev}
              onChange={(e) => setSev((e.target.value || "") as Severity | "")}
            >
              <option value="">Severidad</option>
              <option value="critical">Crítica</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
            <select
              className="px-3 py-2 rounded-lg border border-slate-300"
              value={stat}
              onChange={(e) => setStat((e.target.value || "") as Status | "")}
            >
              <option value="">Estado</option>
              <option value="open">Abierto</option>
              <option value="ack">Reconocido</option>
              <option value="resolved">Resuelto</option>
              <option value="muted">Silenciado</option>
            </select>
            <select
              className="px-3 py-2 rounded-lg border border-slate-300"
              value={src}
              onChange={(e) => setSrc((e.target.value || "") as Source | "")}
            >
              <option value="">Fuente</option>
              <option value="modelo">Modelo</option>
              <option value="api">API</option>
              <option value="normativa">Normativa</option>
            </select>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Desde</span>
              <input
                type="date"
                className="px-3 py-2 rounded-lg border border-slate-300"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Hasta</span>
              <input
                type="date"
                className="px-3 py-2 rounded-lg border border-slate-300"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                className={quickBtn("Abiertos", stat === "open")}
                onClick={() => setStat(stat === "open" ? "" : "open")}
              >
                Abiertos
              </button>
              <button
                className={quickBtn("Críticos", sev === "critical")}
                onClick={() => setSev(sev === "critical" ? "" : "critical")}
              >
                Críticos
              </button>
              <button
                className="px-3 py-1 rounded-full text-sm border bg-white"
                onClick={() => {
                  setQuery("");
                  setSev("");
                  setStat("");
                  setSrc("");
                  setFrom("");
                  setTo("");
                }}
              >
                Limpiar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lista */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 grid gap-4">
        {filtered.map((a) => (
          <div
            key={a.id}
            className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <span
                className={`inline-block w-2 h-9 rounded ${sevColor[a.severity]}`}
                aria-hidden
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800">{a.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {sourceLabel[a.source]}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {statusLabel[a.status]}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">{a.message}</p>
                <div className="text-xs text-slate-500 mt-1">
                  {a.metric && a.value !== undefined && a.threshold !== undefined
                    ? `${a.metric}: ${a.value} (umbral ${a.threshold}) · `
                    : ""}
                  {a.cityZone ? `${a.cityZone} · ` : ""}
                  {new Date(a.createdAt).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 hover:bg-slate-50"
                onClick={() => setStatus(a.id, "ack")}
              >
                Reconocer
              </button>
              <button
                className="px-3 py-1.5 rounded-lg text-sm border border-emerald-400 text-emerald-700 hover:bg-emerald-50"
                onClick={() => setStatus(a.id, "resolved")}
              >
                Resolver
              </button>
              <button
                className="px-3 py-1.5 rounded-lg text-sm border border-amber-400 text-amber-700 hover:bg-amber-50"
                onClick={() => setStatus(a.id, "muted")}
                title="Silenciar 24h"
              >
                Silenciar
              </button>
              <button
                className="px-3 py-1.5 rounded-lg text-sm text-white"
                style={{
                  background:
                    "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)",
                }}
                onClick={() => setOpenDetail(a)}
              >
                Ver
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-slate-500 py-16">
            No hay alertas que coincidan con los filtros.
          </div>
        )}
      </div>

      {/* Drawer de Detalle */}
      {openDetail && (
        <div
          className="fixed inset-0 z-40"
          aria-modal="true"
          role="dialog"
          onClick={() => setOpenDetail(null)}
        >
          <div className="absolute inset-0 bg-black/30" />
          <aside
            className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl p-5 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                Detalle de alerta
              </h3>
              <button
                className="px-3 py-1.5 rounded-lg border border-slate-200"
                onClick={() => setOpenDetail(null)}
              >
                Cerrar
              </button>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <span
                className={`inline-block w-2 h-9 rounded ${sevColor[openDetail.severity]}`}
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold">{openDetail.title}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">
                    {sourceLabel[openDetail.source]}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100">
                    {statusLabel[openDetail.status]}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {openDetail.message}
                </p>
                <ul className="text-sm text-slate-600 mt-2 space-y-1">
                  <li>
                    <b>Fecha:</b>{" "}
                    {new Date(openDetail.createdAt).toLocaleString()}
                  </li>
                  {openDetail.cityZone && (
                    <li>
                      <b>Zona:</b> {openDetail.cityZone}
                    </li>
                  )}
                  {openDetail.metric && (
                    <li>
                      <b>Métrica:</b> {openDetail.metric} ·{" "}
                      <b>Valor:</b> {openDetail.value} ·{" "}
                      <b>Umbral:</b> {openDetail.threshold}
                    </li>
                  )}
                  <li>
                    <b>ID:</b> {openDetail.id}
                  </li>
                </ul>

                <div className="mt-4 flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg text-sm border border-slate-300 hover:bg-slate-50"
                    onClick={() => {
                      setStatus(openDetail.id, "ack");
                      setOpenDetail({ ...openDetail, status: "ack" });
                    }}
                  >
                    Reconocer
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg text-sm border border-emerald-400 text-emerald-700 hover:bg-emerald-50"
                    onClick={() => {
                      setStatus(openDetail.id, "resolved");
                      setOpenDetail({ ...openDetail, status: "resolved" });
                    }}
                  >
                    Resolver
                  </button>
                  <button
                    className="px-3 py-1.5 rounded-lg text-sm border border-amber-400 text-amber-700 hover:bg-amber-50"
                    onClick={() => {
                      setStatus(openDetail.id, "muted");
                      setOpenDetail({ ...openDetail, status: "muted" });
                    }}
                  >
                    Silenciar 24h
                  </button>
                </div>

                <div className="mt-6">
                  <h5 className="text-sm font-semibold text-slate-700 mb-2">
                    Siguiente paso automatizado (stub)
                  </h5>
                  <p className="text-sm text-slate-600">
                    Aquí conectaríamos un webhook de <b>n8n</b> (p.ej.: POST a
                    <i> /webhooks/alert-dispatch</i>) para: notificar a autoridades,
                    abrir ticket, publicar alerta ciudadana, etc.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
  
}
