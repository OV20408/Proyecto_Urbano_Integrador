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
import { getBIDataset } from '../controllers/bi.controller.js';

const router = express.Router();

// ----- ENDPOINTS -----

// 🔥 Endpoint para Power BI
router.get('/bi', optionalAuth, getBIDataset);

// Sync
router.get('/sync', optionalAuth, syncAndGetData);
router.post('/sync', optionalAuth, syncAllZonas);
router.post('/sync/:zona_id', optionalAuth, syncZonaById);

// Estado
router.get('/status', optionalAuth, getSyncStatus);

// Realtime
router.get('/realtime', optionalAuth, getRealtimeData);
router.get('/realtime/:zona_id', optionalAuth, getRealtimeDataByZona);

export default router;
