import express from 'express';
import {
  addAsset,
  getAllAssets,
  getAssetById,
  updateAsset,
  deleteAsset,
} from '../controllers/assetController.js';
import verifyToken from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, addAsset);
router.get('/', verifyToken, getAllAssets);
router.get('/:id', verifyToken, getAssetById);
router.put('/:id', verifyToken, updateAsset);
router.delete('/:id', verifyToken, deleteAsset);

export default router;
