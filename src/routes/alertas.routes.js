import express from 'express';
import {
  getAllAlertas,
  getAllAlertasSinFiltro,
  getMisAlertas,
  getAlertaById,
  createAlerta,
  updateAlerta,
  deleteAlerta
} from '../controllers/alertas.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Rutas específicas deben ir antes de las rutas con parámetros dinámicos
router.get('/all', authenticateToken, getAllAlertasSinFiltro);
router.get('/mis-alertas', authenticateToken, getMisAlertas);

// Rutas existentes
router.get('/', authenticateToken, getAllAlertas);
router.get('/:id', authenticateToken, getAlertaById);
router.post('/', authenticateToken, createAlerta);
router.put('/:id', authenticateToken, updateAlerta);
router.delete('/:id', authenticateToken, deleteAlerta);

export default router;





