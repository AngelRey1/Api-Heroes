import express from 'express';
import { feedPet, playWithPet, bathPet, sleepPet, healPet, getPetStatus, checkAbandonment, getCareStats } from '../controllers/petCareController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de cuidado de mascotas
router.post('/:id/feed', authMiddleware, feedPet);
router.post('/:id/play', authMiddleware, playWithPet);
router.post('/:id/bath', authMiddleware, bathPet);
router.post('/:id/sleep', authMiddleware, sleepPet);
router.post('/:id/heal', authMiddleware, healPet);
router.get('/:id/status', authMiddleware, getPetStatus);
router.get('/:id/abandonment', authMiddleware, checkAbandonment);
router.get('/stats', authMiddleware, getCareStats);

export default router; 