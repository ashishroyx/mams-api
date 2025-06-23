import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';
import { getInventory } from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', verifyUser, getInventory);

export default router;
