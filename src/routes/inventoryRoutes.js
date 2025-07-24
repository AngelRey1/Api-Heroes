import express from 'express';
import { getInventory, useItem } from '../controllers/inventoryController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getInventory);
router.post('/use', authMiddleware, useItem);

export default router; 