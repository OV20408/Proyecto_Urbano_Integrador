const API_BASE = "https://modelopredictivo.onrender.com";

// ============================================
// TIPOS DE DATOS
// ============================================

/**
 * Entrada de datos para realizar predicciones
 */
export interface PredictionInput {
    time: string; // ISO 8601 format: "2025-07-01T12:00:00"
    pm2_5?: number | null;
    pm10?: number | null;
    nitrogen_dioxide?: number | null;
    ozone?: number | null;
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    precipitation: number;
    surface_pressure: number;
}

/**
 * Respuesta de predicción para un horizonte específico (Estructura interna del dict)
 */
export interface PredictionValue {
    valor: number | null;
    tiempo_predicho: string | null;
    horas_horizonte?: number;
    error?: string;
}

/**
 * Respuesta de predicción completa (Ajustada a la API Python)
 */
export interface PredictionResponse {
    target: string;
    tiempo_entrada: string;
    predicciones: Record<string, PredictionValue>; // Ej: { "1h": { ... }, "12h": { ... } }
    unidad: string;
}

/**
 * Respuesta de clasificación de riesgo
 */
export interface RiskResponse {
    target: string;
    valor_predicho: number;
    nivel_riesgo: "Bajo" | "Medio" | "Alto";
    unidad: string;
    mensaje: string;
}

/**
 * Respuesta de métricas R2
 */
export interface R2Response {
    target: string;
    r2_promedio: number;
    cantidad_modelos: number;
}

/**
 * Nivel de ICA (1-6)
 */
export type ICALevel = 1 | 2 | 3 | 4 | 5 | 6;

/**
 * Targets disponibles para predicción
 */
export type PredictionTarget = "pm2_5" | "pm10" | "ozone" | "nitrogen_dioxide";

// ============================================
// FUNCIONES DE API
// ============================================

/**
 * Verifica el estado del servicio
 */
export async function healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Obtiene la lista de targets disponibles para predicción
 */
export async function getAvailableTargets(): Promise<{
    targets: string[];
    descripcion: string;
}> {
    const response = await fetch(`${API_BASE}/targets`);
    if (!response.ok) {
        throw new Error(`Error getting targets: ${response.statusText}`);
    }
    return response.json();
}

/**
 * Realiza predicción para un target específico
 * @param target - Contaminante a predecir (pm2_5, pm10, ozone, nitrogen_dioxide)
 * @param inputData - Lista de datos históricos (últimas 24h recomendadas)
 * @param horizons - Horizontes de predicción en horas (opcional, ej: "1,12,24")
 */
export async function predictTarget(
    target: PredictionTarget,
    inputData: PredictionInput[],
    horizons?: string
): Promise<PredictionResponse> {
    const url = new URL(`${API_BASE}/predict/${target}`);
    if (horizons) {
        url.searchParams.append("horizons", horizons);
    }

    try {
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(inputData),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            let errorDetail = response.statusText;
            try {
                const jsonError = JSON.parse(errorBody);
                errorDetail = jsonError.detail || JSON.stringify(jsonError);
            } catch (e) {
                errorDetail = errorBody;
            }
            throw new Error(`API Error (${response.status}): ${errorDetail}`);
        }

        return response.json();
    } catch (error: any) {
        console.error(`Error en predictTarget(${target}):`, error);
        throw new Error(error.message || "Error de conexión con la API");
    }
}

/**
 * Obtiene la predicción de PM2.5 para la hora solicitada
 * @param inputData - Datos históricos
 * @param hora - Hora a predecir (1, 12, 24, etc.)
 */
export async function getPM25Prediction(
    inputData: PredictionInput[],
    hora: number = 1
): Promise<number> {
    const response = await predictTarget("pm2_5", inputData, hora.toString());

    // La API devuelve claves como "1h", "12h"
    const key = `${hora}h`;
    const prediccion = response.predicciones[key];

    if (!prediccion || prediccion.valor === null) {
        throw new Error(`No se encontró predicción válida para el horizonte de ${hora} horas`);
    }

    return prediccion.valor;
}

/**
 * Obtiene la clasificación de riesgo para un target
 * @param target - Contaminante a evaluar
 * @param inputData - Datos históricos
 */
export async function predictRisk(
    target: PredictionTarget,
    inputData: PredictionInput[]
): Promise<RiskResponse> {
    const response = await fetch(`${API_BASE}/predict/${target}/risk`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(`Error predicting risk for ${target}: ${error.detail || response.statusText}`);
    }

    return response.json();
}

/**
 * Calcula el riesgo basado en el valor de PM2.5 (para cualquier horizonte)
 * Umbrales basados en la descripción del endpoint /risk
 */
export function calculateRisk(pm25Value: number): "Bajo" | "Medio" | "Alto" {
    if (pm25Value < 35) return "Bajo";
    if (pm25Value <= 55) return "Medio";
    return "Alto";
}

/**
 * Obtiene el nivel de riesgo para PM2.5
 * @param inputData - Datos históricos
 * @param useEndpoint - Si true, usa el endpoint /risk (solo 1h). Si false, calcula localmente.
 */
export async function getPM25Risk(
    inputData: PredictionInput[],
    useEndpoint: boolean = true
): Promise<"Bajo" | "Medio" | "Alto"> {
    if (useEndpoint) {
        const response = await predictRisk("pm2_5", inputData);
        return response.nivel_riesgo;
    } else {
        // Si no usamos el endpoint (ej. para horizontes > 1h), calculamos localmente
        const response = await predictRisk("pm2_5", inputData);
        return response.nivel_riesgo;
    }
}

