# Cómo Sincronizar Datos de Open-Meteo

## Pasos para obtener y guardar datos

### 1. Verificar que hay zonas activas configuradas

Primero, verifica que tengas zonas con coordenadas:

```bash
GET http://localhost:3001/api/zonas?activa=true
```

Asegúrate de que las zonas tengan `latitud` y `longitud` configuradas.

### 2. Sincronizar datos de todas las zonas

Ejecuta el endpoint de sincronización:

```bash
POST http://localhost:3001/api/open-meteo/sync
```

**Con curl:**
```bash
curl -X POST http://localhost:3001/api/open-meteo/sync
```

**Con Postman o similar:**
- Método: POST
- URL: `http://localhost:3001/api/open-meteo/sync`
- No requiere body ni headers de autenticación

### 3. Sincronizar datos de una zona específica

Si quieres sincronizar solo una zona:

```bash
POST http://localhost:3001/api/open-meteo/sync/1
```

Donde `1` es el `zona_id` de la zona que quieres sincronizar.

### 4. Verificar que los datos se guardaron

**Opción A: Usar el endpoint de estado**
```bash
GET http://localhost:3001/api/open-meteo/status
```

Esto mostrará cuántas mediciones hay guardadas por zona.

**Opción B: Consultar datos en tiempo real**
```bash
GET http://localhost:3001/api/open-meteo/realtime
```

Esto mostrará los últimos datos guardados de cada zona.

### 5. Verificar en la base de datos directamente

```sql
-- Ver total de mediciones
SELECT COUNT(*) FROM mediciones_aire;

-- Ver mediciones por zona
SELECT z.nombre, COUNT(m.medicion_id) as total_mediciones
FROM zonas z
LEFT JOIN mediciones_aire m ON z.zona_id = m.zona_id
GROUP BY z.zona_id, z.nombre
ORDER BY total_mediciones DESC;

-- Ver últimas 10 mediciones
SELECT m.*, z.nombre as zona_nombre
FROM mediciones_aire m
JOIN zonas z ON m.zona_id = z.zona_id
ORDER BY m.fecha_hora DESC
LIMIT 10;
```

## Qué esperar después de sincronizar

Después de ejecutar el sync, deberías ver en la respuesta:

```json
{
  "message": "Sincronización completada",
  "total_zonas": 8,
  "exitosas": 8,
  "errores": 0,
  "resultados": [
    {
      "zona_id": 1,
      "nombre": "Centro",
      "mediciones_procesadas": 168,
      "mediciones_nuevas": 168,
      "mediciones_actualizadas": 0,
      "mediciones_con_error": 0,
      "success": true
    }
  ]
}
```

## Logs en la consola

Cuando ejecutes el sync, deberías ver en la consola del servidor:

```
🔄 Obteniendo datos de Open-Meteo para zona: Centro (-17.8146, -63.1561)
✅ Datos obtenidos de Open-Meteo para Centro
📦 168 mediciones procesadas para Centro
📊 Procesando 168 mediciones para zona Centro (ID: 1)
✅ Guardada nueva medición ID: 1234 para Centro - 2024-01-15T10:00:00.000Z
✅ Zona Centro: 168 nuevas, 0 actualizadas, 0 errores
✅ Transacción completada. 8 zonas exitosas, 0 con errores
```

## Problemas comunes

### "No hay zonas activas configuradas"
- Verifica que las zonas tengan `activa: true` en la base de datos
- Verifica que las zonas tengan `latitud` y `longitud` configuradas

### "Error al obtener datos de Open-Meteo"
- Verifica tu conexión a internet
- La API de Open-Meteo puede estar temporalmente no disponible
- Intenta de nuevo después de unos minutos

### "No se obtuvieron datos válidos"
- Verifica que las coordenadas de la zona sean correctas
- La API puede no tener datos para esas coordenadas

### Los datos no se guardan
- Revisa los logs en la consola para ver errores específicos
- Verifica que la conexión a la base de datos esté funcionando
- Verifica que la tabla `mediciones_aire` exista y tenga la estructura correcta

## Programar sincronización automática

Para sincronizar automáticamente cada hora, puedes usar un cron job:

**En Linux/Mac:**
```bash
# Editar crontab
crontab -e

# Agregar esta línea para ejecutar cada hora
0 * * * * curl -X POST http://localhost:3001/api/open-meteo/sync
```

**En Windows (Task Scheduler):**
1. Abre el Programador de tareas
2. Crea una tarea básica
3. Configura para ejecutar cada hora
4. Acción: Iniciar un programa
5. Programa: `curl`
6. Argumentos: `-X POST http://localhost:3001/api/open-meteo/sync`

## Notas importantes

- La API de Open-Meteo proporciona datos horarios
- Se recomienda sincronizar cada hora para tener datos actualizados
- Los datos se guardan con su fecha/hora original
- Si sincronizas varias veces, las mediciones existentes se actualizarán en lugar de duplicarse





