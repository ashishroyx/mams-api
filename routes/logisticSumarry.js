import express from 'express';
import { getInventory } from '../controllers/inventoryController.js';
import { getExpenditures } from '../controllers/expenditureController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

router.get('/inventory', authMiddleware, getInventory);
router.get('/expenditure', authMiddleware, getExpenditures);

export default router;
