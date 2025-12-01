# 📊 Guía Completa: Integración con Power BI Desktop

Esta guía te mostrará paso a paso cómo conectar tu API de Open-Meteo con Power BI Desktop para visualizar los datos de calidad del aire de Santa Cruz de la Sierra.

---

## 📋 Prerrequisitos

1. ✅ Power BI Desktop instalado (descarga gratuita desde [Microsoft Store](https://aka.ms/pbidesktopstore))
2. ✅ API corriendo en `http://localhost:3001`
3. ✅ Datos sincronizados de Open-Meteo (al menos una vez)

---

## PASO 1: Sincronizar Datos de Open-Meteo

Antes de conectar Power BI, necesitas tener datos en tu base de datos.

### 1.1 Verificar que el servidor está corriendo

Abre tu navegador y ve a:
```
http://localhost:3001/
```

Deberías ver:
```json
{
  "status": "OK",
  "message": "API Proyecto Urbano Integrador",
  "websocket": "ws://localhost:3001",
  "clients": 0
}
```

### 1.2 Verificar zonas activas

Ve a:
```
http://localhost:3001/api/zonas?activa=true
```

Deberías ver tus zonas configuradas con latitud y longitud.

### 1.3 Sincronizar datos de Open-Meteo

**Opción A: Con el navegador**
- Usa una extensión como "Advanced REST Client" o "Postman"
- Método: POST
- URL: `http://localhost:3001/api/open-meteo/sync`

**Opción B: Con PowerShell** (recomendado)
```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/open-meteo/sync" -Method POST
```

**Opción C: Con curl**
```bash
curl -X POST http://localhost:3001/api/open-meteo/sync
```

Espera unos segundos. Deberías ver una respuesta con el resumen de la sincronización.

### 1.4 Verificar que hay datos

Ve a:
```
http://localhost:3001/api/open-meteo/realtime
```

Deberías ver los últimos datos de todas las zonas.

---

## PASO 2: Abrir Power BI Desktop

1. Abre **Power BI Desktop** en tu computadora
2. Si ves la pantalla de bienvenida, ciérrala
3. Estarás en una hoja de trabajo en blanco

---

## PASO 3: Conectar a la API - Primera Fuente de Datos

### 3.1 Obtener datos de "Web"

1. En la cinta superior, haz clic en **"Inicio"** (Home)
2. Haz clic en **"Obtener datos"** (Get Data) o **"Get Data"**
3. En el cuadro de búsqueda, escribe: **"Web"**
4. Selecciona **"Web"** y haz clic en **"Conectar"**

### 3.2 Configurar la conexión - Datos en Tiempo Real

1. Selecciona la pestaña **"Básico"** (Basic)
2. En el campo URL, pega:
   ```
   http://localhost:3001/api/open-meteo/realtime
   ```
3. Haz clic en **"Aceptar"** (OK)

### 3.3 Transformar los datos

Power BI mostrará el Editor de Power Query. Ahora vamos a transformar el JSON:

1. Verás una columna llamada `List` o similar
2. Haz clic en el icono de **expandir** (dos flechas) junto al nombre de la columna
3. Selecciona:
   - ✅ `timestamp`
   - ✅ `total_zonas`
   - ✅ `zonas_con_datos`
   - ✅ `datos`
4. Desmarca "Usar nombre de columna original como prefijo"
5. Haz clic en **"Aceptar"**

### 3.4 Expandir los datos de las zonas

1. Encuentra la columna `datos` (es una lista de registros)
2. Haz clic en el icono de **expandir**
3. Verás dos campos:
   - ✅ `zona`
   - ✅ `mediciones`
4. Desmarca "Usar nombre de columna original como prefijo"
5. Haz clic en **"Aceptar"**

### 3.5 Expandir información de la zona

1. Encuentra la columna `zona` (es un registro)
2. Haz clic en el icono de **expandir**
3. Selecciona:
   - ✅ `zona_id`
   - ✅ `nombre`
   - ✅ `codigo`
   - ✅ `latitud`
   - ✅ `longitud`
4. Desmarca "Usar nombre de columna original como prefijo"
5. Haz clic en **"Aceptar"**

### 3.6 Expandir las mediciones

1. Encuentra la columna `mediciones` (es una lista)
2. Haz clic en el icono de **expandir**
3. Selecciona todos los campos:
   - ✅ `medicion_id`
   - ✅ `fecha_hora`
   - ✅ `pm25`
   - ✅ `pm10`
   - ✅ `no2`
   - ✅ `temperatura`
   - ✅ `humedad_relativa`
   - ✅ `precipitacion`
   - ✅ `presion_superficial`
   - ✅ `velocidad_viento`
   - ✅ `direccion_viento`
   - ✅ `fecha_creacion`
4. Desmarca "Usar nombre de columna original como prefijo"
5. Haz clic en **"Aceptar"**

### 3.7 Cambiar tipos de datos

Power BI intentará detectar automáticamente los tipos, pero verifica:

1. Haz clic derecho en `fecha_hora` → **"Cambiar tipo"** → **"Fecha/Hora"**
2. Haz clic derecho en `pm25` → **"Cambiar tipo"** → **"Número decimal"**
3. Haz clic derecho en `pm10` → **"Cambiar tipo"** → **"Número decimal"**
4. Haz clic derecho en `no2` → **"Cambiar tipo"** → **"Número decimal"**
5. Haz clic derecho en `temperatura` → **"Cambiar tipo"** → **"Número decimal"**
6. Haz clic derecho en `humedad_relativa` → **"Cambiar tipo"** → **"Número decimal"**
7. Haz clic derecho en `latitud` → **"Cambiar tipo"** → **"Número decimal"**
8. Haz clic derecho en `longitud` → **"Cambiar tipo"** → **"Número decimal"**

### 3.8 Renombrar la consulta

1. En el panel derecho, busca **"Propiedades"** o **"Configuración de consulta"**
2. En "Nombre", cambia a: **"DatosTiempoReal"**

### 3.9 Aplicar y cerrar

1. Haz clic en **"Cerrar y aplicar"** en la cinta superior
2. Power BI cargará los datos

---

## PASO 4: Agregar Segunda Fuente - Histórico de Zonas

Ahora vamos a agregar información histórica de cada zona.

### 4.1 Obtener datos de otra fuente Web

1. En la cinta **"Inicio"**, haz clic en **"Obtener datos"** → **"Web"**
2. En el campo URL, pega:
   ```
   http://localhost:3001/api/mediciones?limit=1000
   ```
3. Haz clic en **"Aceptar"**

### 4.2 Transformar los datos históricos

Similar al paso anterior, expande los campos necesarios.

### 4.3 Renombrar la consulta

Nómbrala: **"HistoricoMediciones"**

---

## PASO 5: Agregar Tercera Fuente - Catálogo de Zonas

### 5.1 Obtener datos de Zonas

1. **"Obtener datos"** → **"Web"**
2. URL:
   ```
   http://localhost:3001/api/zonas?activa=true
   ```
3. Expande los campos de la zona
4. Renombra la consulta a: **"Zonas"**

---

## PASO 6: Crear Relaciones entre Tablas

### 6.1 Abrir vista de modelo

1. En el panel izquierdo, haz clic en el icono de **"Modelo"** (tres tablas conectadas)

### 6.2 Crear relación entre DatosTiempoReal y Zonas

1. Arrastra el campo `zona_id` de **DatosTiempoReal** hacia el campo `zona_id` de **Zonas**
2. Configurar:
   - Cardinalidad: **Muchos a uno (*:1)**
   - Dirección del filtro cruzado: **Única**

### 6.3 Crear relación entre HistoricoMediciones y Zonas

1. Arrastra el campo `zona_id` de **HistoricoMediciones** hacia el campo `zona_id` de **Zonas**
2. Misma configuración que antes

---

## PASO 7: Crear Visualizaciones

Ahora vamos a crear dashboards interactivos.

### 7.1 Vista de Informe

1. Haz clic en el icono de **"Informe"** en el panel izquierdo (primer icono)

### 7.2 Crear un mapa de calor

1. En el panel **"Visualizaciones"**, selecciona el icono de **"Mapa"** (globo terráqueo)
2. Arrastra los campos:
   - **Ubicación**: `nombre` (de Zonas)
   - **Latitud**: `latitud` (de Zonas)
   - **Longitud**: `longitud` (de Zonas)
   - **Tamaño**: `pm25` (de DatosTiempoReal)
   - **Colores**: `pm25` (de DatosTiempoReal)

### 7.3 Crear gráfico de líneas - PM2.5 en el tiempo

1. Agrega una nueva visualización: **"Gráfico de líneas"**
2. Arrastra los campos:
   - **Eje X**: `fecha_hora` (de DatosTiempoReal o HistoricoMediciones)
   - **Eje Y**: `pm25`
   - **Leyenda**: `nombre` (de Zonas)

### 7.4 Crear tarjetas de indicadores

1. Agrega una visualización: **"Tarjeta"** (card)
2. Arrastra: `pm25` (promedio)
3. Duplica la tarjeta para `pm10` y `no2`

### 7.5 Crear tabla de datos

1. Agrega una visualización: **"Tabla"**
2. Arrastra los campos:
   - `nombre` (Zonas)
   - `pm25` (DatosTiempoReal)
   - `pm10` (DatosTiempoReal)
   - `no2` (DatosTiempoReal)
   - `temperatura` (DatosTiempoReal)
   - `fecha_hora` (DatosTiempoReal)

### 7.6 Crear gráfico de barras - Comparación de zonas

1. Agrega una visualización: **"Gráfico de barras apiladas"**
2. Arrastra los campos:
   - **Eje Y**: `nombre` (de Zonas)
   - **Eje X**: `pm25` (promedio de DatosTiempoReal)

---

## PASO 8: Actualizar Datos

### 8.1 Actualización manual

Para actualizar los datos:
1. En la cinta **"Inicio"**, haz clic en **"Actualizar"**
2. Power BI volverá a consultar todos los endpoints

### 8.2 Configurar actualización automática (Power BI Desktop)

1. Ve a **"Archivo"** → **"Opciones y configuración"** → **"Opciones"**
2. En **"Archivo actual"** → **"Actualización de datos"**
3. Configura el intervalo de actualización

### 8.3 Actualización automática (Power BI Service - Web)

Si publicas el informe en Power BI Service:
1. Necesitarás configurar un **Gateway** de datos local
2. O hacer tu API accesible públicamente (con autenticación)

---

## PASO 9: Publicar a Power BI Service (Opcional)

### 9.1 Iniciar sesión

1. En Power BI Desktop, haz clic en **"Iniciar sesión"** (esquina superior derecha)
2. Ingresa tus credenciales de Microsoft

### 9.2 Publicar

1. En la cinta **"Inicio"**, haz clic en **"Publicar"**
2. Selecciona tu workspace
3. Haz clic en **"Seleccionar"**

### 9.3 Configurar actualización en Power BI Service

Nota: Para que funcione, tu API debe ser accesible desde internet o configurar un Gateway.

---

## 📊 Visualizaciones Recomendadas

### Dashboard 1: Vista General
- 🗺️ Mapa de calor con ubicaciones de zonas
- 📊 Tarjetas con promedios de PM2.5, PM10, NO2
- 📈 Gráfico de líneas con tendencia temporal
- 🌡️ Tarjetas con temperatura y humedad promedio

### Dashboard 2: Análisis por Zona
- 📊 Tabla detallada de todas las zonas
- 📈 Gráficos de barras comparativos
- 🎯 Filtros por zona y fecha

### Dashboard 3: Calidad del Aire
- 🚦 Indicadores de nivel de riesgo (usando medidas calculadas)
- 📊 Histograma de distribución de PM2.5
- 📈 Evolución temporal por contaminante

---

## 🔄 Ejemplo de Código M (Power Query) - Referencia

Si quieres ver o editar el código M generado:

1. En Power Query Editor, ve a **"Vista"** → **"Editor avanzado"**

Ejemplo para el endpoint de tiempo real:

```m
let
    Origen = Json.Document(Web.Contents("http://localhost:3001/api/open-meteo/realtime")),
    datos = Origen[datos],
    #"Convertido en tabla" = Table.FromList(datos, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    #"Se expandió Column1" = Table.ExpandRecordColumn(#"Convertido en tabla", "Column1", {"zona", "mediciones"}, {"zona", "mediciones"}),
    #"Se expandió zona" = Table.ExpandRecordColumn(#"Se expandió Column1", "zona", {"zona_id", "nombre", "codigo", "latitud", "longitud"}, {"zona_id", "nombre", "codigo", "latitud", "longitud"}),
    #"Se expandió mediciones" = Table.ExpandListColumn(#"Se expandió zona", "mediciones"),
    #"Se expandió mediciones1" = Table.ExpandRecordColumn(#"Se expandió mediciones", "mediciones", {"medicion_id", "fecha_hora", "pm25", "pm10", "no2", "temperatura", "humedad_relativa", "precipitacion", "presion_superficial", "velocidad_viento", "direccion_viento"}, {"medicion_id", "fecha_hora", "pm25", "pm10", "no2", "temperatura", "humedad_relativa", "precipitacion", "presion_superficial", "velocidad_viento", "direccion_viento"}),
    #"Tipo cambiado" = Table.TransformColumnTypes(#"Se expandió mediciones1",{{"fecha_hora", type datetime}, {"pm25", type number}, {"pm10", type number}, {"no2", type number}, {"temperatura", type number}, {"humedad_relativa", type number}})
in
    #"Tipo cambiado"
```

---

## 🎨 Crear Medidas Calculadas (DAX)

Para crear indicadores personalizados:

### Medida 1: Promedio PM2.5

1. En el panel **"Campos"**, haz clic derecho en **DatosTiempoReal**
2. Selecciona **"Nueva medida"**
3. Escribe:
```dax
PromedioPM25 = AVERAGE(DatosTiempoReal[pm25])
```

### Medida 2: Nivel de Riesgo PM2.5

```dax
RiesgoPM25 = 
SWITCH(
    TRUE(),
    [PromedioP M25] <= 12, "Bueno",
    [PromedioP M25] <= 35.4, "Moderado",
    [PromedioP M25] <= 55.4, "Insalubre para grupos sensibles",
    [PromedioP M25] <= 150.4, "Insalubre",
    [PromedioP M25] <= 250.4, "Muy Insalubre",
    "Peligroso"
)
```

### Medida 3: Color de Riesgo

```dax
ColorRiesgo = 
SWITCH(
    [RiesgoPM25],
    "Bueno", "#00E400",
    "Moderado", "#FFFF00",
    "Insalubre para grupos sensibles", "#FF7E00",
    "Insalubre", "#FF0000",
    "Muy Insalubre", "#8F3F97",
    "Peligroso", "#7E0023",
    "#CCCCCC"
)
```

---

## 🔧 Solución de Problemas

### Error: "No se puede conectar"
- ✅ Verifica que el servidor esté corriendo en `http://localhost:3001`
- ✅ Verifica que no haya firewall bloqueando

### Error: "No hay datos"
- ✅ Ejecuta la sincronización: `POST http://localhost:3001/api/open-meteo/sync`
- ✅ Verifica que las zonas tengan coordenadas

### Los datos no se actualizan
- ✅ Haz clic en "Actualizar" en Power BI Desktop
- ✅ Verifica que la API esté retornando datos nuevos

### Error en la transformación de datos
- ✅ Revisa el Editor de Power Query
- ✅ Verifica que la estructura del JSON sea la esperada

---

## 📚 Recursos Adicionales

- [Documentación de Power BI](https://docs.microsoft.com/power-bi/)
- [Fórmulas DAX](https://dax.guide/)
- [Power Query M](https://docs.microsoft.com/powerquery-m/)

---

## 🎯 Resumen Rápido

1. ✅ Sincroniza datos de Open-Meteo: `POST /api/open-meteo/sync`
2. ✅ Abre Power BI Desktop
3. ✅ Obtener datos → Web → `http://localhost:3001/api/open-meteo/realtime`
4. ✅ Expande las columnas JSON
5. ✅ Cambia tipos de datos
6. ✅ Cerrar y aplicar
7. ✅ Crea visualizaciones arrastrando campos
8. ✅ Actualiza con el botón "Actualizar"

---

## 📞 ¿Necesitas Ayuda?

Si tienes problemas:
1. Verifica los logs de la consola del servidor
2. Prueba los endpoints en el navegador
3. Revisa los pasos de transformación en Power Query

¡Listo! Ahora tienes un dashboard completo de calidad del aire en Power BI 🎉
