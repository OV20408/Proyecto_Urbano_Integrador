const API = "https://proyect-meos.onrender.com";

export async function fetchMediciones(limit = 200) {
  const res = await fetch(`${API}/api/mediciones?limit=${limit}`);
  return res.json();
}

export async function fetchRealtime() {
  const res = await fetch(`${API}/api/open-meteo/realtime`);
  return res.json();
}

export async function fetchZonas() {
  const res = await fetch(`${API}/api/zonas?activa=true`);
  return res.json();
}

export async function fetchAlertas(token: string) {
  const res = await fetch(`${API}/api/alertas?limit=50`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function fetchReglas(token: string) {
  const res = await fetch(`${API}/api/reglas-alertas?activa=true`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
