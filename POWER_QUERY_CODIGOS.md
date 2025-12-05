# 📊 Código M de Power Query - Ejemplos Completos

Este archivo contiene el código M (lenguaje de Power Query) para cada consulta. Puedes copiar y pegar estos códigos en el Editor Avanzado de Power Query.

---

## 🔹 Consulta 1: Datos en Tiempo Real

**Nombre de la consulta:** `DatosTiempoReal`

**Descripción:** Obtiene los últimos datos de todas las zonas activas.

**URL:** `http://localhost:3001/api/open-meteo/realtime?limit=1`

```m
let
    // 1. Obtener datos del endpoint
    Origen = Json.Document(Web.Contents("http://localhost:3001/api/open-meteo/realtime?limit=1")),
    
    // 2. Extraer la lista de datos
    datos = Origen[datos],
    
    // 3. Convertir lista en tabla
    ConvertidoEnTabla = Table.FromList(datos, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    
    // 4. Expandir la columna (contiene registros)
    ExpandirColumn1 = Table.ExpandRecordColumn(ConvertidoEnTabla, "Column1", {"zona", "mediciones"}, {"zona", "mediciones"}),
    
    // 5. Expandir información de la zona
    ExpandirZona = Table.ExpandRecordColumn(
        ExpandirColumn1, 
        "zona", 
        {"zona_id", "nombre", "codigo", "latitud", "longitud"}, 
        {"zona_id", "nombre", "codigo", "latitud", "longitud"}
    ),
    
    // 6. Expandir lista de mediciones
    ExpandirMediciones = Table.ExpandListColumn(ExpandirZona, "mediciones"),
    
    // 7. Expandir campos de cada medición
    ExpandirCamposMedicion = Table.ExpandRecordColumn(
        ExpandirMediciones, 
        "mediciones", 
        {
            "medicion_id", 
            "fecha_hora", 
            "pm25", 
            "pm10", 
            "no2", 
            "temperatura", 
            "humedad_relativa", 
            "precipitacion", 
            "presion_superficial", 
            "velocidad_viento", 
            "direccion_viento",
            "fecha_creacion"
        }, 
        {
            "medicion_id", 
            "fecha_hora", 
            "pm25", 
            "pm10", 
            "no2", 
            "temperatura", 
            "humedad_relativa", 
            "precipitacion", 
            "presion_superficial", 
            "velocidad_viento", 
            "direccion_viento",
            "fecha_creacion"
        }
    ),
    
    // 8. Cambiar tipos de datos
    TipoCambiado = Table.TransformColumnTypes(
        ExpandirCamposMedicion,
        {
            {"zona_id", Int64.Type},
            {"nombre", type text},
            {"codigo", type text},
            {"latitud", type number},
            {"longitud", type number},
            {"medicion_id", Int64.Type},
            {"fecha_hora", type datetime},
            {"pm25", type number},
            {"pm10", type number},
            {"no2", type number},
            {"temperatura", type number},
            {"humedad_relativa", type number},
            {"precipitacion", type number},
            {"presion_superficial", type number},
            {"velocidad_viento", type number},
            {"direccion_viento", Int64.Type},
            {"fecha_creacion", type datetime}
        }
    )
in
    TipoCambiado
```

---

## 🔹 Consulta 2: Histórico de Mediciones

**Nombre de la consulta:** `HistoricoMediciones`

**Descripción:** Obtiene las últimas 1000 mediciones de todas las zonas.

**URL:** `http://localhost:3001/api/mediciones?limit=1000`

