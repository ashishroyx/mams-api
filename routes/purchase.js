import express from 'express';
import { addPurchase, getAllPurchases } from '../controllers/purchaseController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

// POST a new purchase
router.post('/', verifyToken, addPurchase);

// GET all purchases with optional filters
router.get('/', verifyToken, getAllPurchases);

export default router;
