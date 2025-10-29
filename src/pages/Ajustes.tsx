// src/pages/Ajustes.tsx
import { useEffect, useMemo, useRef, useState } from "react";

type AjustesState = {
  idioma: "es" | "en";
  tema: "claro" | "oscuro" | "sistema";
  zonaHoraria: string;
  refrescoMin: number;       // cada cuántos minutos refrescar datos
  unidadPM: "µg/m³" | "AQI"; // visualización de calidad de aire
  notiEmail: boolean;
  notiWhats: boolean;
  notiInApp: boolean;
  mapProvider: "mapbox" | "osm";
  mapKey: string;
};

const LS_KEY = "paup.settings";

const defaultState: AjustesState = {
  idioma: "es",
  tema: "claro",
  zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone || "America/La_Paz",
  refrescoMin: 15,
  unidadPM: "µg/m³",
  notiEmail: true,
  notiWhats: false,
  notiInApp: true,
  mapProvider: "mapbox",
  mapKey: "",
};

const INPUT_CLS =
  "w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400";

export default function Ajustes() {
  const [s, setS] = useState<AjustesState>(defaultState);
  const [saving, setSaving] = useState(false);
  const [testingKey, setTestingKey] = useState<"idle" | "testing" | "ok" | "fail">("idle");
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Cargar desde localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setS({ ...defaultState, ...JSON.parse(raw) });
    } catch {
      // noop
    }
  }, []);

  // Aplicar tema al <html>
  useEffect(() => {
    const root = document.documentElement;
    const apply = (mode: "claro" | "oscuro") => {
      if (mode === "oscuro") root.classList.add("dark");
      else root.classList.remove("dark");
    };

    if (s.tema === "sistema") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches ? "oscuro" : "claro");
      const handler = (e: MediaQueryListEvent) => apply(e.matches ? "oscuro" : "claro");
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    } else {
      apply(s.tema);
    }
  }, [s.tema]);

  // Guardar
  const save = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 350));
    localStorage.setItem(LS_KEY, JSON.stringify(s));
    setSaving(false);
    alert("Ajustes guardados (mock).");
  };

  // Reset
  const resetAjustes = () => {
    if (confirm("¿Restaurar valores por defecto?")) {
      setS(defaultState);
      localStorage.setItem(LS_KEY, JSON.stringify(defaultState));
    }
  };

  // Exportar JSON
  const exportar = () => {
    const blob = new Blob([JSON.stringify(s, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "ajustes-paup.json" });
    a.click();
    URL.revokeObjectURL(url);
  };

  // Importar JSON
  const importar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        setS((prev) => ({ ...prev, ...parsed }));
        alert("Ajustes importados (sin guardar). Pulsa Guardar para persistir.");
      } catch {
        alert("Archivo inválido.");
      }
      e.target.value = "";
    };
    reader.readAsText(f);
  };

  // Test rápido de API Key (simulado)
  const probarClave = async () => {
    setTestingKey("testing");
    await new Promise((r) => setTimeout(r, 600));
    // Heurística simple: para Mapbox, claves suelen ser > 10 chars; para OSM no se requiere
    const ok =
      (s.mapProvider === "mapbox" && s.mapKey.trim().length >= 10) ||
      (s.mapProvider === "osm" && s.mapKey.trim().length === 0);
    setTestingKey(ok ? "ok" : "fail");
    setTimeout(() => setTestingKey("idle"), 1500);
  };

  const keyHint = useMemo(() => {
    if (s.mapProvider === "mapbox") return "Introduce tu Mapbox token (p. ej., pk.XXXXX...).";
    return "OSM no requiere clave, deja este campo vacío.";
  }, [s.mapProvider]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white mb-6 shadow"
        style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
      >
        <h1 className="text-xl font-semibold">Ajustes</h1>
        <p className="text-white/90 text-sm">
          Preferencias generales, notificaciones e integraciones.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-slate-800 font-semibold mb-4">General</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Idioma">
              <select
                className={INPUT_CLS}
                value={s.idioma}
                onChange={(e) => setS({ ...s, idioma: e.target.value as AjustesState["idioma"] })}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </Field>

            <Field label="Tema">
              <select
                className={INPUT_CLS}
                value={s.tema}
                onChange={(e) => setS({ ...s, tema: e.target.value as AjustesState["tema"] })}
              >
                <option value="claro">Claro</option>
                <option value="oscuro">Oscuro</option>
                <option value="sistema">Según sistema</option>
              </select>
            </Field>

            <Field label="Zona horaria">
              <input
                className={INPUT_CLS}
                value={s.zonaHoraria}
                onChange={(e) => setS({ ...s, zonaHoraria: e.target.value })}
                placeholder="America/La_Paz"
              />
            </Field>

            <Field label="Refresco de datos (min)">
              <input
                className={INPUT_CLS}
                type="number"
                min={1}
                max={120}
                value={s.refrescoMin}
                onChange={(e) => setS({ ...s, refrescoMin: Number(e.target.value) })}
              />
            </Field>

            <Field label="Unidad de calidad del aire">
              <select
                className={INPUT_CLS}
                value={s.unidadPM}
                onChange={(e) => setS({ ...s, unidadPM: e.target.value as AjustesState["unidadPM"] })}
              >
                <option value="µg/m³">µg/m³</option>
                <option value="AQI">AQI</option>
              </select>
            </Field>
          </div>
        </section>

        {/* Notificaciones */}
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-slate-800 font-semibold mb-4">Notificaciones</h2>
          <Toggle
            label="Email"
            checked={s.notiEmail}
            onChange={(v) => setS({ ...s, notiEmail: v })}
          />
          <Toggle
            label="WhatsApp"
            checked={s.notiWhats}
            onChange={(v) => setS({ ...s, notiWhats: v })}
          />
          <Toggle
            label="In-App (campanita)"
            checked={s.notiInApp}
            onChange={(v) => setS({ ...s, notiInApp: v })}
          />
          <p className="text-xs text-slate-500 mt-3">
            * En una integración real, aquí vincularías correos/WhatsApp y preferencias por severidad.
          </p>
        </section>

        {/* Integraciones */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h2 className="text-slate-800 font-semibold mb-4">Integraciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Proveedor de mapas">
              <select
                className={INPUT_CLS}
                value={s.mapProvider}
                onChange={(e) => {
                  const provider = e.target.value as AjustesState["mapProvider"];
                  setS({ ...s, mapProvider: provider, mapKey: provider === "osm" ? "" : s.mapKey });
                }}
              >
                <option value="mapbox">Mapbox</option>
                <option value="osm">OpenStreetMap</option>
              </select>
            </Field>

            <Field label="API Key (si aplica)" hint={keyHint}>
              <div className="flex gap-2">
                <input
                  className={INPUT_CLS + " flex-1"}
                  type={s.mapProvider === "mapbox" ? "password" : "text"}
                  placeholder={s.mapProvider === "mapbox" ? "pk.xxx..." : "No requerida para OSM"}
                  disabled={s.mapProvider === "osm"}
                  value={s.mapKey}
                  onChange={(e) => setS({ ...s, mapKey: e.target.value })}
                />
                <button
                  type="button"
                  onClick={probarClave}
                  className="px-3 py-2 rounded-lg text-white font-semibold disabled:opacity-60"
                  style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
                  disabled={testingKey === "testing"}
                  title="Simula una verificación de la API Key"
                >
                  {testingKey === "testing" ? "Probando..." : "Probar"}
                </button>
              </div>
              <div className="mt-2 h-5">
                {testingKey === "ok" && (
                  <span className="text-green-600 text-sm">✓ Clave válida.</span>
                )}
                {testingKey === "fail" && (
                  <span className="text-rose-600 text-sm">✗ Clave inválida.</span>
                )}
              </div>
            </Field>
          </div>
        </section>
      </div>

      {/* Acciones */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button
          onClick={save}
          className="px-5 py-2.5 rounded-lg text-white font-semibold disabled:opacity-60"
          style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
          disabled={saving}
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>

        <button
          onClick={exportar}
          className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Exportar .json
        </button>

        <button
          onClick={() => fileRef.current?.click()}
          className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          Importar .json
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={importar}
        />

        <div className="flex-1" />

        <button
          onClick={resetAjustes}
          className="px-5 py-2.5 rounded-lg border border-rose-300 text-rose-600 hover:bg-rose-50"
        >
          Restablecer
        </button>
      </div>
    </div>
  );
}

/* ---------- Pequeños helpers de UI ---------- */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-slate-700 mb-1">{label}</div>
      {children}
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between py-2">
      <span className="text-slate-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-7 rounded-full transition-all relative ${
          checked ? "bg-emerald-500" : "bg-slate-300"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </label>
  );
}
