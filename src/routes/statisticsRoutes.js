import express from 'express';
import { getUserStatistics, getComparativeStatistics, getGlobalStatistics, getUserActivityHistory, getUserRecommendations } from '../controllers/statisticsController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de estadísticas
router.get('/user', authMiddleware, getUserStatistics);
router.get('/comparative', authMiddleware, getComparativeStatistics);
router.get('/global', getGlobalStatistics);
router.get('/activity-history', authMiddleware, getUserActivityHistory);
router.get('/recommendations', authMiddleware, getUserRecommendations);

export default router; 