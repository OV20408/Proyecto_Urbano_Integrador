import express from 'express';
import {
  getAllMediciones,
  getMedicionById,
  createMedicion,
  updateMedicion,
  deleteMedicion
} from '../controllers/mediciones.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getAllMediciones);
router.get('/:id', optionalAuth, getMedicionById);
router.post('/', authenticateToken, createMedicion);
router.put('/:id', authenticateToken, updateMedicion);
router.delete('/:id', authenticateToken, deleteMedicion);

export default router;





