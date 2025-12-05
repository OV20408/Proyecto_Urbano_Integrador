# Pruebas de Postman/Newman

Esta carpeta contiene las colecciones de Postman para probar todos los endpoints de la API.

## 📁 Archivos

- `API_Proyecto_Urbano_Complete.postman_collection.json`: Colección completa con todos los endpoints (54 endpoints)
- `API_Proyecto_Urbano.postman_collection.json`: Colección original (solo autenticación)
- `local.postman_environment.json`: Variables de entorno para desarrollo local
- `production.postman_environment.json`: Variables de entorno para producción
- `generate-collection.js`: Script para generar la colección completa

## 🚀 Uso

### Opción 1: Usar Postman Desktop

1. Abre Postman
2. Importa la colección: `File > Import > API_Proyecto_Urbano_Complete.postman_collection.json`
3. Importa el entorno: `File > Import > local.postman_environment.json`
4. Selecciona el entorno "Local" en el dropdown superior derecho
5. Ejecuta la colección completa o endpoints individuales

### Opción 2: Usar Newman (CLI)

#### Prerrequisitos

Asegúrate de que el servidor esté corriendo:
```bash
cd api_proyecto_urbano_integrador
npm start
```

#### Ejecutar Pruebas

```bash
# Desde la raíz del proyecto
npm run test:postman

# O directamente con newman
npx newman run tests/postman/API_Proyecto_Urbano_Complete.postman_collection.json \
  -e tests/postman/local.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export tests/postman/newman-report.json
```

#### Opciones de Newman

```bash
# Con reporte HTML
npx newman run tests/postman/API_Proyecto_Urbano_Complete.postman_collection.json \
  -e tests/postman/local.postman_environment.json \
  --reporters cli,html \
  --reporter-html-export tests/postman/newman-report.html

# Con timeout personalizado (útil para endpoints de Open-Meteo)
npx newman run tests/postman/API_Proyecto_Urbano_Complete.postman_collection.json \
  -e tests/postman/local.postman_environment.json \
  --timeout-request 300000 \
  --reporters cli

# Solo ejecutar una carpeta específica
npx newman run tests/postman/API_Proyecto_Urbano_Complete.postman_collection.json \
  -e tests/postman/local.postman_environment.json \
  --folder "1. Autenticación" \
  --reporters cli
```

## 📊 Estructura de la Colección

La colección completa está organizada en 10 carpetas:

1. **Autenticación** (6 endpoints)
   - Health Check
   - Registro Exitoso
   - Registro Email Duplicado
   - Registro Datos Incompletos
   - Login Exitoso
   - Login Password Incorrecta

2. **Zonas** (5 endpoints)
   - Obtener Todas las Zonas
   - Obtener Zona por ID
   - Crear Zona
   - Actualizar Zona
   - Eliminar Zona

3. **Mediciones** (6 endpoints)
   - Obtener Todas las Mediciones
   - Obtener Mediciones con Filtros
   - Obtener Medición por ID
   - Crear Medición
   - Actualizar Medición
   - Eliminar Medición

4. **Workflows** (7 endpoints)
   - Obtener Todos los Workflows
   - Obtener Workflow por ID
   - Obtener Usuarios con PM2.5 Workflows
   - Obtener Logs de Workflow
   - Crear Workflow
   - Actualizar Workflow
   - Eliminar Workflow

5. **Open-Meteo** (6 endpoints)
   - Status Open-Meteo
   - Sincronizar Open-Meteo (GET)
   - Sincronizar Open-Meteo (POST)
   - Sincronizar Zona Específica
   - Obtener Datos Realtime
   - Obtener Datos Realtime por Zona

6. **Reglas de Alertas** (5 endpoints)
   - Obtener Todas las Reglas
   - Obtener Regla por ID
   - Crear Regla de Alerta
   - Actualizar Regla de Alerta
   - Eliminar Regla de Alerta

7. **Alertas** (5 endpoints)
   - Obtener Todas las Alertas
   - Obtener Alerta por ID
   - Crear Alerta
   - Actualizar Alerta
   - Eliminar Alerta

