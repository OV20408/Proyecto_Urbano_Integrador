const API_BASE = "https://modelopredictivo.onrender.com";

// ============================================
// TIPOS DE DATOS
// ============================================

export interface PredictionInput {
    time: string;
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

export interface PredictionValue {
    valor: number | null;
    tiempo_predicho: string | null;
    horas_horizonte?: number;
    error?: string;
}

export interface PredictionResponse {
    target: string;
    tiempo_entrada: string;
    predicciones: Record<string, PredictionValue>;
    unidad: string;
}

export interface RiskResponse {
    target: string;
    valor_predicho: number;
    nivel_riesgo: "Bajo" | "Medio" | "Alto";
    unidad: string;
    mensaje: string;
}

export interface R2Response {
    target: string;
    r2_promedio: number;
    cantidad_modelos: number;
}

export type ICALevel = 1 | 2 | 3 | 4 | 5 | 6;

export type PredictionTarget = "pm2_5" | "pm10" | "ozone" | "nitrogen_dioxide";

// ============================================
// LÓGICA LOCAL (FALLBACKS)
// ============================================

/**
 * Calcula el ICA para un contaminante específico según la Orden TEC/351/2019.
 * (Réplica de la lógica del backend para fallback local)
 */
function calculateICALocal(pollutant: string, value: number): ICALevel {
    const thresholds: Record<string, number[]> = {
        "pm2_5": [10, 20, 25, 50, 75],
        "pm10": [20, 40, 50, 100, 150],
        "ozone": [50, 100, 130, 240, 380],
        "nitrogen_dioxide": [40, 90, 120, 230, 340]
    };

    const limits = thresholds[pollutant];
    if (!limits) return 1;

    for (let i = 0; i < limits.length; i++) {
        if (value < limits[i]) {
            return (i + 1) as ICALevel;
        }
    }
    return 6;
}

// ============================================
// FUNCIONES DE API
// ============================================

export async function healthCheck(): Promise<{ status: string }> {
    const response = await fetch(`${API_BASE}/health`);
    if (!response.ok) throw new Error(`Health check failed: ${response.statusText}`);
    return response.json();
}

export async function getAvailableTargets(): Promise<{ targets: string[]; descripcion: string }> {
    const response = await fetch(`${API_BASE}/targets`);
    if (!response.ok) throw new Error(`Error getting targets: ${response.statusText}`);
    return response.json();
}

export async function predictTarget(
    target: PredictionTarget,
    inputData: PredictionInput[],
    horizons?: string
): Promise<PredictionResponse> {
    const url = new URL(`${API_BASE}/predict/${target}`);
    if (horizons) url.searchParams.append("horizons", horizons);

    try {
        const response = await fetch(url.toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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

export async function getPM25Prediction(inputData: PredictionInput[], hora: number = 1): Promise<number> {
    const response = await predictTarget("pm2_5", inputData, hora.toString());
    const key = `${hora}h`;
    const prediccion = response.predicciones[key];

    if (!prediccion || prediccion.valor === null) {
        throw new Error(`No se encontró predicción válida para el horizonte de ${hora} horas`);
    }
    return prediccion.valor;
}

export async function predictRisk(target: PredictionTarget, inputData: PredictionInput[]): Promise<RiskResponse> {
    const response = await fetch(`${API_BASE}/predict/${target}/risk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
    });
    if (!response.ok) throw new Error(`Error predicting risk`);
    return response.json();
}

export function calculateRisk(pm25Value: number): "Bajo" | "Medio" | "Alto" {
    if (pm25Value < 35) return "Bajo";
    if (pm25Value <= 55) return "Medio";
    return "Alto";
}

export async function getPM25Risk(inputData: PredictionInput[], useEndpoint: boolean = true): Promise<"Bajo" | "Medio" | "Alto"> {
    if (useEndpoint) {
        const response = await predictRisk("pm2_5", inputData);
        return response.nivel_riesgo;
    } else {
        const response = await predictRisk("pm2_5", inputData);
        return response.nivel_riesgo;
    }
}

/**
 * Obtiene el ICA estimado para un horizonte específico.
 * Intenta usar el endpoint del backend, si falla, calcula localmente.
 */
export async function getEstimatedICA(
    target: PredictionTarget,
    inputData: PredictionInput[],
    horizon: number,
    predictedValue: number
): Promise<ICALevel> {
    // 1. Intentar llamar al nuevo endpoint del backend
    try {
        const url = new URL(`${API_BASE}/predict/${target}/ica/estimated`);
        url.searchParams.append("horizons", horizon.toString());

        const response = await fetch(url.toString(), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inputData),
        });

        if (response.ok) {
            const ica = await response.json();
            return ica as ICALevel;
        }
    } catch (e) {
        // Ignorar error de red/404 y pasar al fallback
        console.warn("Endpoint de ICA estimado no disponible, calculando localmente...");
    }

    // 2. Fallback: Cálculo Local
    // Usamos el valor predicho del target y los últimos valores conocidos de los otros
    const lastData = inputData[inputData.length - 1];
    const icaValues: number[] = [];

    // ICA del target predicho
    icaValues.push(calculateICALocal(target, predictedValue));

    // ICA de los otros contaminantes (valores actuales)
    if (target !== "pm2_5" && lastData.pm2_5 != null) icaValues.push(calculateICALocal("pm2_5", lastData.pm2_5));
    if (target !== "pm10" && lastData.pm10 != null) icaValues.push(calculateICALocal("pm10", lastData.pm10));
    if (target !== "nitrogen_dioxide" && lastData.nitrogen_dioxide != null) icaValues.push(calculateICALocal("nitrogen_dioxide", lastData.nitrogen_dioxide));
    if (target !== "ozone" && lastData.ozone != null) icaValues.push(calculateICALocal("ozone", lastData.ozone));

    return (Math.max(...icaValues) || 1) as ICALevel;
}

export async function getR2Score(target: PredictionTarget): Promise<number> {
    const response = await fetch(`${API_BASE}/metrics/${target}/r2`);
    if (!response.ok) throw new Error(`Error getting R2`);
    const data: R2Response = await response.json();
    return data.r2_promedio;
}

export async function getPM25Confidence(): Promise<number> {
    const r2 = await getR2Score("pm2_5");
    return Math.round(r2 * 100);
}

export async function predict5Horizons(target: PredictionTarget, inputData: PredictionInput[]): Promise<PredictionResponse> {
    const response = await fetch(`${API_BASE}/predict/${target}/5-horizons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputData),
    });
    if (!response.ok) throw new Error(`Error predicting 5 horizons`);
    return response.json();
}

export async function getPM25Trend(inputData: PredictionInput[]): Promise<number[]> {
    const response = await predict5Horizons("pm2_5", inputData);
    const predictionsArray = Object.entries(response.predicciones)
        .map(([key, value]) => {
            const hours = parseInt(key.replace("h", ""), 10);
            return { hours, value: value.valor };
        })
        .sort((a, b) => a.hours - b.hours);
    return predictionsArray.filter(p => p.value !== null).map(p => p.value as number);
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

export async function getPredictionData(inputData: PredictionInput[], hora: number = 1) {
    // 1. Predicción Principal (Crítica)
    let pm25 = 0;
    try {
        pm25 = await getPM25Prediction(inputData, hora);
    } catch (e: any) {
        console.error(`Error obteniendo predicción PM2.5 para ${hora}h:`, e);
        throw new Error(`Fallo al predecir PM2.5: ${e.message}`);
    }

    // 2. Datos Secundarios
    const [confianza, tendencia] = await Promise.all([
        getPM25Confidence().catch(() => 0),
        getPM25Trend(inputData).catch(() => []),
    ]);

    // 3. Calcular Riesgo e ICA (usando el valor predicho)
    const riesgo = calculateRisk(pm25);

    // Usamos la nueva función que intenta el endpoint o calcula localmente
    const ica = await getEstimatedICA("pm2_5", inputData, hora, pm25);

    return {
        pm25,
        riesgo,
        confianza,
        tendencia,
        ica,
    };
}

export function generateSampleInput(): PredictionInput[] {
    const now = new Date();
    const data: PredictionInput[] = [];
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
