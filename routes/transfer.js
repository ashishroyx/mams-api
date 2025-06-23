// routes/transfer.js
import express from 'express';
import { createTransfer, getAllTransfers } from '../controllers/transferController.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyUser, createTransfer);
router.get('/', verifyUser, getAllTransfers);

export default router;
