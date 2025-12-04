import { useEffect, useMemo, useState } from "react";
import { useWebSocketContext } from "../components/WebSocketContext";
import { ValueModal } from "../components/ValueModal";


type Reporte = {
  id: string;
  fecha: string;        // ISO o yyyy-mm-dd
  zona: string;         // Centro, Norte, etc.
  riesgo: "Alto" | "Medio" | "Bajo";
  pm25: number;
  ica: number;
  estado: "Pendiente" | "Enviado";
  destinatario: "Autoridad" | "Industria";
  resumen: string;
};

const BRAND_A = "#f39a2e";
const BRAND_B = "#f07a09";


const BASE: Reporte[] = [
  { id: "R-2401", fecha: "2025-10-01", zona: "Centro",     riesgo: "Alto",  pm25: 46, ica: 82, estado: "Pendiente", destinatario: "Autoridad", resumen: "Exceso puntual PM2.5 en franja matutina." },
  { id: "R-2402", fecha: "2025-10-01", zona: "Norte",      riesgo: "Medio", pm25: 33, ica: 70, estado: "Pendiente", destinatario: "Industria",  resumen: "Valores moderados con tendencia creciente." },
  { id: "R-2403", fecha: "2025-10-01", zona: "Sur",        riesgo: "Alto",  pm25: 41, ica: 79, estado: "Enviado",   destinatario: "Autoridad", resumen: "Alerta enviada — seguimiento en curso." },
  { id: "R-2404", fecha: "2025-10-02", zona: "Equipetrol", riesgo: "Bajo",  pm25: 19, ica: 50, estado: "Pendiente", destinatario: "Industria",  resumen: "Condiciones estables; sin medidas." },
  { id: "R-2405", fecha: "2025-10-02", zona: "Plan 3,000", riesgo: "Medio", pm25: 28, ica: 63, estado: "Pendiente", destinatario: "Autoridad", resumen: "Posible pico vespertino si el clima persiste." },
  { id: "R-2406", fecha: "2025-10-03", zona: "Centro",     riesgo: "Medio", pm25: 30, ica: 66, estado: "Enviado",   destinatario: "Autoridad", resumen: "Informe remitido con recomendaciones." },
];

function BadgeRiesgo({ r }: { r: Reporte["riesgo"] }) {
  const cls =
    r === "Alto"
      ? "bg-red-100 text-red-700"
      : r === "Medio"
      ? "bg-amber-100 text-amber-700"
      : "bg-emerald-100 text-emerald-700";
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{r}</span>;
}

