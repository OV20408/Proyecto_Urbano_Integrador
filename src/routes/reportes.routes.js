import express from 'express';
import {
  getAllReportes,
  getReporteById,
  createReporte,
  updateReporte,
  deleteReporte
} from '../controllers/reportes.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllReportes);
router.get('/:id', authenticateToken, getReporteById);
router.post('/', authenticateToken, createReporte);
router.put('/:id', authenticateToken, updateReporte);
router.delete('/:id', authenticateToken, deleteReporte);

export default router;