8. **Usuario-Workflows** (5 endpoints)
   - Obtener Todas las Relaciones
   - Obtener Relación por ID
   - Crear Relación Usuario-Workflow
   - Actualizar Relación
   - Eliminar Relación

9. **Logs de Workflows** (4 endpoints)
   - Obtener Todos los Logs
   - Obtener Log por ID
   - Crear Log de Workflow
   - Eliminar Log

10. **Reportes** (5 endpoints)
    - Obtener Todos los Reportes
    - Obtener Reporte por ID
    - Crear Reporte
    - Actualizar Reporte
    - Eliminar Reporte

## 🔑 Variables de Entorno

### Local (`local.postman_environment.json`)

```json
{
  "baseUrl": "http://localhost:3001",
  "authToken": ""
}
```

### Producción (`production.postman_environment.json`)

```json
{
  "baseUrl": "https://api.tudominio.com",
  "authToken": ""
}
```

## 🔄 Variables de Colección

La colección usa variables automáticas que se generan durante las pruebas:

- `testEmail`: Email generado automáticamente para pruebas
- `testName`: Nombre generado automáticamente
- `testPassword`: Contraseña de prueba
- `authToken`: Token JWT obtenido después del login
- `testUserId`: ID del usuario de prueba creado
- `testZonaId`: ID de zona para pruebas
- `createdZonaId`: ID de zona creada durante las pruebas
- `createdMedicionId`: ID de medición creada
- `createdWorkflowId`: ID de workflow creado
- `createdReglaId`: ID de regla creada
- `createdAlertaId`: ID de alerta creada
- `createdUsuarioWorkflowId`: ID de relación creada
- `createdLogId`: ID de log creado
- `createdReporteId`: ID de reporte creado

## 📝 Notas Importantes

1. **Orden de Ejecución**: Las pruebas están diseñadas para ejecutarse en orden. Algunas pruebas dependen de recursos creados en pruebas anteriores.

2. **Autenticación**: El token se guarda automáticamente después del login exitoso y se usa en todas las peticiones que requieren autenticación.

3. **Limpieza**: Algunos recursos creados durante las pruebas pueden quedar en la base de datos. Esto es normal y puede limpiarse manualmente si es necesario.

4. **Open-Meteo Sync**: El endpoint de sincronización puede tardar varios minutos. Considera aumentar el timeout si ejecutas estas pruebas.

5. **Datos de Prueba**: Los emails y nombres se generan automáticamente con timestamps para evitar conflictos.

## 🔧 Regenerar la Colección

Si necesitas regenerar la colección completa:

```bash
cd tests/postman
node generate-collection.js
```

Esto generará `API_Proyecto_Urbano_Complete.postman_collection.json` con todos los endpoints actualizados.

## 📈 Reportes

Después de ejecutar las pruebas con Newman, puedes generar reportes en diferentes formatos:

- **CLI**: Salida en consola (por defecto)
- **JSON**: `--reporters json --reporter-json-export report.json`
- **HTML**: `--reporters html --reporter-html-export report.html`
- **JUnit**: `--reporters junit --reporter-junit-export report.xml`

## 🐛 Solución de Problemas

### Error: "ECONNREFUSED"
- Asegúrate de que el servidor esté corriendo en `http://localhost:3001`

### Error: "401 Unauthorized"
- Verifica que el login se haya ejecutado correctamente antes de las pruebas que requieren autenticación
- Revisa que el token se haya guardado en las variables de colección

### Error: "404 Not Found"
- Algunos endpoints pueden fallar si no hay datos en la base de datos
- Esto es normal para endpoints que requieren recursos existentes

### Timeout en Open-Meteo
- Aumenta el timeout: `--timeout-request 300000` (5 minutos)

## 📚 Recursos Adicionales

- [Documentación de Newman](https://github.com/postmanlabs/newman)
- [Documentación de Postman](https://learning.postman.com/)
- [API Documentation](../API_DOCUMENTATION_COMPLETE.md)
