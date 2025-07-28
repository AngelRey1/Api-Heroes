import express from 'express';
import { getAllHeroes, addHero, getHeroById, updateHero, deleteHero, findHeroesByCity, faceVillain, getHeroPets, customizeHero } from '../controllers/heroController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { check } from 'express-validator';

const router = express.Router();

// Rutas de héroes
router.get('/', authMiddleware, getAllHeroes);
router.post('/', [
    authMiddleware,
    check('name').not().isEmpty().withMessage('El nombre es requerido'),
    check('alias').not().isEmpty().withMessage('El alias es requerido')
], addHero);
router.get('/:id', authMiddleware, getHeroById);
router.put('/:id', authMiddleware, updateHero);
router.delete('/:id', authMiddleware, deleteHero);
router.get('/city/:city', findHeroesByCity);
router.post('/:id/face-villain', authMiddleware, faceVillain);
router.get('/:id/pets', authMiddleware, getHeroPets);
router.put('/:id/customize', authMiddleware, customizeHero);

export default router; 