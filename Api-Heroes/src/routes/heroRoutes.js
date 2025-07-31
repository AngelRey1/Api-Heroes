import express from 'express';
import { getAllHeroes, addHero, getHeroById, updateHero, deleteHero } from '../controllers/heroController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de héroes
router.get('/', authMiddleware, getAllHeroes);
router.post('/', authMiddleware, addHero);
router.get('/:id', authMiddleware, getHeroById);
router.put('/:id', authMiddleware, updateHero);
router.delete('/:id', authMiddleware, deleteHero);

export default router; 