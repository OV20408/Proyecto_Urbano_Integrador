import express from 'express';
import {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  getWorkflowLogs
} from '../controllers/workflows.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getAllWorkflows);
router.get('/:id', optionalAuth, getWorkflowById);
router.get('/:id/logs', optionalAuth, getWorkflowLogs);
router.post('/', authenticateToken, createWorkflow);
router.put('/:id', authenticateToken, updateWorkflow);
router.delete('/:id', authenticateToken, deleteWorkflow);

export default router;



