import img1 from "../assets/hero-img1.webp";
import img2 from "../assets/hero-img2.webp";

export default function Footer() {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Mock: aquí luego conectarías tu endpoint / n8n
    alert("Gracias por suscribirte. Te enviaremos novedades de PAUP.");
  };

  const grad = "linear-gradient(90deg, #f39a2e 0%, #f07a09 100%)";

  const SocialIcon = ({
    label,
    href,
    path,
  }: {
    label: string;
    href: string;
    path: string;
  }) => (
    <a
      aria-label={label}
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center justify-center w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10 transition"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" className="opacity-80 group-hover:opacity-100">
        <path d={path} fill="url(#g)" />
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="24" y2="24">
            <stop stopColor="#f39a2e" />
            <stop offset="1" stopColor="#f07a09" />
          </linearGradient>
        </defs>
      </svg>
    </a>
  );

  return (
    <footer id="footer" className="bg-slate-900 text-white">
      {/* Top: Suscripción */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <a href="/" className="flex items-center gap-3">
              <span
                className="inline-block w-9 h-9 rounded-lg"
                style={{ background: grad }}
                aria-hidden
              />
              <span className="font-semibold tracking-wide">PAUP • Plataforma Ambiental Urbana Predictiva</span>
            </a>

            <div className="flex-1 md:flex-none">
              <div className="grid md:grid-cols-[1fr,auto] items-center gap-5">
                <div>
                  <p className="text-orange-300 text-xs font-semibold tracking-wider">SUSCRÍBETE</p>
                  <h3 className="text-xl font-bold">Recibe novedades y alertas (demo)</h3>
                </div>
                <form onSubmit={handleSubscribe} className="flex">
                  <input
                    type="email"
                    placeholder="Tu email"
                    required
                    className="px-4 h-12 rounded-l-lg w-full text-slate-900 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-5 h-12 rounded-r-lg font-semibold"
                    style={{ background: grad }}
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="h-1" style={{ background: grad }} />
      </div>

      {/* Center */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold">Contacto</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>
                <span className="text-white">Ubicación:</span> Santa Cruz de la Sierra, Bolivia
              </li>
              <li>
                <span className="text-white">Tel:</span>{" "}
                <a href="tel:+59170000000" className="hover:underline">
                  +591 700 00 000
                </a>
              </li>
              <li>
                <span className="text-white">Web:</span>{" "}
                <a href="/" className="hover:underline">
                  paup.demo
                </a>
              </li>
              <li>
                <span className="text-white">Email:</span>{" "}
                <a href="mailto:contacto@paup.demo" className="hover:underline">
                  contacto@paup.demo
                </a>
              </li>
              <li className="pt-3 flex gap-3">
                <SocialIcon
                  label="Facebook"
                  href="#"
                  path="M15 3h-3a5 5 0 0 0-5 5v3H5v4h2v6h4v-6h3l1-4h-4V8a1 1 0 0 1 1-1h3V3z"
                />
                <SocialIcon
                  label="X"
                  href="#"
                  path="M4 4l7 7-7 9h3l5-6 5 6h3l-7-9 7-7h-3l-5 5-5-5H4z"
                />
                <SocialIcon
                  label="Instagram"
                  href="#"
                  path="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
                />
                <SocialIcon
                  label="LinkedIn"
                  href="#"
                  path="M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM3 8h3v13H3V8zm6 0h3v2h.1c.5-.9 1.8-2.1 3.9-2.1 4.2 0 5 2.8 5 6.4V21h-3v-6.3c0-1.5 0-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V21h-3V8z"
                />
              </li>
            </ul>
          </div>

          {/* Actualizaciones */}
          <div>
            <h3 className="text-lg font-semibold">Últimas actualizaciones</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex gap-3">
                <a href="#" className="shrink-0">
                  <img src={img1} className="w-16 h-16 object-cover rounded" alt="Actualización 1" />
                </a>
                <div>
                  <a href="#" className="hover:underline">
                    Tablero ciudadano (demo) con pronóstico 24–72 h
                  </a>
                  <div className="text-xs text-slate-400">12 marzo, 2025</div>
                </div>
              </li>
              <li className="flex gap-3">
                <a href="#" className="shrink-0">
                  <img src={img2} className="w-16 h-16 object-cover rounded" alt="Actualización 2" />
                </a>
                <div>
                  <a href="#" className="hover:underline">
                    Motor de alertas parametrizable por zona
                  </a>
                  <div className="text-xs text-slate-400">05 marzo, 2025</div>
                </div>
              </li>
            </ul>
          </div>

          {/* Servicios (en línea con tu sitio) */}
          <div>
            <h3 className="text-lg font-semibold">Servicios</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>
                <a href="#services" className="hover:underline">
                  Panel ciudadano y mapas
                </a>
              </li>
              <li>
                <a href="#services" className="hover:underline">
                  Panel para autoridades
                </a>
              </li>
              <li>
                <a href="#services" className="hover:underline">
                  Motor de alertas y reportes
                </a>
              </li>
              <li>
                <a href="#services" className="hover:underline">
                  Integración con dashboards (Power BI)
                </a>
              </li>
            </ul>
          </div>

          {/* Navegación rápida */}
          <div>
            <h3 className="text-lg font-semibold">Navegación</h3>
            <ul className="mt-4 space-y-2 text-slate-300">
              <li>
                <a href="#about" className="hover:underline">
                  Sobre el proyecto
                </a>
              </li>
              <li>
                <a href="#services" className="hover:underline">
                  Servicios
                </a>
              </li>
              <li>
                <a href="/login" className="hover:underline">
                  Acceso
                </a>
              </li>
              <li>
                <a href="/registro" className="hover:underline">
                  Registro
                </a>
              </li>
              <li>
                <a href="#footer" className="hover:underline">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Política de privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} PAUP — Plataforma Ambiental Urbana Predictiva. Todos los derechos
            reservados.
          </p>
          <ul className="flex items-center gap-6 text-sm">
            <li>
              <a href="#" className="hover:underline">
                Términos
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Privacidad
              </a>
            </li>
            <li>
              <a href="#footer" className="hover:underline">
                Contacto
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
