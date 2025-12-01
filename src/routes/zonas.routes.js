import express from 'express';
import {
  getAllZonas,
  getZonaById,
  createZona,
  updateZona,
  deleteZona
} from '../controllers/zonas.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getAllZonas);
router.get('/:id', optionalAuth, getZonaById);
router.post('/', authenticateToken, createZona);
router.put('/:id', authenticateToken, updateZona);
router.delete('/:id', authenticateToken, deleteZona);

export default router;