function BadgeEstado({ e }: { e: Reporte["estado"] }) {
  const cls = e === "Enviado" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700";
  return <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cls}`}>{e}</span>;
}

function Kpi({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <h3 className="mt-1 text-3xl font-bold text-slate-800">{value}</h3>
    </div>
  );
}

export default function Reportes() {
  const [data, setData] = useState<Reporte[]>(BASE);
  const [selIds, setSelIds] = useState<Set<string>>(new Set());
  const { lastValue } = useWebSocketContext();
  const [showModal, setShowModal] = useState(false);


  // Filtros
  const [qFrom, setQFrom] = useState<string>("");
  const [qTo, setQTo]     = useState<string>("");
  const zonas = useMemo(() => ["Todas", ...Array.from(new Set(BASE.map(b => b.zona)))], []);
  const [qZona, setQZona] = useState<string>("Todas");
  const [qRiesgo, setQRiesgo] = useState<string>("Todos");
  const [qEstado, setQEstado] = useState<string>("Todos");
  const [qBuscar, setQBuscar] = useState<string>("");

  // Paginación
  const [page, setPage] = useState(1);
  const pageSize = 5;

    useEffect(() => {
    // Mostrar el modal solo si hay un valor
    if (lastValue !== null) {
      setShowModal(true);
    }
  }, []); // Solo al montar el componente

  

  const filtrado = useMemo(() => {
    const from = qFrom ? new Date(qFrom) : null;
    const to   = qTo ? new Date(qTo) : null;

    return data.filter(r => {
      const dOk = (() => {
        const d = new Date(r.fecha);
        if (from && d < from) return false;
        if (to && d > to) return false;
        return true;
      })();
      const zOk = (qZona === "Todas" || r.zona === qZona);
      const rOk = (qRiesgo === "Todos" || r.riesgo === qRiesgo);
      const eOk = (qEstado === "Todos" || r.estado === qEstado);
      const bOk = !qBuscar ||
        r.id.toLowerCase().includes(qBuscar.toLowerCase()) ||
        r.zona.toLowerCase().includes(qBuscar.toLowerCase()) ||
        r.resumen.toLowerCase().includes(qBuscar.toLowerCase());
      return dOk && zOk && rOk && eOk && bOk;
    });
  }, [data, qFrom, qTo, qZona, qRiesgo, qEstado, qBuscar]);

  const totalPages = Math.max(1, Math.ceil(filtrado.length / pageSize));
  const pageData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtrado.slice(start, start + pageSize);
  }, [filtrado, page]);

  const kpis = useMemo(() => {
    const total = filtrado.length;
    const enviados = filtrado.filter(r => r.estado === "Enviado").length;
    const pendientes = total - enviados;
    const altos = filtrado.filter(r => r.riesgo === "Alto").length;
    return { total, enviados, pendientes, altos };
  }, [filtrado]);

  // Selección
  const toggleAll = (checked: boolean) => {
    if (checked) setSelIds(new Set(pageData.map(r => r.id)));
    else setSelIds(new Set());
  };
  const toggleOne = (id: string) => {
    setSelIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Acciones (mock)
  const marcarEnviado = () => {
    if (selIds.size === 0) return;
    setData(prev => prev.map(r => selIds.has(r.id) ? { ...r, estado: "Enviado" } : r));
    setSelIds(new Set());
  };
  const regenerar = () => {
    setData(prev => prev.map(r => {
      const delta = Math.round((Math.random() * 6) - 3);
      const pm25 = Math.max(8, r.pm25 + delta);
      const ica = Math.max(35, Math.min(100, r.ica + Math.round(delta * 1.5)));
      let riesgo: Reporte["riesgo"] = r.riesgo;
      if (pm25 >= 40) riesgo = "Alto";
      else if (pm25 >= 25) riesgo = "Medio";
      else riesgo = "Bajo";
      return { ...r, pm25, ica, riesgo };
    }));
  };

  // Export CSV
  const exportCSV = () => {
    const rows = [["ID","Fecha","Zona","Riesgo","PM2.5","ICA","Estado","Destinatario","Resumen"]];
    filtrado.forEach(r => rows.push([r.id,r.fecha,r.zona,r.riesgo,String(r.pm25),String(r.ica),r.estado,r.destinatario,r.resumen.replace(/\n/g," ")]));
    const csv = rows.map(row => row.map(cell => {
      const c = String(cell);
      return c.includes(",") || c.includes('"') ? `"${c.replace(/"/g,'""')}"` : c;
    }).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `reportes_${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // Export PDF (sin librerías: abre ventana imprimible)
  const exportPDF = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const style = `
      <style>
        body{ font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial; padding:16px; }
        h2{ margin:0 0 12px 0; }
        table{ border-collapse:collapse; width:100%; font-size:12px; }
        th,td{ border:1px solid #ddd; padding:6px 8px; }
        th{ background:#f5f5f5; text-align:left; }
        .meta{ margin:8px 0 16px; color:#555; }
      </style>`;
    const header = `<h2>Reporte de Predicciones</h2><div class="meta">Generado: ${new Date().toLocaleString()}</div>`;
    const rows = filtrado.map(r =>
      `<tr>
         <td>${r.id}</td><td>${r.fecha}</td><td>${r.zona}</td><td>${r.riesgo}</td>
         <td>${r.pm25}</td><td>${r.ica}</td><td>${r.estado}</td><td>${r.destinatario}</td>
       </tr>`
    ).join("");
    const html = `
      ${style}
      ${header}
      <table>
        <thead>
          <tr><th>ID</th><th>Fecha</th><th>Zona</th><th>Riesgo</th><th>PM2.5</th><th>ICA</th><th>Estado</th><th>Dest.</th></tr>
        </thead>
        <tbody>${rows || `<tr><td colspan="8">Sin datos.</td></tr>`}</tbody>
      </table>`;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    
    
    <div className="min-h-screen bg-slate-50 pb-12">
      {showModal && (
      <ValueModal
        value={lastValue}
        onClose={() => setShowModal(false)}
        userName="Usuario Demo"
      />
    )}
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Reportes</h1>
            <p className="text-sm text-slate-500">Listados y exportaciones (mock) · Santa Cruz</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              className="rounded-full px-4 py-2 text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              Exportar CSV
            </button>
            <button
              onClick={exportPDF}
              className="rounded-full px-4 py-2 text-sm font-semibold text-white shadow hover:scale-[1.02] transition"
              style={{ background: `linear-gradient(90deg, ${BRAND_B} 0%, ${BRAND_A} 100%)` }}
            >
              Exportar PDF
            </button>
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* KPIs */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <Kpi title="Total" value={kpis.total} />
          <Kpi title="Enviados" value={kpis.enviados} />
          <Kpi title="Pendientes" value={kpis.pendientes} />
          <Kpi title="Riesgo alto" value={kpis.altos} />
        </section>

        {/* Filtros */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="flex flex-wrap gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Desde</label>
                <input type="date" value={qFrom} onChange={e=>{ setQFrom(e.target.value); setPage(1); }}
                  className="rounded-lg border border-slate-300 text-sm px-3 py-2" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Hasta</label>
                <input type="date" value={qTo} onChange={e=>{ setQTo(e.target.value); setPage(1); }}
                  className="rounded-lg border border-slate-300 text-sm px-3 py-2" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Zona</label>
                <select value={qZona} onChange={e=>{ setQZona(e.target.value); setPage(1); }}
                  className="rounded-lg border border-slate-300 text-sm px-3 py-2">
                  {zonas.map(z => <option key={z}>{z}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Riesgo</label>
                <select value={qRiesgo} onChange={e=>{ setQRiesgo(e.target.value); setPage(1); }}
                  className="rounded-lg border border-slate-300 text-sm px-3 py-2">
                  {["Todos","Alto","Medio","Bajo"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-500">Estado</label>
                <select value={qEstado} onChange={e=>{ setQEstado(e.target.value); setPage(1); }}
                  className="rounded-lg border border-slate-300 text-sm px-3 py-2">
                  {["Todos","Pendiente","Enviado"].map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-500">Buscar</label>
              <input
                value={qBuscar}
                onChange={e=>{ setQBuscar(e.target.value); setPage(1); }}
                placeholder="ID, zona o resumen"
                className="rounded-lg border border-slate-300 text-sm px-4 py-2 w-[260px]"
              />
            </div>
          </div>
        </section>

        {/* Tabla */}
        <section className="rounded-2xl border border-slate-200 bg-white p-2 md:p-4 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600 border-b">
                  <th className="py-3 px-3">
                    <input
                      type="checkbox"
                      onChange={(e)=>toggleAll(e.currentTarget.checked)}
                      checked={pageData.length>0 && pageData.every(r => selIds.has(r.id))}
                    />
                  </th>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Fecha</th>
                  <th className="py-3 px-3">Zona</th>
                  <th className="py-3 px-3">Riesgo</th>
                  <th className="py-3 px-3">PM2.5</th>
                  <th className="py-3 px-3">ICA</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3">Destinatario</th>
                  <th className="py-3 px-3">Resumen</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pageData.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selIds.has(r.id)}
                        onChange={()=>toggleOne(r.id)}
                      />
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{r.id}</td>
                    <td className="py-3 px-3">{r.fecha}</td>
                    <td className="py-3 px-3">{r.zona}</td>
                    <td className="py-3 px-3"><BadgeRiesgo r={r.riesgo} /></td>
                    <td className="py-3 px-3">{r.pm25}</td>
                    <td className="py-3 px-3">{r.ica}</td>
                    <td className="py-3 px-3"><BadgeEstado e={r.estado} /></td>
                    <td className="py-3 px-3">{r.destinatario}</td>
                    <td className="py-3 px-3 max-w-[360px] truncate" title={r.resumen}>{r.resumen}</td>
                  </tr>
                ))}
                {pageData.length === 0 && (
                  <tr><td colSpan={10} className="py-10 text-center text-slate-500">Sin resultados para los filtros.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Footer tabla: paginación + selección */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-2 py-3">
            <div className="text-sm text-slate-600">
              Seleccionados: <b>{selIds.size}</b>
            </div>
            <div className="flex items-center gap-2">
              <button
                disabled={page<=1}
                onClick={()=>setPage(p=>Math.max(1,p-1))}
                className="rounded-full px-3 py-1 border border-slate-300 text-slate-700 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="text-sm text-slate-600">
                Página <b>{page}</b> de <b>{totalPages}</b>
              </span>
              <button
                disabled={page>=totalPages}
                onClick={()=>setPage(p=>Math.min(totalPages,p+1))}
                className="rounded-full px-3 py-1 border border-slate-300 text-slate-700 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
