import express from 'express';
import {
  getAllUsuarioWorkflows,
  getUsuarioWorkflowById,
  createUsuarioWorkflow,
  updateUsuarioWorkflow,
  deleteUsuarioWorkflow
} from '../controllers/usuario_workflows.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAllUsuarioWorkflows);
router.get('/:id', authenticateToken, getUsuarioWorkflowById);
router.post('/', authenticateToken, createUsuarioWorkflow);
router.put('/:id', authenticateToken, updateUsuarioWorkflow);
router.delete('/:id', authenticateToken, deleteUsuarioWorkflow);

export default router;





