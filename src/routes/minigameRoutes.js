import express from 'express';
import { getAllMinigames, getMinigame, createMinigame, updateMinigame, deleteMinigame, saveScore, getMinigameRanking } from '../controllers/minigameController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllMinigames);
router.get('/:id', getMinigame);
router.post('/', createMinigame);
router.put('/:id', updateMinigame);
router.delete('/:id', deleteMinigame);
router.post('/:id/score', authMiddleware, saveScore);
router.get('/:id/ranking', getMinigameRanking);

export default router; 