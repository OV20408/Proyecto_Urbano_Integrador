// src/hooks/useDashboardData.ts

import { useEffect, useState } from "react";
import {
  fetchMediciones,
  fetchRealtime,
  fetchZonas,
  fetchAlertas,
  fetchReglas,
} from "../../services/api";

import type {
  Medicion,
  RealtimeResponse,
  Zona,
  Alerta,
  Regla,
} from "../types/api";

export function useDashboardData(token: string) {
  const [loading, setLoading] = useState(true);

  const [mediciones, setMediciones] = useState<Medicion[]>([]);
  const [realtime, setRealtime] = useState<RealtimeResponse | null>(null);
  const [zonas, setZonas] = useState<Zona[]>([]);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [reglas, setReglas] = useState<Regla[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [med, rt, zn] = await Promise.all([
          fetchMediciones(200),
          fetchRealtime(),
          fetchZonas(),
        ]);

        setMediciones(med);
        setRealtime(rt);
        setZonas(zn);

        if (token) {
          const [al, rg] = await Promise.all([
            fetchAlertas(token),
            fetchReglas(token),
          ]);

          setAlertas(al);
          setReglas(rg);
        }
      } catch (err) {
        console.error("Error Dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [token]);

  // =============================
  // PROCESAMIENTO
  // =============================

  const ultimas10 = mediciones.slice(0, 10);

  const realtimeKpi =
    realtime?.datos?.[0]?.mediciones?.[0] ?? null;

  const pm25Trend = mediciones.slice(0, 24).map((m) => ({
    time: new Date(m.fecha_hora).getHours() + ":00",
    value: m.pm25,
  }));

  const alertasPorSeveridad = ["baja", "media", "alta", "critica"].map((sev) => ({
    severidad: sev,
    count: alertas.filter((a) => a.severidad?.toLowerCase() === sev).length,
  }));

  return {
    loading,
    mediciones,
    realtimeKpi,
    pm25Trend,
    ultimas10,
    zonas,
    alertas,
    alertasPorSeveridad,
    reglas,
  };
}
