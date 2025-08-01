import express from 'express';
import { getUserMissions, generateMissions, claimMissionReward } from '../controllers/missionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user', authMiddleware, getUserMissions);
router.post('/generate', authMiddleware, generateMissions);
router.post('/:missionId/claim', authMiddleware, claimMissionReward);

export default router; 