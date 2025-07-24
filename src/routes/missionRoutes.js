import express from 'express';
import { getMissions, updateMissionProgress, claimMission, resetMissions } from '../controllers/missionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getMissions);
router.post('/:id/progress', authMiddleware, updateMissionProgress);
router.post('/:id/claim', authMiddleware, claimMission);
router.post('/reset', authMiddleware, resetMissions);

export default router; 