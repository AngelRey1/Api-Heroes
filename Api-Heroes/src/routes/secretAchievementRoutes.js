import express from 'express';
import { getUserSecretAchievements, checkSecretTrigger, activateEasterEgg, getEasterEggStats, generateRandomEasterEgg, initializeSecretAchievements } from '../controllers/secretAchievementController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de logros secretos
router.get('/', authMiddleware, getUserSecretAchievements);
router.post('/trigger', authMiddleware, checkSecretTrigger);
router.post('/easter-egg', authMiddleware, activateEasterEgg);
router.get('/easter-egg/stats', authMiddleware, getEasterEggStats);
router.post('/easter-egg/random', authMiddleware, generateRandomEasterEgg);
router.post('/initialize', initializeSecretAchievements);

export default router; 