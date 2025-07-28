import express from 'express';
import { getAllMinigames, getMinigameById, saveScore, getHighScores, getUserMinigameStats } from '../controllers/minigameController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllMinigames);
router.get('/user/stats', authMiddleware, getUserMinigameStats);
router.get('/:id', getMinigameById);
router.get('/:id/highscores', getHighScores);
router.post('/:id/score', authMiddleware, saveScore);

export default router; 