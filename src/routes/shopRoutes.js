import express from 'express';
import { buyItem } from '../controllers/shopController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/buy', authMiddleware, buyItem);

export default router; 