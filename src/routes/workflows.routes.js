import express from 'express';
import {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  getWorkflowLogs,
  getUsersWithPM2Workflows
} from '../controllers/workflows.controller.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getAllWorkflows);
router.get('/pm2/users', optionalAuth, getUsersWithPM2Workflows);
router.get('/:id', optionalAuth, getWorkflowById);
router.get('/:id/logs', optionalAuth, getWorkflowLogs);
router.post('/', authenticateToken, createWorkflow);
router.put('/:id', authenticateToken, updateWorkflow);
router.delete('/:id', authenticateToken, deleteWorkflow);

export default router;





