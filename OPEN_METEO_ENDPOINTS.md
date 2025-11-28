# Endpoints de Open-Meteo - Documentación

## Descripción

Estos endpoints permiten obtener datos de las APIs de Open-Meteo, guardarlos en la base de datos y consultarlos en tiempo real. Si la API de Open-Meteo está caída, los endpoints de tiempo real mostrarán los últimos datos guardados.

---

## Endpoints de Sincronización

### POST /api/open-meteo/sync
Obtiene datos de Open-Meteo para **todas las zonas activas** y los guarda en la base de datos.

- **Autenticación:** Requerida (Bearer Token)
- **Método:** POST
- **Body:** No requiere body

**Respuesta exitosa:**
```json
{
  "message": "Sincronización completada",
  "total_zonas": 8,
  "exitosas": 7,
  "errores": 1,
  "resultados": [
    {
      "zona_id": 1,
      "nombre": "Centro",
      "mediciones_procesadas": 168,
      "mediciones_guardadas": 168,
      "mediciones_actualizadas": 0,
      "success": true
    }
  ],
  "errores_detalle": [
    {
      "zona_id": 2,
      "nombre": "Norte",
      "error": "Error al obtener datos: timeout"
    }
  ]
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3001/api/open-meteo/sync \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### POST /api/open-meteo/sync/:zona_id
Obtiene datos de Open-Meteo para una **zona específica** y los guarda en la base de datos.

- **Autenticación:** Requerida (Bearer Token)
- **Método:** POST
- **Parámetros:** `zona_id` (ID de la zona)

**Respuesta exitosa:**
```json
{
  "message": "Datos sincronizados correctamente",
  "zona": {
    "zona_id": 1,
    "nombre": "Centro"
  },
  "mediciones_procesadas": 168,
  "mediciones_nuevas": 150,
  "mediciones_actualizadas": 18
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3001/api/open-meteo/sync/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Endpoints de Tiempo Real

### GET /api/open-meteo/realtime
Obtiene los **últimos datos guardados** de todas las zonas activas. Si la API de Open-Meteo está caída, muestra los datos guardados previamente.

- **Autenticación:** Opcional
- **Método:** GET
- **Query params:** 
  - `limit` (opcional, default: 1) - Número de mediciones por zona

**Respuesta:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "total_zonas": 8,
  "zonas_con_datos": 7,
  "datos": [
    {
      "zona": {
        "zona_id": 1,
        "nombre": "Centro",
        "codigo": "CENTRO",
        "latitud": "-17.8146",
        "longitud": "-63.1561"
      },
      "mediciones": [
        {
          "medicion_id": 1234,
          "fecha_hora": "2024-01-15T10:00:00.000Z",
          "pm25": 25.5,
          "pm10": 45.2,
          "no2": 30.1,
          "temperatura": 28.5,
          "humedad_relativa": 65.0,
          "precipitacion": 0.0,
          "presion_superficial": 1013.25,
          "velocidad_viento": 5.2,
          "direccion_viento": 180,
          "fecha_creacion": "2024-01-15T10:05:00.000Z"
        }
      ]
    }
  ]
}
```

**Ejemplo con curl:**
```bash
# Obtener última medición de cada zona
curl http://localhost:3001/api/open-meteo/realtime

