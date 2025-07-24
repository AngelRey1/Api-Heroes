import express from 'express';
import { getActiveEvents, claimDailyReward } from '../controllers/eventController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/active', authMiddleware, getActiveEvents);
router.post('/daily-reward', authMiddleware, claimDailyReward);

export default router; 