```m
let
    // 1. Obtener datos del endpoint
    Origen = Json.Document(Web.Contents("http://localhost:3001/api/mediciones?limit=1000")),
    
    // 2. Convertir lista en tabla
    ConvertidoEnTabla = Table.FromList(Origen, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    
    // 3. Expandir todos los campos
    ExpandirColumn1 = Table.ExpandRecordColumn(
        ConvertidoEnTabla, 
        "Column1", 
        {
            "medicion_id",
            "zona_id",
            "fecha_hora",
            "pm25",
            "pm10",
            "no2",
            "temperatura",
            "humedad_relativa",
            "precipitacion",
            "presion_superficial",
            "velocidad_viento",
            "direccion_viento",
            "fecha_creacion",
            "Zona"
        }, 
        {
            "medicion_id",
            "zona_id",
            "fecha_hora",
            "pm25",
            "pm10",
            "no2",
            "temperatura",
            "humedad_relativa",
            "precipitacion",
            "presion_superficial",
            "velocidad_viento",
            "direccion_viento",
            "fecha_creacion",
            "Zona"
        }
    ),
    
    // 4. Expandir información de la zona
    ExpandirZona = Table.ExpandRecordColumn(
        ExpandirColumn1, 
        "Zona", 
        {"nombre", "codigo", "latitud", "longitud"}, 
        {"zona_nombre", "zona_codigo", "zona_latitud", "zona_longitud"}
    ),
    
    // 5. Cambiar tipos de datos
    TipoCambiado = Table.TransformColumnTypes(
        ExpandirZona,
        {
            {"medicion_id", Int64.Type},
            {"zona_id", Int64.Type},
            {"fecha_hora", type datetime},
            {"pm25", type number},
            {"pm10", type number},
            {"no2", type number},
            {"temperatura", type number},
            {"humedad_relativa", type number},
            {"precipitacion", type number},
            {"presion_superficial", type number},
            {"velocidad_viento", type number},
            {"direccion_viento", Int64.Type},
            {"fecha_creacion", type datetime},
            {"zona_nombre", type text},
            {"zona_codigo", type text},
            {"zona_latitud", type number},
            {"zona_longitud", type number}
        }
    ),
    
    // 6. Ordenar por fecha descendente
    FilasOrdenadas = Table.Sort(TipoCambiado, {{"fecha_hora", Order.Descending}})
in
    FilasOrdenadas
```

---

## 🔹 Consulta 3: Catálogo de Zonas

**Nombre de la consulta:** `Zonas`

**Descripción:** Obtiene todas las zonas activas.

**URL:** `http://localhost:3001/api/zonas?activa=true`

```m
let
    // 1. Obtener datos del endpoint
    Origen = Json.Document(Web.Contents("http://localhost:3001/api/zonas?activa=true")),
    
    // 2. Convertir lista en tabla
    ConvertidoEnTabla = Table.FromList(Origen, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    
    // 3. Expandir todos los campos
    ExpandirColumn1 = Table.ExpandRecordColumn(
        ConvertidoEnTabla, 
        "Column1", 
        {
            "zona_id",
            "nombre",
            "codigo",
            "latitud",
            "longitud",
            "descripcion",
            "activa",
            "fecha_creacion",
            "fecha_actualizacion"
        }, 
        {
            "zona_id",
            "nombre",
            "codigo",
            "latitud",
            "longitud",
            "descripcion",
            "activa",
            "fecha_creacion",
            "fecha_actualizacion"
        }
    ),
    
    // 4. Cambiar tipos de datos
    TipoCambiado = Table.TransformColumnTypes(
        ExpandirColumn1,
        {
            {"zona_id", Int64.Type},
            {"nombre", type text},
            {"codigo", type text},
            {"latitud", type number},
            {"longitud", type number},
            {"descripcion", type text},
            {"activa", type logical},
            {"fecha_creacion", type datetime},
            {"fecha_actualizacion", type datetime}
        }
    )
in
    TipoCambiado
```

---

## 🔹 Consulta 4: Datos de Zona Específica

**Nombre de la consulta:** `ZonaCentro` (ejemplo para zona ID 1)

**Descripción:** Obtiene datos históricos de una zona específica.

**URL:** `http://localhost:3001/api/open-meteo/realtime/1?limit=100`

