import { useEffect, useMemo, useRef, useState } from "react";

type Profile = {
  nombre: string;
  email: string;
  telefono: string;
  organizacion: string;
  rol: string;
  ciudad: string;
  avatar?: string; // dataURL
};

type Prefs = {
  idioma: "es" | "en";
  darkMode: boolean;
  notifEmail: boolean;
  notifWhatsapp: boolean;
  zonaPorDefecto: string;
  umbralPersonalPM25: number;
};

const LS_PROFILE_KEY = "paup.profile";
const LS_PREFS_KEY = "paup.prefs";

export default function Perfil() {
  const [profile, setProfile] = useState<Profile>({
    nombre: "",
    email: "",
    telefono: "",
    organizacion: "",
    rol: "Analista",
    ciudad: "Santa Cruz de la Sierra",
    avatar: undefined,
  });

  const [prefs, setPrefs] = useState<Prefs>({
    idioma: "es",
    darkMode: false,
    notifEmail: true,
    notifWhatsapp: false,
    zonaPorDefecto: "Equipetrol",
    umbralPersonalPM25: 55,
  });

  const [pwd, setPwd] = useState({ actual: "", nueva: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // Cargar desde localStorage
  useEffect(() => {
    try {
      const p = localStorage.getItem(LS_PROFILE_KEY);
      const f = localStorage.getItem(LS_PREFS_KEY);
      if (p) setProfile(JSON.parse(p));
      if (f) setPrefs(JSON.parse(f));
    } catch {}
  }, []);

  // Fuerza de contraseña
  const pwdScore = useMemo(() => {
    const s = pwd.nueva;
    let score = 0;
    if (s.length >= 8) score++;
    if (/[A-Z]/.test(s)) score++;
    if (/[a-z]/.test(s)) score++;
    if (/\d/.test(s)) score++;
    if (/[^A-Za-z0-9]/.test(s)) score++;
    return score; // 0..5
  }, [pwd.nueva]);

  const strengthLabel = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"];
  const strengthColor = ["bg-rose-500", "bg-orange-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-600"];

  // Guardar perfil/prefs (mock)
  const saveAll = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    localStorage.setItem(LS_PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(LS_PREFS_KEY, JSON.stringify(prefs));
    setSaving(false);
    alert("Cambios guardados (mock).");
  };

  // Cambiar contraseña (mock)
  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwd.actual || !pwd.nueva || !pwd.confirm) {
      alert("Completa todos los campos de contraseña.");
      return;
    }
    if (pwd.nueva !== pwd.confirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (pwdScore < 3) {
      alert("La contraseña nueva es muy débil. Usa mayúsculas, minúsculas, números y un caracter especial.");
      return;
    }
    // En real: POST /api/me/password
    setPwd({ actual: "", nueva: "", confirm: "" });
    alert("Contraseña actualizada (mock).");
  };

  // Cargar avatar
  const onPickAvatar = () => fileRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setProfile((pr) => ({ ...pr, avatar: String(reader.result) }));
    reader.readAsDataURL(f);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Encabezado */}
      <div
        className="rounded-2xl p-6 text-white mb-6"
        style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                profile.avatar ||
                `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(profile.nombre || "Usuario")}`
              }
              alt="avatar"
              className="w-16 h-16 rounded-full ring-2 ring-white/70 object-cover"
            />
            <button
              onClick={onPickAvatar}
              className="absolute -bottom-1 -right-1 text-xs px-2 py-1 rounded-full bg-black/40 backdrop-blur hover:bg-black/60"
              title="Cambiar foto"
            >
              Editar
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          </div>
          <div>
            <h1 className="text-xl font-semibold leading-tight">Perfil de usuario</h1>
            <p className="text-white/90 text-sm">Gestiona tu información, seguridad y preferencias.</p>
          </div>
          <div className="ml-auto">
            <button
              disabled={saving}
              onClick={saveAll}
              className="px-4 py-2 rounded-lg font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-70"
              style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
            >
              {saving ? "Guardando…" : "Guardar cambios"}
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1: Perfil */}
        <section className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-slate-800 font-semibold mb-4">Información personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nombre completo">
              <input
                className="input"
                value={profile.nombre}
                onChange={(e) => setProfile({ ...profile, nombre: e.target.value })}
                placeholder="Tu nombre"
              />
            </Field>
            <Field label="Correo">
              <input
                className="input"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="tu@email.com"
              />
            </Field>
            <Field label="Teléfono">
              <input
                className="input"
                value={profile.telefono}
                onChange={(e) => setProfile({ ...profile, telefono: e.target.value })}
                placeholder="+591 7xx xxx xx"
              />
            </Field>
            <Field label="Organización">
              <input
                className="input"
                value={profile.organizacion}
                onChange={(e) => setProfile({ ...profile, organizacion: e.target.value })}
                placeholder="Ej.: Alcaldía SCZ"
              />
            </Field>
            <Field label="Rol">
              <select
                className="input"
                value={profile.rol}
                onChange={(e) => setProfile({ ...profile, rol: e.target.value })}
              >
                <option>Analista</option>
                <option>Operador</option>
                <option>Administrador</option>
                <option>Auditor</option>
              </select>
            </Field>
            <Field label="Ciudad">
              <input
                className="input"
                value={profile.ciudad}
                onChange={(e) => setProfile({ ...profile, ciudad: e.target.value })}
                placeholder="Santa Cruz de la Sierra"
              />
            </Field>
          </div>
        </section>

        {/* Columna 2: Seguridad */}
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-slate-800 font-semibold mb-4">Seguridad</h2>
          <form onSubmit={changePassword} className="space-y-3">
            <Field label="Contraseña actual">
              <input
                className="input"
                type="password"
                value={pwd.actual}
                onChange={(e) => setPwd({ ...pwd, actual: e.target.value })}
                placeholder="••••••••"
              />
            </Field>
            <Field label="Contraseña nueva">
              <input
                className="input"
                type="password"
                value={pwd.nueva}
                onChange={(e) => setPwd({ ...pwd, nueva: e.target.value })}
                placeholder="Mín. 8, mayús/minús/número/símbolo"
              />
              <div className="mt-2">
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strengthColor[Math.max(0, pwdScore - 1)]}`}
                    style={{ width: `${(pwdScore / 5) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Fortaleza: {strengthLabel[Math.max(0, pwdScore - 1)] || "N/A"}
                </p>
              </div>
            </Field>
            <Field label="Confirmar contraseña">
              <input
                className="input"
                type="password"
                value={pwd.confirm}
                onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
                placeholder="••••••••"
              />
            </Field>
            <button
              type="submit"
              className="w-full py-2 rounded-lg font-semibold text-white"
              style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
            >
              Actualizar contraseña
            </button>
          </form>
        </section>

        {/* Preferencias (full width en desktop) */}
        <section className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="text-slate-800 font-semibold mb-4">Preferencias</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Idioma">
              <select
                className="input"
                value={prefs.idioma}
                onChange={(e) => setPrefs({ ...prefs, idioma: e.target.value as Prefs["idioma"] })}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </Field>
            <Field label="Zona por defecto">
              <input
                className="input"
                value={prefs.zonaPorDefecto}
                onChange={(e) => setPrefs({ ...prefs, zonaPorDefecto: e.target.value })}
                placeholder="Ej.: 4to anillo Sur"
              />
            </Field>
            <Field label="Umbral personal PM2.5 (µg/m³)">
              <input
                className="input"
                type="number"
                min={10}
                max={250}
                value={prefs.umbralPersonalPM25}
                onChange={(e) => setPrefs({ ...prefs, umbralPersonalPM25: Number(e.target.value) })}
              />
            </Field>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Toggle
              label="Modo oscuro (UI)"
              checked={prefs.darkMode}
              onChange={(v) => setPrefs({ ...prefs, darkMode: v })}
            />
            <Toggle
              label="Notificaciones por email"
              checked={prefs.notifEmail}
              onChange={(v) => setPrefs({ ...prefs, notifEmail: v })}
            />
            <Toggle
              label="Notificaciones por WhatsApp"
              checked={prefs.notifWhatsapp}
              onChange={(v) => setPrefs({ ...prefs, notifWhatsapp: v })}
            />
          </div>

          <div className="mt-5">
            <button
              disabled={saving}
              onClick={saveAll}
              className="px-4 py-2 rounded-lg font-semibold text-white shadow-md hover:opacity-95 disabled:opacity-70"
              style={{ background: "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)" }}
            >
              {saving ? "Guardando…" : "Guardar preferencias"}
            </button>
          </div>
        </section>
      </div>

      {/* Pequeños estilos utilitarios para inputs */}
      <style>{`
        .input {
          @apply w-full px-3 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-amber-400;
        }
      `}</style>
    </div>
  );
}

// Subcomponentes simples
function Field(props: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-600 mb-1">{props.label}</span>
      {props.children}
    </label>
  );
}
function Toggle(props: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 border border-slate-200 rounded-lg p-3">
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(e) => props.onChange(e.target.checked)}
      />
      <span className="text-sm text-slate-700">{props.label}</span>
    </label>
  );
}
