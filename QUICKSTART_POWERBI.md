# 🚀 Guía Rápida: API Open-Meteo → Power BI

## ⚡ Pasos Rápidos (10 minutos)

### 1️⃣ Iniciar el Servidor API

```powershell
cd "C:\Users\otera\OneDrive\Documents\Univalle\Integrador\Api_back_integrador\Proyecto_Urbano_Integrador"
npm run dev
```

Verifica en el navegador: http://localhost:3001/

---

### 2️⃣ Sincronizar Datos de Open-Meteo

**Opción A - Con PowerShell (Recomendado)**

Ejecuta el script incluido:
```powershell
.\sincronizar-datos.ps1
```

**Opción B - Manual**

```powershell
Invoke-WebRequest -Uri "http://localhost:3001/api/open-meteo/sync" -Method POST
```

Verifica los datos: http://localhost:3001/api/open-meteo/realtime

---

### 3️⃣ Abrir Power BI Desktop

1. Abre **Power BI Desktop**
2. Cierra la pantalla de bienvenida

---

### 4️⃣ Conectar Power BI a la API

#### A) Obtener Datos en Tiempo Real

1. **Inicio** → **Obtener datos** → **Web**
2. URL: `http://localhost:3001/api/open-meteo/realtime`
3. **Aceptar**

#### B) Expandir los Datos JSON

En Power Query Editor:

1. Expandir columna `datos` → Seleccionar: `zona` y `mediciones`
2. Expandir columna `zona` → Seleccionar: `zona_id`, `nombre`, `codigo`, `latitud`, `longitud`
3. Expandir columna `mediciones` (clic en el icono de expandir lista)
4. Expandir los campos de mediciones → Seleccionar todos
5. Cambiar tipos de datos:
   - `fecha_hora` → Fecha/Hora
   - `pm25`, `pm10`, `no2`, `temperatura`, etc. → Número decimal
   - `latitud`, `longitud` → Número decimal

#### C) Guardar la Consulta

1. Renombrar consulta a: **"DatosTiempoReal"**
2. **Cerrar y aplicar**

---

### 5️⃣ Crear Visualizaciones

#### Mapa de Calidad del Aire

1. Selecciona visualización: **Mapa**
2. Arrastra campos:
   - **Ubicación**: `nombre`
   - **Latitud**: `latitud`
   - **Longitud**: `longitud`
   - **Tamaño**: `pm25`

#### Gráfico de Líneas Temporal

1. Selecciona: **Gráfico de líneas**
2. Arrastra campos:
   - **Eje X**: `fecha_hora`
   - **Eje Y**: `pm25`
   - **Leyenda**: `nombre`

#### Tarjetas de Indicadores

1. Selecciona: **Tarjeta**
2. Arrastra: `pm25` (mostrará el promedio)
3. Duplica para `pm10` y `no2`

#### Tabla Detallada

1. Selecciona: **Tabla**
2. Arrastra campos:
   - `nombre`
   - `pm25`
   - `pm10`
   - `no2`
   - `temperatura`
   - `fecha_hora`

---

### 6️⃣ Actualizar Datos

Para ver datos actualizados:

1. Ejecuta: `.\sincronizar-datos.ps1`
2. En Power BI: **Inicio** → **Actualizar**

---

## 📚 Documentación Completa

- **📊 Guía Detallada de Power BI**: Ver `POWER_BI_INTEGRACION.md`
- **💻 Códigos M de Power Query**: Ver `POWER_QUERY_CODIGOS.md`
- **🌍 Endpoints de Open-Meteo**: Ver `OPEN_METEO_ENDPOINTS.md`
- **📋 Todos los Endpoints**: Ver `API_ENDPOINTS.md`

---

## 🔧 Solución Rápida de Problemas

### ❌ "No se puede conectar"
```powershell
# Verificar que el servidor está corriendo
curl http://localhost:3001/
```

### ❌ "No hay datos"
```powershell
# Sincronizar datos
.\sincronizar-datos.ps1
```

### ❌ "Error en Power Query"
- Verifica que la estructura JSON sea correcta en el navegador
- Usa los códigos M de `POWER_QUERY_CODIGOS.md`

---

## 🎯 Endpoints Clave

| Endpoint | Descripción |
|----------|-------------|
| `GET /` | Estado del servidor |
| `POST /api/open-meteo/sync` | Sincronizar todos los datos |
| `GET /api/open-meteo/realtime` | Datos en tiempo real |
| `GET /api/zonas?activa=true` | Zonas configuradas |
| `GET /api/mediciones?limit=1000` | Histórico de mediciones |

---

## 📞 ¿Necesitas Más Ayuda?

1. **Guía paso a paso**: Lee `POWER_BI_INTEGRACION.md`
2. **Ejemplos de código**: Lee `POWER_QUERY_CODIGOS.md`
3. **Script de sincronización**: Ejecuta `sincronizar-datos.ps1`

---

## ✅ Checklist Rápido

- [ ] Servidor corriendo en http://localhost:3001
- [ ] Datos sincronizados (ejecutar `sincronizar-datos.ps1`)
- [ ] Power BI Desktop abierto
- [ ] Consulta "DatosTiempoReal" creada
- [ ] Datos expandidos correctamente
- [ ] Visualizaciones creadas
- [ ] Actualización funcionando

¡Listo! 🎉 Ahora tienes tu dashboard de calidad del aire funcionando.
