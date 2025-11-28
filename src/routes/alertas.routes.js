import express from 'express';
import {
  getAllAlertas,
  getAlertaById,
  createAlerta,
  updateAlerta,
  deleteAlerta
} from '../controllers/alertas.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllAlertas);
router.get('/:id', authenticateToken, getAlertaById);
router.post('/', authenticateToken, createAlerta);
router.put('/:id', authenticateToken, updateAlerta);
router.delete('/:id', authenticateToken, deleteAlerta);

export default router;



