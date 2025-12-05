# 🔄 Script de Sincronización de Datos Open-Meteo
# Este script sincroniza automáticamente los datos de Open-Meteo con tu base de datos

Write-Host "🚀 Iniciando sincronización de datos Open-Meteo..." -ForegroundColor Cyan

# URL de la API
$apiUrl = "http://localhost:3001"
$syncEndpoint = "$apiUrl/api/open-meteo/sync"
$realtimeEndpoint = "$apiUrl/api/open-meteo/realtime"
$zonasEndpoint = "$apiUrl/api/zonas?activa=true"

# Función para verificar que el servidor está corriendo
function Test-ServerRunning {
    Write-Host "`n📡 Verificando que el servidor está corriendo..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $apiUrl -Method GET -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Servidor corriendo correctamente" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "❌ Error: El servidor no está corriendo" -ForegroundColor Red
        Write-Host "   Por favor, ejecuta: npm run dev" -ForegroundColor Yellow
        return $false
    }
}

# Función para verificar zonas activas
function Test-ActiveZones {
    Write-Host "`n🗺️  Verificando zonas activas..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri $zonasEndpoint -Method GET
        $zonas = $response
        
        if ($zonas.Count -eq 0) {
            Write-Host "⚠️  Advertencia: No hay zonas activas configuradas" -ForegroundColor Yellow
            return $false
        }
        
        Write-Host "✅ Encontradas $($zonas.Count) zonas activas:" -ForegroundColor Green
        foreach ($zona in $zonas) {
            Write-Host "   - $($zona.nombre) (Lat: $($zona.latitud), Lon: $($zona.longitud))" -ForegroundColor Cyan
        }
        return $true
    } catch {
        Write-Host "❌ Error al verificar zonas: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Función para sincronizar datos
function Sync-OpenMeteoData {
    Write-Host "`n🔄 Iniciando sincronización..." -ForegroundColor Yellow
    Write-Host "   Esto puede tardar varios segundos..." -ForegroundColor Gray
    
    try {
        $response = Invoke-RestMethod -Uri $syncEndpoint -Method POST -TimeoutSec 60
        
        Write-Host "`n✅ Sincronización completada!" -ForegroundColor Green
        Write-Host "   Total de zonas: $($response.total_zonas)" -ForegroundColor Cyan
        Write-Host "   Exitosas: $($response.exitosas)" -ForegroundColor Green
        Write-Host "   Errores: $($response.errores)" -ForegroundColor $(if ($response.errores -gt 0) { "Yellow" } else { "Green" })
        
        if ($response.resultados) {
            Write-Host "`n📊 Detalle por zona:" -ForegroundColor Yellow
            foreach ($resultado in $response.resultados) {
                if ($resultado.success) {
                    Write-Host "   ✅ $($resultado.nombre):" -ForegroundColor Green
                    Write-Host "      - Mediciones procesadas: $($resultado.mediciones_procesadas)" -ForegroundColor Cyan
                    Write-Host "      - Nuevas: $($resultado.mediciones_nuevas)" -ForegroundColor Cyan
                    Write-Host "      - Actualizadas: $($resultado.mediciones_actualizadas)" -ForegroundColor Cyan
                } else {
                    Write-Host "   ❌ $($resultado.nombre): Error" -ForegroundColor Red
                }
            }
        }
        
        if ($response.errores_detalle -and $response.errores_detalle.Count -gt 0) {
            Write-Host "`n⚠️  Errores encontrados:" -ForegroundColor Yellow
            foreach ($error in $response.errores_detalle) {
                Write-Host "   - $($error.nombre): $($error.error)" -ForegroundColor Red
            }
        }
        
        return $true
    } catch {
        Write-Host "❌ Error durante la sincronización: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Función para mostrar datos en tiempo real
function Show-RealtimeData {
    Write-Host "`n📈 Obteniendo datos en tiempo real..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-RestMethod -Uri $realtimeEndpoint -Method GET
        
        Write-Host "`n✅ Datos en tiempo real obtenidos!" -ForegroundColor Green
        Write-Host "   Timestamp: $($response.timestamp)" -ForegroundColor Cyan
        Write-Host "   Zonas con datos: $($response.zonas_con_datos)" -ForegroundColor Cyan
        
        Write-Host "`n📊 Últimas mediciones:" -ForegroundColor Yellow
        foreach ($zona in $response.datos) {
            $zonaNombre = $zona.zona.nombre
            $medicion = $zona.mediciones[0]
            
            Write-Host "`n   🏙️  $zonaNombre" -ForegroundColor White -BackgroundColor DarkBlue
            Write-Host "      PM2.5: $($medicion.pm25) μg/m³" -ForegroundColor $(Get-PM25Color $medicion.pm25)
            Write-Host "      PM10:  $($medicion.pm10) μg/m³" -ForegroundColor Cyan
            Write-Host "      NO2:   $($medicion.no2) μg/m³" -ForegroundColor Cyan
            Write-Host "      Temp:  $($medicion.temperatura) °C" -ForegroundColor Cyan
            Write-Host "      Hora:  $($medicion.fecha_hora)" -ForegroundColor Gray
        }
        
        return $true
    } catch {
        Write-Host "❌ Error al obtener datos en tiempo real: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Función para determinar color según nivel de PM2.5
function Get-PM25Color {
    param([decimal]$pm25)
    
    if ($pm25 -le 12) { return "Green" }
    elseif ($pm25 -le 35.4) { return "Yellow" }
    elseif ($pm25 -le 55.4) { return "DarkYellow" }
    elseif ($pm25 -le 150.4) { return "Red" }
    elseif ($pm25 -le 250.4) { return "Magenta" }
    else { return "DarkRed" }
}

# Función principal
function Main {
    Write-Host @"
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║  🌍 SINCRONIZACIÓN DE DATOS OPEN-METEO                    ║
║  📊 API Proyecto Urbano Integrador                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan
    
    # 1. Verificar servidor
    if (-not (Test-ServerRunning)) {
        Write-Host "`n❌ Abortando: El servidor no está disponible" -ForegroundColor Red
        return
    }
    
    # 2. Verificar zonas
    if (-not (Test-ActiveZones)) {
        Write-Host "`n⚠️  Advertencia: No hay zonas configuradas" -ForegroundColor Yellow
        $continue = Read-Host "¿Deseas continuar de todos modos? (S/N)"
        if ($continue -ne "S" -and $continue -ne "s") {
            Write-Host "❌ Abortado por el usuario" -ForegroundColor Red
            return
        }
    }
    
    # 3. Sincronizar
    $syncSuccess = Sync-OpenMeteoData
    
    if (-not $syncSuccess) {
        Write-Host "`n❌ Error: La sincronización falló" -ForegroundColor Red
        return
    }
    
    # 4. Mostrar datos en tiempo real
    Write-Host "`n" -NoNewline
    $showData = Read-Host "¿Deseas ver los datos en tiempo real? (S/N)"
    if ($showData -eq "S" -or $showData -eq "s") {
        Show-RealtimeData
    }
    
    Write-Host "`n✅ ¡Proceso completado!" -ForegroundColor Green
    Write-Host "   Ahora puedes actualizar Power BI Desktop para ver los nuevos datos" -ForegroundColor Cyan
    Write-Host "`n💡 Tip: Puedes programar este script para ejecutarse automáticamente cada hora" -ForegroundColor Yellow
    Write-Host "   usando el Programador de tareas de Windows" -ForegroundColor Yellow
}

# Ejecutar script principal
Main

# Pausar para ver resultados
Write-Host "`nPresiona cualquier tecla para salir..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
