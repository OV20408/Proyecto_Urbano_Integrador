# Seeders - Datos de Prueba

Este directorio contiene scripts para poblar la base de datos con datos de prueba para desarrollo y testing.

## 📋 Seeders Disponibles

### 1. Seed de Alertas (`seed-alertas.js`)
Crea 11 alertas de prueba para el usuario con `usuario_id=1` y `zona_id=1`.

**Características:**
- Diferentes niveles de severidad (critical, high, medium, low)
- Diferentes estados (open, ack, resolved, muted)
- Varias métricas (PM2.5, PM10, NO2)
- Fechas variadas para simular alertas en diferentes momentos

**Ejecutar:**
```bash
npm run seed:alertas
```

### 2. Seed de Reportes (`seed-reportes.js`)
Crea 6 reportes de prueba para el usuario con `usuario_creo=1` y `zona_id=1`.

**Características:**
- Reportes mensuales, semanales, diarios y trimestrales
- Diferentes estados (Pendiente, Enviado)
- Diferentes niveles de riesgo (Bajo, Medio, Alto)
- Contenido completo con JSON estructurado

**Ejecutar:**
```bash
npm run seed:reportes
```

### 3. Seed Completo
Ejecuta ambos seeders en secuencia.

**Ejecutar:**
```bash
npm run seed:all
```

## 🚀 Uso

### Requisitos Previos
1. Asegúrate de tener configuradas las variables de entorno en el archivo `.env`
2. La base de datos debe estar creada y accesible
3. Las tablas deben existir (ejecutar migraciones si es necesario)

### Ejecución Individual

```bash
# Solo alertas
npm run seed:alertas

# Solo reportes
npm run seed:reportes

# Ambos
npm run seed:all
```

### Ejecución Directa con Node

```bash
# Alertas
node seeders/seed-alertas.js

# Reportes
node seeders/seed-reportes.js
```

## ⚠️ Advertencias

- **Los seeders eliminan datos existentes**: Antes de ejecutar, los seeders eliminan todas las alertas y reportes existentes para `usuario_id=1` y `zona_id=1`
- **Solo para desarrollo**: Estos seeders están diseñados para entornos de desarrollo y testing
- **Datos de prueba**: Los datos generados son ficticios y solo para propósitos de prueba

## 📊 Datos Generados

### Alertas
- **Total**: 11 alertas
- **Estados**: open (4), ack (2), resolved (3), muted (1), open (1)
- **Severidades**: critical (3), high (2), medium (4), low (1)
- **Métricas**: PM2.5 (6), PM10 (2), NO2 (2), Combinado (1)

### Reportes
- **Total**: 6 reportes
- **Estados**: Pendiente (3), Enviado (3)
- **Riesgos**: Bajo (1), Medio (3), Alto (2)
- **Tipos**: Mensual (2), Semanal (2), Diario (1), Trimestral (1)

## 🔧 Personalización

Si necesitas modificar los datos generados, edita directamente los archivos:
- `seed-alertas.js`: Modifica el array `alertasData`
- `seed-reportes.js`: Modifica el array `reportesData`

## 📝 Notas

- Los seeders usan transacciones para garantizar la integridad de los datos
- Los códigos de reporte se generan automáticamente con formato `R-YYMMDD###`
- Las fechas se calculan dinámicamente para simular datos realistas
- Los seeders muestran un resumen al finalizar con estadísticas de los datos creados

