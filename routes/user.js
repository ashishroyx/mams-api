import express from 'express';
import { getAllUsers, createUser } from '../controllers/userController.js';
import verifyUser from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', verifyUser, createUser);
router.get('/all', verifyUser, getAllUsers);


export default router;