# Obtener últimas 3 mediciones de cada zona
curl http://localhost:3001/api/open-meteo/realtime?limit=3
```

---

### GET /api/open-meteo/realtime/:zona_id
Obtiene los **últimos datos guardados** de una zona específica.

- **Autenticación:** Opcional
- **Método:** GET
- **Parámetros:** `zona_id` (ID de la zona)
- **Query params:** 
  - `limit` (opcional, default: 24) - Número de mediciones a retornar

**Respuesta:**
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "zona": {
    "zona_id": 1,
    "nombre": "Centro",
    "codigo": "CENTRO",
    "latitud": "-17.8146",
    "longitud": "-63.1561"
  },
  "ultima_medicion": {
    "medicion_id": 1234,
    "fecha_hora": "2024-01-15T10:00:00.000Z",
    "pm25": 25.5,
    "pm10": 45.2,
    "no2": 30.1,
    "temperatura": 28.5,
    "humedad_relativa": 65.0,
    "precipitacion": 0.0,
    "presion_superficial": 1013.25,
    "velocidad_viento": 5.2,
    "direccion_viento": 180,
    "fecha_creacion": "2024-01-15T10:05:00.000Z"
  },
  "historial": [
    {
      "medicion_id": 1234,
      "fecha_hora": "2024-01-15T10:00:00.000Z",
      "pm25": 25.5,
      "pm10": 45.2,
      "no2": 30.1,
      "temperatura": 28.5,
      "humedad_relativa": 65.0,
      "precipitacion": 0.0,
      "presion_superficial": 1013.25,
      "velocidad_viento": 5.2,
      "direccion_viento": 180
    }
  ],
  "total_mediciones": 24
}
```

**Ejemplo con curl:**
```bash
# Obtener últimas 24 mediciones (default)
curl http://localhost:3001/api/open-meteo/realtime/1

# Obtener últimas 48 mediciones
curl http://localhost:3001/api/open-meteo/realtime/1?limit=48
```

---

## Flujo de Trabajo Recomendado

### 1. Configurar Zonas
Asegúrate de que todas las zonas de Santa Cruz estén configuradas con sus coordenadas (latitud, longitud) y estén activas.

### 2. Sincronizar Datos Periódicamente
Configura un cron job o tarea programada para llamar a `/api/open-meteo/sync` cada hora (o según necesites):

```bash
# Ejemplo con cron (cada hora)
0 * * * * curl -X POST http://localhost:3001/api/open-meteo/sync -H "Authorization: Bearer YOUR_TOKEN"
```

### 3. Consultar Datos en Tiempo Real
Usa los endpoints `/api/open-meteo/realtime` para obtener los últimos datos guardados. Estos endpoints funcionan incluso si la API de Open-Meteo está caída, mostrando los últimos datos guardados.

---

## Datos Obtenidos de Open-Meteo

### Calidad del Aire (Air Quality API)
- **PM10** (Particulate Matter PM10) - μg/m³
- **PM2.5** (Particulate Matter PM2.5) - μg/m³
- **NO2** (Nitrogen Dioxide) - μg/m³

### Pronóstico del Tiempo (Forecast API)
- **Temperature (2m)** - °C
- **Relative Humidity (2m)** - %
- **Precipitation** (rain + snow) - mm
- **Surface Pressure** - hPa
- **Wind Speed (10m)** - m/s
- **Wind Direction (10m)** - grados (0-360)

---

## Manejo de Errores

### Si Open-Meteo está caída:
- Los endpoints de sincronización retornarán un error
- Los endpoints de tiempo real seguirán funcionando, mostrando los últimos datos guardados
- No se perderán datos históricos

### Si una zona no tiene coordenadas:
- Se retornará un error específico para esa zona
- Las demás zonas se procesarán normalmente

### Si hay datos duplicados:
- El sistema detecta automáticamente mediciones duplicadas (misma zona y fecha/hora)
- Las mediciones existentes se actualizan en lugar de crear duplicados

---

## Notas Importantes

1. **Zona horaria:** Los datos se obtienen con zona horaria `America/La_Paz` (Bolivia)

2. **Frecuencia de sincronización:** Open-Meteo proporciona datos horarios. Se recomienda sincronizar cada hora.

3. **Datos históricos:** Los datos se guardan con su fecha/hora original, permitiendo mantener un historial completo.

4. **Rendimiento:** Para muchas zonas, la sincronización puede tardar varios segundos. Se recomienda ejecutarla en segundo plano.

5. **Autenticación:** Los endpoints de sincronización requieren autenticación para evitar llamadas no autorizadas que consuman recursos.



