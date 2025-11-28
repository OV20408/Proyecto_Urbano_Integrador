import express from 'express';
import {
  getSyncStatus,
  syncAndGetData,
  syncAllZonas,
  syncZonaById,
  getRealtimeData,
  getRealtimeDataByZona
} from '../controllers/openMeteo.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Endpoint principal: GET que obtiene datos de Open-Meteo y los guarda automáticamente
// Este es el endpoint más simple: solo hace GET y ya obtiene y guarda todo
router.get('/sync', optionalAuth, syncAndGetData);

// Endpoint de diagnóstico
router.get('/status', optionalAuth, getSyncStatus);

// Endpoints alternativos (mantener compatibilidad)
router.post('/sync', optionalAuth, syncAllZonas);
router.post('/sync/:zona_id', optionalAuth, syncZonaById);

// Obtener datos en tiempo real (desde la base de datos)
router.get('/realtime', optionalAuth, getRealtimeData);
router.get('/realtime/:zona_id', optionalAuth, getRealtimeDataByZona);

export default router;

