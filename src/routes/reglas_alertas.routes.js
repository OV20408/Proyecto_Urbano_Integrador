import express from 'express';
import {
  getAllReglasAlertas,
  getReglaAlertaById,
  createReglaAlerta,
  updateReglaAlerta,
  deleteReglaAlerta
} from '../controllers/reglas_alertas.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllReglasAlertas);
router.get('/:id', authenticateToken, getReglaAlertaById);
router.post('/', authenticateToken, createReglaAlerta);
router.put('/:id', authenticateToken, updateReglaAlerta);
router.delete('/:id', authenticateToken, deleteReglaAlerta);

export default router;