```m
let
    // 1. Configurar parámetros
    ZonaID = 1,
    Limit = 100,
    URL = "http://localhost:3001/api/open-meteo/realtime/" & Text.From(ZonaID) & "?limit=" & Text.From(Limit),
    
    // 2. Obtener datos del endpoint
    Origen = Json.Document(Web.Contents(URL)),
    
    // 3. Extraer información de la zona
    zona = Origen[zona],
    zona_id = zona[zona_id],
    zona_nombre = zona[nombre],
    zona_codigo = zona[codigo],
    zona_latitud = zona[latitud],
    zona_longitud = zona[longitud],
    
    // 4. Extraer historial de mediciones
    historial = Origen[historial],
    
    // 5. Convertir lista en tabla
    ConvertidoEnTabla = Table.FromList(historial, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    
    // 6. Expandir campos de mediciones
    ExpandirColumn1 = Table.ExpandRecordColumn(
        ConvertidoEnTabla, 
        "Column1", 
        {
            "medicion_id",
            "fecha_hora",
            "pm25",
            "pm10",
            "no2",
            "temperatura",
            "humedad_relativa",
            "precipitacion",
            "presion_superficial",
            "velocidad_viento",
            "direccion_viento"
        }, 
        {
            "medicion_id",
            "fecha_hora",
            "pm25",
            "pm10",
            "no2",
            "temperatura",
            "humedad_relativa",
            "precipitacion",
            "presion_superficial",
            "velocidad_viento",
            "direccion_viento"
        }
    ),
    
    // 7. Agregar información de la zona a cada fila
    AgregarZonaInfo = Table.AddColumn(ExpandirColumn1, "zona_id", each zona_id),
    AgregarNombre = Table.AddColumn(AgregarZonaInfo, "zona_nombre", each zona_nombre),
    AgregarCodigo = Table.AddColumn(AgregarNombre, "zona_codigo", each zona_codigo),
    
    // 8. Cambiar tipos de datos
    TipoCambiado = Table.TransformColumnTypes(
        AgregarCodigo,
        {
            {"medicion_id", Int64.Type},
            {"fecha_hora", type datetime},
            {"pm25", type number},
            {"pm10", type number},
            {"no2", type number},
            {"temperatura", type number},
            {"humedad_relativa", type number},
            {"precipitacion", type number},
            {"presion_superficial", type number},
            {"velocidad_viento", type number},
            {"direccion_viento", Int64.Type},
            {"zona_id", Int64.Type},
            {"zona_nombre", type text},
            {"zona_codigo", type text}
        }
    )
in
    TipoCambiado
```

---

## 🔹 Consulta 5: Resumen Diario por Zona

**Nombre de la consulta:** `ResumenDiario`

**Descripción:** Agrupa las mediciones por día y zona, calculando promedios.

```m
let
    // 1. Referencia a la consulta HistoricoMediciones
    Origen = HistoricoMediciones,
    
    // 2. Agregar columna de fecha (sin hora)
    AgregarFecha = Table.AddColumn(Origen, "Fecha", each Date.From([fecha_hora]), type date),
    
    // 3. Agrupar por fecha y zona
    Agrupado = Table.Group(
        AgregarFecha, 
        {"Fecha", "zona_id", "zona_nombre"}, 
        {
            {"pm25_promedio", each List.Average([pm25]), type number},
            {"pm10_promedio", each List.Average([pm10]), type number},
            {"no2_promedio", each List.Average([no2]), type number},
            {"temperatura_promedio", each List.Average([temperatura]), type number},
            {"humedad_promedio", each List.Average([humedad_relativa]), type number},
            {"pm25_maximo", each List.Max([pm25]), type number},
            {"pm25_minimo", each List.Min([pm25]), type number},
            {"total_mediciones", each Table.RowCount(_), Int64.Type}
        }
    ),
    
    // 4. Ordenar por fecha descendente
    Ordenado = Table.Sort(Agrupado, {{"Fecha", Order.Descending}})
in
    Ordenado
```

---

## 🔹 Consulta 6: Alertas de Calidad del Aire

**Nombre de la consulta:** `Alertas`

**Descripción:** Obtiene todas las alertas registradas.

**URL:** `http://localhost:3001/api/alertas?limit=500`

