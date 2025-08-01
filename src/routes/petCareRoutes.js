import express from 'express';
import { 
    feedPet, 
    waterPet, 
    playWithPet, 
    walkPet, 
    bathePet, 
    sleepPet, 
    wakePet, 
    petPet,
    healPet,
    getPetStatus,
    getPetActivityHistory
} from '../controllers/petCareController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas de cuidado de mascotas
router.post('/:petId/feed', authMiddleware, feedPet);
router.post('/:petId/water', authMiddleware, waterPet);
router.post('/:petId/play', authMiddleware, playWithPet);
router.post('/:petId/walk', authMiddleware, walkPet);
router.post('/:petId/bathe', authMiddleware, bathePet);
router.post('/:petId/sleep', authMiddleware, sleepPet);
router.post('/:petId/wake', authMiddleware, wakePet);
router.post('/:petId/pet', authMiddleware, petPet);
router.post('/:petId/heal', authMiddleware, healPet);
router.get('/:petId/status', authMiddleware, getPetStatus);
router.get('/:petId/history', authMiddleware, getPetActivityHistory);

export default router; 