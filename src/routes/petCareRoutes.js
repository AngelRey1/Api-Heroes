import express from 'express';
import { feedPet, walkPet, customizePet, playWithPet, bathPet, sleepPet, getPetStatus, getCareStats } from '../controllers/petCareController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de cuidado de mascotas
router.post('/:petId/feed', authMiddleware, feedPet);
router.post('/:petId/walk', authMiddleware, walkPet);
router.post('/:petId/customize', authMiddleware, customizePet);
router.post('/:petId/play', authMiddleware, playWithPet);
router.post('/:petId/bath', authMiddleware, bathPet);
router.post('/:petId/sleep', authMiddleware, sleepPet);
router.get('/:petId/status', authMiddleware, getPetStatus);
router.get('/stats', authMiddleware, getCareStats);

export default router; 