```m
let
    // 1. Obtener datos del endpoint
    Origen = Json.Document(Web.Contents("http://localhost:3001/api/alertas?limit=500")),
    
    // 2. Convertir lista en tabla
    ConvertidoEnTabla = Table.FromList(Origen, Splitter.SplitByNothing(), null, null, ExtraValues.Error),
    
    // 3. Expandir todos los campos
    ExpandirColumn1 = Table.ExpandRecordColumn(
        ConvertidoEnTabla, 
        "Column1", 
        {
            "alerta_id",
            "usuario_id",
            "zona_id",
            "regla_id",
            "medicion_id",
            "titulo",
            "mensaje",
            "severidad",
            "estado",
            "fuente",
            "metrica",
            "valor_medido",
            "umbral",
            "observaciones",
            "fecha_creacion",
            "fecha_actualizacion",
            "Usuario",
            "Zona",
            "ReglaAlerta",
            "Medicion"
        }, 
        {
            "alerta_id",
            "usuario_id",
            "zona_id",
            "regla_id",
            "medicion_id",
            "titulo",
            "mensaje",
            "severidad",
            "estado",
            "fuente",
            "metrica",
            "valor_medido",
            "umbral",
            "observaciones",
            "fecha_creacion",
            "fecha_actualizacion",
            "Usuario",
            "Zona",
            "ReglaAlerta",
            "Medicion"
        }
    ),
    
    // 4. Expandir información de zona
    ExpandirZona = Table.ExpandRecordColumn(
        ExpandirColumn1, 
        "Zona", 
        {"nombre"}, 
        {"zona_nombre"}
    ),
    
    // 5. Cambiar tipos de datos
    TipoCambiado = Table.TransformColumnTypes(
        ExpandirZona,
        {
            {"alerta_id", Int64.Type},
            {"usuario_id", Int64.Type},
            {"zona_id", Int64.Type},
            {"fecha_creacion", type datetime},
            {"fecha_actualizacion", type datetime},
            {"valor_medido", type number},
            {"umbral", type number},
            {"titulo", type text},
            {"mensaje", type text},
            {"severidad", type text},
            {"estado", type text},
            {"metrica", type text},
            {"zona_nombre", type text}
        }
    ),
    
    // 6. Filtrar solo alertas abiertas (opcional)
    // FiltradasAbiertas = Table.SelectRows(TipoCambiado, each [estado] = "open"),
    
    // 7. Ordenar por fecha descendente
    Ordenado = Table.Sort(TipoCambiado, {{"fecha_creacion", Order.Descending}})
in
    Ordenado
```

---

## 🔧 Cómo Usar Estos Códigos

### Método 1: Editor Avanzado

1. En Power BI Desktop, ve a **"Obtener datos"** → **"Consulta en blanco"**
2. En Power Query Editor, haz clic en **"Vista"** → **"Editor avanzado"**
3. Copia y pega uno de los códigos de arriba
4. Haz clic en **"Listo"**
5. Renombra la consulta

### Método 2: Desde cero

1. Sigue los pasos visuales de la guía principal
2. Si necesitas verificar o modificar el código generado, usa el Editor Avanzado

---

## 📝 Notas Importantes

### Cambiar URL del servidor

Si tu API está en otro servidor o puerto, busca y reemplaza:
```
http://localhost:3001
```

Por tu URL, por ejemplo:
```
http://192.168.1.100:3001
```

### Cambiar límite de registros

Busca `?limit=XXX` en las URLs y modifica el número según necesites.

### Agregar columnas calculadas

Después de cargar los datos, puedes agregar columnas personalizadas. Ejemplo:

```m
// Agregar columna de nivel de riesgo PM2.5
AgregarNivelRiesgo = Table.AddColumn(
    Origen, 
    "nivel_riesgo_pm25", 
    each 
        if [pm25] <= 12 then "Bueno"
        else if [pm25] <= 35.4 then "Moderado"
        else if [pm25] <= 55.4 then "Insalubre para grupos sensibles"
        else if [pm25] <= 150.4 then "Insalubre"
        else if [pm25] <= 250.4 then "Muy Insalubre"
        else "Peligroso"
)
```

---

## 🎯 Tips de Rendimiento

1. **Limita los datos**: Usa el parámetro `limit` para obtener solo los datos necesarios
2. **Filtra en el origen**: Es más eficiente filtrar en la API que en Power Query
3. **Usa parámetros**: Crea parámetros para URLs y límites dinámicos
4. **Desactiva actualización automática**: En consultas que no cambien frecuentemente

---

## 🔄 Actualización Programada

Para actualizar automáticamente:

1. **Power BI Desktop**: Configura actualización automática en las opciones
2. **Power BI Service**: Requiere Gateway de datos o API pública

---

## ✅ Verificación

Para verificar que todo funciona:

1. Cada consulta debe mostrar datos sin errores
2. Los tipos de datos deben ser correctos (números, fechas, texto)
3. No debe haber valores nulos inesperados
4. Las relaciones entre tablas deben funcionar

¡Listo! Ahora tienes todas las consultas configuradas 🎉
