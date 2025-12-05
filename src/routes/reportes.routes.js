import express from 'express';
import {
  getAllReportes,
  getAllReportesSinFiltro,
  getMisReportes,
  getReporteById,
  createReporte,
  updateReporte,
  deleteReporte
} from '../controllers/reportes.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas específicas deben ir antes de las rutas con parámetros dinámicos
router.get('/all', authenticateToken, getAllReportesSinFiltro);
router.get('/mis-reportes', authenticateToken, getMisReportes);

// Rutas existentes
router.get('/', authenticateToken, getAllReportes);
router.get('/:id', authenticateToken, getReporteById);
router.post('/', authenticateToken, createReporte);
router.put('/:id', authenticateToken, updateReporte);
router.delete('/:id', authenticateToken, deleteReporte);

export default router;





