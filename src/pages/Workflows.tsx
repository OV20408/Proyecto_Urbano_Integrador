import { useMemo, useState } from "react";

type Estado = "Habilitado" | "Pausado";
type Tipo = "Alerta" | "Reporte" | "Sincronización";

type Workflow = {
  id: string;
  nombre: string;
  tipo: Tipo;
  estado: Estado;
  disparador: string;     // p.ej. “Predicción > umbral PM2.5”
  condicion?: string;     // p.ej. “Zona ∈ {Centro, Sur}”
  acciones: string[];     // p.ej. [“Push app”, “Email autoridad”]
  ultimaEjecucion?: string; // ISO
  proximaEjecucion?: string; // ISO
  kpis: {
    ejecuciones: number;
    exitos: number;
    errores: number;
  };
  etiquetas?: string[];
};

type LogItem = {
  id: string;
  workflowId: string;
  fecha: string;
  nivel: "info" | "warn" | "error";
  mensaje: string;
};

const BRAND_A = "#f39a2e";
const BRAND_B = "#f07a09";

// Mock base
const BASE: Workflow[] = [
  {
    id: "W-AL-01",
    nombre: "Alerta PM2.5 crítica",
    tipo: "Alerta",
    estado: "Habilitado",
    disparador: "Predicción PM2.5 ≥ 40 µg/m³",
    condicion: "Zona ∈ {Centro, Sur}",
    acciones: ["Notificar autoridad (email)", "Push a app ciudadana", "Actualizar dashboard"],
    ultimaEjecucion: "2025-10-05T08:10:00Z",
    proximaEjecucion: "2025-10-05T08:15:00Z",
    kpis: { ejecuciones: 124, exitos: 121, errores: 3 },
    etiquetas: ["ambiental", "ods11", "crítica"]
  },
  {
    id: "W-RP-02",
    nombre: "Reporte semanal industrias",
    tipo: "Reporte",
    estado: "Habilitado",
    disparador: "CRON: Lunes 07:30",
    condicion: "Empresas con incumplimientos > 0",
    acciones: ["Generar PDF", "Enviar a responsables", "Log en bitácora"],
    ultimaEjecucion: "2025-10-04T07:30:00Z",
    proximaEjecucion: "2025-10-11T07:30:00Z",
    kpis: { ejecuciones: 44, exitos: 44, errores: 0 },
    etiquetas: ["semanal", "cumplimiento"]
  },
  {
    id: "W-SY-03",
    nombre: "Sincronización de OpenAQ",
    tipo: "Sincronización",
    estado: "Pausado",
    disparador: "CRON: Cada 15 min",
    condicion: "API status = OK",
    acciones: ["Fetch API", "Normalizar", "Guardar en BD"],
    ultimaEjecucion: "2025-10-01T12:00:00Z",
    proximaEjecucion: "—",
    kpis: { ejecuciones: 320, exitos: 316, errores: 4 },
    etiquetas: ["datasource", "openaq"]
  }
];

const BASE_LOGS: LogItem[] = [
  { id: "L-1", workflowId: "W-AL-01", fecha: "2025-10-05T08:10:01Z", nivel: "info",  mensaje: "Alerta enviada a autoridad y ciudadanía." },
  { id: "L-2", workflowId: "W-AL-01", fecha: "2025-10-05T07:55:01Z", nivel: "warn",  mensaje: "Latencia alta en envío push (1.3s)." },
  { id: "L-3", workflowId: "W-AL-01", fecha: "2025-10-05T07:40:01Z", nivel: "error", mensaje: "Fallo SMTP temporal, reintento exitoso." },
  { id: "L-4", workflowId: "W-RP-02", fecha: "2025-10-04T07:30:20Z", nivel: "info",  mensaje: "PDFs generados (12) y enviados." },
  { id: "L-5", workflowId: "W-SY-03", fecha: "2025-10-01T12:00:05Z", nivel: "error", mensaje: "OpenAQ 502 Bad Gateway." },
];

function kpiRate(ok: number, total: number) {
  if (!total) return 0;
  return Math.round((ok / total) * 100);
}

function Chip({ text }: { text: string }) {
  return (
    <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
      {text}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
    </div>
  );
}

