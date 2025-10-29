import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const ORANGE = "#f39a2e";
const DEEP_ORANGE = "#f07a09";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/predicciones", label: "Predicciones" },
  { to: "/alertas", label: "Alertas" },
  { to: "/reportes", label: "Reportes" },
  { to: "/workflows", label: "Workflows" }, // (n8n)
];

const AuthNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav
      className="sticky top-0 z-40 shadow"
      style={{ background: `linear-gradient(90deg, ${ORANGE} 0%, ${DEEP_ORANGE} 100%)` }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="h-16 md:h-20 flex items-center justify-between">
          {/* Brand */}
          <button
            onClick={() => navigate("/dashboard")}
            className="text-white font-bold text-xl md:text-2xl tracking-wide"
          >
            ODS11 • Plataforma
          </button>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-white/90">
            {links.map((l) => (
              <li key={l.to} className="relative">
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `pb-1 transition ${isActive ? "text-white" : "hover:text-white"}`
                  }
                >
                  {({ isActive }) => (
                    <span className="relative">
                      {l.label}
                      {/* Indicador activo */}
                      <span
                        className={`block absolute left-0 right-0 -bottom-2 h-0.5 rounded-full transition-all ${
                          isActive ? "bg-white" : "bg-transparent"
                        }`}
                      />
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* User / Avatar */}
          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-3 text-white"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              <div className="text-right hidden sm:block">
                <div className="text-sm font-semibold leading-4">Franco</div>
                <div className="text-[11px] opacity-80">Industria</div>
              </div>
              <div className="w-10 h-10 rounded-full ring-2 ring-white/60 overflow-hidden bg-white/20 grid place-items-center">
                {/* Si luego tienes foto, reemplaza por <img src={foto} className="w-full h-full object-cover" /> */}
                <span className="font-bold">F</span>
              </div>
            </button>

            {/* Dropdown */}
            {open && (
              <div
                role="menu"
                className="absolute right-0 mt-3 w-48 rounded-xl overflow-hidden bg-white text-gray-700 shadow-lg"
              >
                <button
                  onClick={() => { setOpen(false); navigate("/perfil"); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50"
                >
                  Perfil
                </button>
                <button
                  onClick={() => { setOpen(false); navigate("/ajustes"); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50"
                >
                  Ajustes
                </button>
                <div className="h-px bg-gray-200" />
                <button
                  onClick={() => { setOpen(false); navigate("/login"); }}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-red-600"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nav links móviles */}
        <div className="md:hidden pb-3">
          <ul className="flex items-center gap-5 text-white/90">
            {links.map((l) => (
              <li key={l.to} className="relative">
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `pb-1 text-sm transition ${isActive ? "text-white" : "hover:text-white"}`
                  }
                >
                  {({ isActive }) => (
                    <span className="relative">
                      {l.label}
                      <span
                        className={`block absolute left-0 right-0 -bottom-1 h-0.5 rounded-full transition-all ${
                          isActive ? "bg-white" : "bg-transparent"
                        }`}
                      />
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AuthNavbar;
