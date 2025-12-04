// src/types/api.ts

export interface Medicion {
  medicion_id: number;
  zona_id: number;
  fecha_hora: string;
  pm25: number | null;
  pm10: number | null;
  no2: number | null;
  temperatura: number | null;
  humedad_relativa: number | null;
  precipitacion: number | null;
  presion_superficial: number | null;
  velocidad_viento: number | null;
  direccion_viento: number | null;
}

export interface RealtimeZona {
  zona: {
    zona_id: number;
    nombre: string;
    codigo: string;
    latitud: number;
    longitud: number;
  };
  mediciones: Medicion[];
}

export interface RealtimeResponse {
  timestamp: string;
  datos: RealtimeZona[];
}

export interface Alerta {
  alerta_id: number;
  titulo: string;
  mensaje: string;
  severidad: string;
  fecha_creacion: string;
  zona?: { nombre: string };
}

export interface Regla {
  regla_id: number;
  nombre: string;
  metrica: string;
  umbral: number;
  severidad: string;
}

export interface Zona {
  zona_id: number;
  nombre: string;
  codigo: string;
  latitud: number;
  longitud: number;
}
