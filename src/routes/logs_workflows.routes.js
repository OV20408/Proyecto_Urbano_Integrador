import express from 'express';
import {
  getAllLogsWorkflows,
  getLogWorkflowById,
  createLogWorkflow,
  deleteLogWorkflow
} from '../controllers/logs_workflows.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getAllLogsWorkflows);
router.get('/:id', optionalAuth, getLogWorkflowById);
router.post('/', authenticateToken, createLogWorkflow);
router.delete('/:id', authenticateToken, deleteLogWorkflow);

export default router;



