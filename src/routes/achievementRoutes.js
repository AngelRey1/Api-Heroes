import express from 'express';
import { getAllAchievements, getAchievement, createAchievement, updateAchievement, deleteAchievement, claimAchievement, getUserAchievements, initializeAchievements, getSecretAchievements } from '../controllers/achievementController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllAchievements);
router.get('/user', authMiddleware, getUserAchievements);
router.get('/:id', getAchievement);
router.post('/', createAchievement);
router.post('/initialize', initializeAchievements);
router.put('/:id', updateAchievement);
router.delete('/:id', deleteAchievement);
router.post('/:id/claim', authMiddleware, claimAchievement);
router.get('/secret/unlocked', authMiddleware, getSecretAchievements);

export default router; 