/**
 * Obtiene el Índice de Calidad del Aire (ICA) predicho
 * Nota: El endpoint actual calcula el ICA para un horizonte de 1 hora.
 */
export async function getICA(inputData: PredictionInput[]): Promise<ICALevel> {
    const response = await fetch(`${API_BASE}/predict/ica`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(`Error getting ICA: ${error.detail || response.statusText}`);
    }

    const data = await response.json();
    return data as ICALevel;
}

/**
 * Obtiene el puntaje R2 promedio para un target (confianza del modelo)
 * @param target - Contaminante
 */
export async function getR2Score(target: PredictionTarget): Promise<number> {
    const response = await fetch(`${API_BASE}/metrics/${target}/r2`);

    if (!response.ok) {
        throw new Error(`Error getting R2 for ${target}: ${response.statusText}`);
    }

    const data: R2Response = await response.json();
    return data.r2_promedio;
}

/**
 * Obtiene el R2 de PM2.5 como porcentaje de confianza
 */
export async function getPM25Confidence(): Promise<number> {
    const r2 = await getR2Score("pm2_5");
    // Convertir R2 a porcentaje (R2 está entre 0 y 1)
    return Math.round(r2 * 100);
}

/**
 * Obtiene predicciones para 5 horizontes específicos (1, 12, 24, 72, 168 horas)
 * @param target - Contaminante a predecir
 * @param inputData - Datos históricos
 */
export async function predict5Horizons(
    target: PredictionTarget,
    inputData: PredictionInput[]
): Promise<PredictionResponse> { // Retorna la misma estructura que predictTarget
    const response = await fetch(`${API_BASE}/predict/${target}/5-horizons`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(`Error predicting 5 horizons for ${target}: ${error.detail || response.statusText}`);
    }

    return response.json();
}

/**
 * Obtiene los datos de tendencia de PM2.5 para graficar
 * @param inputData - Datos históricos
 * @returns Array de valores predichos para graficar
 */
export async function getPM25Trend(
    inputData: PredictionInput[]
): Promise<number[]> {
    const response = await predict5Horizons("pm2_5", inputData);

    // Convertir el diccionario a array ordenado por horas
    // Las claves son "1h", "12h", etc. Necesitamos extraer el número.
    const predictionsArray = Object.entries(response.predicciones)
        .map(([key, value]) => {
            const hours = parseInt(key.replace("h", ""), 10);
            return { hours, value: value.valor };
        })
        .sort((a, b) => a.hours - b.hours); // Ordenar por horizonte temporal (1, 12, 24...)

    // Retornar solo los valores (filtrando nulos si los hubiera)
    return predictionsArray
        .filter(p => p.value !== null)
        .map(p => p.value as number);
}

// ============================================
// FUNCIÓN COMPLETA PARA LA PANTALLA DE PREDICCIONES
// ============================================

/**
 * Obtiene todos los datos necesarios para una fila de predicción
 * @param inputData - Datos históricos
 * @param hora - Hora a predecir (1, 12, 24, etc.)
 */
export async function getPredictionData(
    inputData: PredictionInput[],
    hora: number = 1
) {
    // Ejecutar todas las peticiones en paralelo pero manejando errores individualmente
    // para que un fallo en métricas no bloquee la predicción principal.

    // 1. Predicción Principal (Crítica)
    let pm25 = 0;
    try {
        pm25 = await getPM25Prediction(inputData, hora);
    } catch (e: any) {
        console.error(`Error obteniendo predicción PM2.5 para ${hora}h:`, e);
        throw new Error(`Fallo al predecir PM2.5: ${e.message}`);
    }

    // 2. Datos Secundarios (No críticos, usar valores por defecto si fallan)
    const [confianza, tendencia, ica] = await Promise.all([
        getPM25Confidence().catch((e) => {
            console.warn("No se pudo obtener confianza (R2):", e);
            return 0; // Valor por defecto
        }),
        getPM25Trend(inputData).catch((e) => {
            console.warn("No se pudo obtener tendencia:", e);
            return []; // Valor por defecto
        }),
        getICA(inputData).catch((e) => {
            console.warn("No se pudo obtener ICA:", e);
            return 0; // Valor por defecto
        }),
    ]);

    // Calcular riesgo localmente para ser consistente con el valor predicho
    const riesgo = calculateRisk(pm25);

    return {
        pm25,
        riesgo,
        confianza,
        tendencia,
        ica,
    };
}

/**
 * Genera datos de entrada de ejemplo para pruebas
 */
export function generateSampleInput(): PredictionInput[] {
    const now = new Date();
    const data: PredictionInput[] = [];

    // Generar 24 horas de datos históricos
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        data.push({
            time: time.toISOString(),
            pm2_5: 15 + Math.random() * 10,
            pm10: 25 + Math.random() * 15,
            nitrogen_dioxide: 18 + Math.random() * 8,
            ozone: 40 + Math.random() * 20,
            temperature_2m: 20 + Math.random() * 10,
            relative_humidity_2m: 50 + Math.random() * 30,
            wind_speed_10m: 3 + Math.random() * 5,
            wind_direction_10m: Math.random() * 360,
            precipitation: Math.random() * 2,
            surface_pressure: 1010 + Math.random() * 10,
        });
    }

    return data;
}
