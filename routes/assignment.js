import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';
import {
  createAssignment,
  getAssignments
} from '../controllers/assignmentController.js';

const router = express.Router();

// 🔐 Protected Routes
router.post('/', verifyUser, createAssignment);
router.get('/', verifyUser, getAssignments);

export default router;
