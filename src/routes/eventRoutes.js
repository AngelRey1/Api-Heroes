import express from 'express';
import { getActiveEvent, getUserEventProgress, scheduleEvents } from '../controllers/eventController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/active', getActiveEvent);
router.get('/user-progress', authMiddleware, getUserEventProgress);
router.post('/generate', scheduleEvents);

export default router; 