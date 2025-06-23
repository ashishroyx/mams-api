import express from 'express';
import { addPurchase, getAllPurchases } from '../controllers/purchaseController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/', verifyToken, addPurchase);


router.get('/', verifyToken, getAllPurchases);

export default router;
