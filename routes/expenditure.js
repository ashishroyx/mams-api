import express from 'express';
import verifyUser from '../middleware/authMiddleware.js';
import { getExpenditures } from '../controllers/expenditureController.js';

const router = express.Router();

router.get('/', verifyUser, getExpenditures);

export default router;
