import { useState } from "react";

type Rule = {
  id: string;
  name: string;
  metric: "PM2.5" | "NO2" | "O3";
  threshold: number;
  severity: "critical" | "high" | "medium" | "low";
  active: boolean;
};

const initialRules: Rule[] = [
  { id: "R-1", name: "PM2.5 > 150 crítico", metric: "PM2.5", threshold: 150, severity: "critical", active: true },
  { id: "R-2", name: "NO2 > 80 alto", metric: "NO2", threshold: 80, severity: "high", active: true },
];

export default function AlertRules() {
  const [rules, setRules] = useState<Rule[]>(initialRules);
  const [name, setName] = useState("");
  const [metric, setMetric] = useState<Rule["metric"]>("PM2.5");
  const [threshold, setThreshold] = useState<number>(35);
  const [severity, setSeverity] = useState<Rule["severity"]>("medium");

  const addRule = () => {
    if (!name.trim()) return;
    const r: Rule = {
      id: "R-" + (rules.length + 1),
      name,
      metric,
      threshold,
      severity,
      active: true,
    };
    setRules((prev) => [r, ...prev]);
    setName("");
    setThreshold(35);
    setSeverity("medium");
    setMetric("PM2.5");
  };

  const toggleActive = (id: string) =>
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );

  const removeRule = (id: string) =>
    setRules((prev) => prev.filter((r) => r.id !== id));

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-slate-800">Reglas de alertas</h2>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
          <input
            className="px-3 py-2 rounded-lg border border-slate-300"
            placeholder="Nombre de la regla"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded-lg border border-slate-300"
            value={metric}
            onChange={(e) => setMetric(e.target.value as Rule["metric"])}
          >
            <option>PM2.5</option>
            <option>NO2</option>
            <option>O3</option>
          </select>
          <input
            className="px-3 py-2 rounded-lg border border-slate-300"
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
            placeholder="Umbral"
          />
          <select
            className="px-3 py-2 rounded-lg border border-slate-300"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Rule["severity"])}
          >
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
          <button
            onClick={addRule}
            className="text-white rounded-lg font-semibold"
            style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
          >
            Añadir
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {rules.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between border border-slate-200 rounded-lg p-3"
            >
              <div>
                <div className="font-medium text-slate-800">{r.name}</div>
                <div className="text-sm text-slate-600">
                  Métrica: {r.metric} · Umbral: {r.threshold} · Severidad: {r.severity}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={r.active}
                    onChange={() => toggleActive(r.id)}
                  />
                  Activa
                </label>
                <button
                  className="px-3 py-1.5 rounded-lg text-sm border border-rose-400 text-rose-600 hover:bg-rose-50"
                  onClick={() => removeRule(r.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {rules.length === 0 && (
            <div className="text-sm text-slate-500">No hay reglas configuradas.</div>
          )}
        </div>
      </div>
    </div>
  );
}