export default function Workflows() {
  const [rows, setRows] = useState<Workflow[]>(BASE);
  const [logs] = useState<LogItem[]>(BASE_LOGS);

  // Filtros
  const [qEstado, setQEstado] = useState<"Todos" | Estado>("Todos");
  const [qTipo, setQTipo] = useState<"Todos" | Tipo>("Todos");
  const [qBuscar, setQBuscar] = useState("");

  // Selección y panel de logs
  const [openLogFor, setOpenLogFor] = useState<string | null>(null);

  const filtrados = useMemo(() => {
    return rows.filter(w => {
      const eOk = qEstado === "Todos" || w.estado === qEstado;
      const tOk = qTipo === "Todos" || w.tipo === qTipo;
      const q = qBuscar.trim().toLowerCase();
      const bOk =
        !q ||
        w.nombre.toLowerCase().includes(q) ||
        w.disparador.toLowerCase().includes(q) ||
        (w.condicion ?? "").toLowerCase().includes(q) ||
        w.acciones.join(" ").toLowerCase().includes(q) ||
        (w.etiquetas ?? []).join(" ").toLowerCase().includes(q);
      return eOk && tOk && bOk;
    });
  }, [rows, qEstado, qTipo, qBuscar]);

  const kpis = useMemo(() => {
    const total = filtrados.length;
    const habilitados = filtrados.filter(w => w.estado === "Habilitado").length;
    const ejec = filtrados.reduce((a, w) => a + w.kpis.ejecuciones, 0);
    const ok = filtrados.reduce((a, w) => a + w.kpis.exitos, 0);
    const err = filtrados.reduce((a, w) => a + w.kpis.errores, 0);
    const tasa = kpiRate(ok, ejec || 1);
    return { total, habilitados, tasa, err };
  }, [filtrados]);

  const toggleEstado = (id: string) => {
    setRows(prev =>
      prev.map(w => (w.id === id ? { ...w, estado: w.estado === "Habilitado" ? "Pausado" : "Habilitado" } : w))
    );
  };

  const runNow = (id: string) => {
    // Mock: suma ejecuciones y (casi siempre) éxito
    setRows(prev =>
      prev.map(w => {
        if (w.id !== id) return w;
        const ok = Math.random() > 0.1;
        return {
          ...w,
          kpis: {
            ejecuciones: w.kpis.ejecuciones + 1,
            exitos: w.kpis.exitos + (ok ? 1 : 0),
            errores: w.kpis.errores + (ok ? 0 : 1),
          },
          ultimaEjecucion: new Date().toISOString(),
        };
      })
    );
    setOpenLogFor(id);
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filtrados, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `workflows_${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Workflows (n8n)</h1>
            <p className="text-sm text-slate-500">Automatizaciones del sistema · Santa Cruz</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportJSON}
              className="rounded-full px-4 py-2 text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Exportar JSON
            </button>
            
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Stat label="Total" value={kpis.total} />
          <Stat label="Habilitados" value={kpis.habilitados} />
          <Stat label="Tasa de éxito" value={`${kpis.tasa}%`} />
          <Stat label="Errores acumulados" value={kpis.err} />
        </section>

        {/* Filtros */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Estado</label>
                <select
                  value={qEstado}
                  onChange={(e)=>setQEstado(e.target.value as any)}
                  className="rounded-lg border border-slate-300 text-sm px-3 py-2"
                >
                  {["Todos","Habilitado","Pausado"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Tipo</label>
                <select
                  value={qTipo}
                  onChange={(e)=>setQTipo(e.target.value as any)}
                  className="rounded-lg border border-slate-300 text-sm px-3 py-2"
                >
                  {["Todos","Alerta","Reporte","Sincronización"].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500">Buscar</label>
              <input
                value={qBuscar}
                onChange={(e)=>setQBuscar(e.target.value)}
                placeholder="Nombre, trigger, acción o etiqueta…"
                className="rounded-lg border border-slate-300 text-sm px-4 py-2 w-[260px]"
              />
            </div>
          </div>
        </section>

        {/* Grid de workflows */}
        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtrados.map(w => {
            const tasa = kpiRate(w.kpis.exitos, w.kpis.ejecuciones || 1);
            const colorDot = w.estado === "Habilitado" ? "bg-emerald-500" : "bg-slate-400";
            return (
              <div key={w.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                {/* Header card */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${colorDot}`} />
                      <span className="text-xs text-slate-600">{w.estado}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mt-1">{w.nombre}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Chip text={w.tipo} />
                      {(w.etiquetas ?? []).slice(0,3).map(t => <Chip key={t} text={t} />)}
                    </div>
                  </div>
                  {/* Toggle */}
                  <button
                    onClick={()=>toggleEstado(w.id)}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${
                      w.estado === "Habilitado" ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                    title="Habilitar / Pausar"
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition ${
                        w.estado === "Habilitado" ? "translate-x-7" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {/* Cuerpo: flujo visual */}
                <div className="mt-4 space-y-3">
                  <div className="text-xs font-semibold text-slate-500">Flujo</div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">Trigger</span>
                    <span className="text-slate-400">→</span>
                    <span className="px-2 py-1 rounded-lg bg-sky-50 text-sky-700 border border-sky-200">Condición</span>
                    <span className="text-slate-400">→</span>
                    <span className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">Acciones</span>
                  </div>
                  <ul className="text-sm text-slate-700 ml-1 space-y-1">
                    <li><b>Trigger:</b> {w.disparador}</li>
                    {w.condicion && <li><b>Condición:</b> {w.condicion}</li>}
                    <li><b>Acciones:</b> {w.acciones.join(" · ")}</li>
                  </ul>
                </div>

                {/* KPIs del card */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-2 text-center">
                    <div className="text-[11px] text-slate-500">Ejec.</div>
                    <div className="text-base font-semibold">{w.kpis.ejecuciones}</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-2 text-center">
                    <div className="text-[11px] text-slate-500">Éxito</div>
                    <div className="text-base font-semibold">{tasa}%</div>
                  </div>
                  <div className="rounded-lg bg-slate-50 border border-slate-200 p-2 text-center">
                    <div className="text-[11px] text-slate-500">Errores</div>
                    <div className="text-base font-semibold">{w.kpis.errores}</div>
                  </div>
                </div>

                {/* Fechas */}
                <div className="mt-3 text-xs text-slate-500">
                  <div>Última: {w.ultimaEjecucion ? new Date(w.ultimaEjecucion).toLocaleString() : "—"}</div>
                  <div>Próxima: {w.proximaEjecucion ? new Date(w.proximaEjecucion).toLocaleString() : "—"}</div>
                </div>

                {/* Acciones */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={()=>runNow(w.id)}
                    className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow hover:scale-[1.02] transition"
                    style={{ background: `linear-gradient(90deg, ${BRAND_A} 0%, ${BRAND_B} 100%)` }}
                  >
                    Ejecutar ahora
                  </button>
                  <button
                    onClick={()=>setOpenLogFor(openLogFor===w.id ? null : w.id)}
                    className="rounded-full px-4 py-2 text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Ver log
                  </button>
                  <button
                    onClick={()=>alert("Editar: próximamente")}
                    className="rounded-full px-4 py-2 text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100"
                  >
                    Editar
                  </button>
                </div>

                {/* Panel de logs */}
                {openLogFor === w.id && (
                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs text-slate-500 mb-2">Bitácora de ejecuciones</div>
                    <div className="max-h-40 overflow-auto pr-1">
                      {logs.filter(l => l.workflowId === w.id).map(l => {
                        const c =
                          l.nivel === "error" ? "text-red-600" :
                          l.nivel === "warn" ? "text-amber-600" :
                          "text-slate-700";
                        return (
                          <div key={l.id} className="text-sm py-1 border-b border-slate-200/60 last:border-0">
                            <span className="text-xs text-slate-500 mr-2">{new Date(l.fecha).toLocaleString()}</span>
                            <span className={`font-medium ${c}`}>[{l.nivel}]</span>{" "}
                            <span className="text-slate-700">{l.mensaje}</span>
                          </div>
                        );
                      })}
                      {logs.filter(l => l.workflowId === w.id).length === 0 && (
                        <div className="text-sm text-slate-500">Sin eventos.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtrados.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
              No hay workflows con los filtros actuales.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
